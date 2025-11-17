import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstname, lastname, email, message, project } = body

    const fullName = `${firstname} ${lastname}`

    await prisma.lead.create({
      data: {
        name: fullName,
        email,
        message,
        project,
      },
    })

    // Get recipient email from site config
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

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email content
    const emailSubject = `New Lead: ${fullName} - ${project}`
    const emailBody = `
      <h2>New Lead Received!</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Project Type:</strong> ${project}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Este contato foi enviado através do formulário de contato do seu site.</p>
    `

    // Send email
    try {
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Website Contact Form'}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: emailBody,
      })

      console.log(`Email sent successfully to ${recipientEmail}`)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      return NextResponse.json({ ok: true, warning: "Lead saved but email failed to send" })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ ok: false, error: "Failed to process request" }, { status: 500 })
  }
}
