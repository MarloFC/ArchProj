import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

// In-memory rate limiter per IP: max 5 submissions per 10 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5
const ipRequestHistory = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = ipRequestHistory.get(ip) || []

  // Filter out timestamps outside the window
  const recentTimestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW_MS)

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, recentTimestamps)
    return true
  }

  recentTimestamps.push(now)
  ipRequestHistory.set(ip, recentTimestamps)
  return false
}

// Clean up stale IP records every hour to prevent memory growth
setInterval(() => {
  const now = Date.now()
  for (const [ip, timestamps] of ipRequestHistory.entries()) {
    const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS)
    if (valid.length === 0) {
      ipRequestHistory.delete(ip)
    } else {
      ipRequestHistory.set(ip, valid)
    }
  }
}, 60 * 60 * 1000)

// Helper to escape HTML characters and prevent HTML injection in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Strip CRLF to prevent SMTP header injection
function sanitizeHeader(str: string): string {
  return str.replace(/[\r\n]/g, " ").trim()
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for")
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous"

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { ok: false, error: "Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { firstname, lastname, email, message, project, website, honeypot } = body

    // 2. Honeypot check: If a bot fills out hidden trap fields, silently acknowledge without saving/sending
    if (website || honeypot) {
      console.warn("Honeypot triggered, ignoring submission from bot.")
      return NextResponse.json({ ok: true })
    }

    // 3. Strict Input Validation & Type Checking
    if (
      typeof firstname !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { ok: false, error: "Dados inválidos enviados no formulário." },
        { status: 400 }
      )
    }

    const trimmedFirstname = firstname.trim()
    const trimmedLastname = typeof lastname === "string" ? lastname.trim() : ""
    const trimmedEmail = email.trim()
    const trimmedProject = typeof project === "string" ? project.trim() : "Geral"
    const trimmedMessage = message.trim()

    if (!trimmedFirstname || trimmedFirstname.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Nome inválido ou muito longo (máximo 100 caracteres)." },
        { status: 400 }
      )
    }

    if (trimmedLastname.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Sobrenome muito longo (máximo 100 caracteres)." },
        { status: 400 }
      )
    }

    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
      return NextResponse.json(
        { ok: false, error: "Por favor, insira um endereço de email válido." },
        { status: 400 }
      )
    }

    if (trimmedMessage.length < 2 || trimmedMessage.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "A mensagem deve conter entre 2 e 5000 caracteres." },
        { status: 400 }
      )
    }

    if (trimmedProject.length > 100) {
      return NextResponse.json(
        { ok: false, error: "Tipo de projeto inválido." },
        { status: 400 }
      )
    }

    const fullName = trimmedLastname
      ? `${trimmedFirstname} ${trimmedLastname}`
      : trimmedFirstname

    // 4. Save to Database
    await prisma.lead.create({
      data: {
        name: fullName,
        email: trimmedEmail,
        message: trimmedMessage,
        project: trimmedProject,
      },
    })

    // 5. Get recipient email from site config
    const siteConfig = await prisma.siteConfig.findFirst()
    const recipientEmail = siteConfig?.contactEmail

    if (!recipientEmail) {
      console.error("Recipient email not configured in site settings")
      return NextResponse.json({ ok: true, warning: "Email not sent - recipient not configured" })
    }

    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration not set in environment variables")
      return NextResponse.json({ ok: true, warning: "Email not sent - SMTP not configured" })
    }

    // 6. Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // 7. Sanitize and escape all content before sending
    const safeName = escapeHtml(fullName)
    const safeEmail = escapeHtml(trimmedEmail)
    const safeProject = escapeHtml(trimmedProject)
    const safeMessageHtml = escapeHtml(trimmedMessage).replace(/\n/g, "<br>")

    const emailSubject = sanitizeHeader(`Novo Contato: ${fullName} - ${trimmedProject}`)

    const emailText = `Novo Contato Recebido!
Nome: ${fullName}
Email: ${trimmedEmail}
Tipo de Projeto: ${trimmedProject}

Mensagem:
${trimmedMessage}

---
Enviado através do formulário de contato do site.`

    const emailHtml = `
      <h2>Novo Contato Recebido!</h2>
      <p><strong>Nome:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Tipo de Projeto:</strong> ${safeProject}</p>
      <h3>Mensagem:</h3>
      <p>${safeMessageHtml}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Este contato foi enviado através do formulário de contato do seu site.</p>
    `

    // 8. Send email with both safe text and HTML
    try {
      await transporter.sendMail({
        from: `"${sanitizeHeader(process.env.EMAIL_FROM_NAME || 'Website Contact Form')}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        replyTo: trimmedEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      })

      console.log(`Email sent successfully to ${recipientEmail}`)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      return NextResponse.json({ ok: true, warning: "Lead salvo, mas o envio de notificação por email falhou." })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error in email route:", error)
    return NextResponse.json({ ok: false, error: "Falha ao processar solicitação" }, { status: 500 })
  }
}
