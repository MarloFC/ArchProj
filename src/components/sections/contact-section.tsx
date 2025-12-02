"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Send, Instagram, MessageCircle } from "lucide-react"
import type { SiteConfig } from "@prisma/client"
import { toast } from "sonner"

interface ContactSectionProps {
  config: SiteConfig | null
}

export function ContactSection({ config }: ContactSectionProps) {
  const [firstname, setFirstname] = useState("")
  const [email, setEmail] = useState("")
  const [project, setProject] = useState("Residencial")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const accentColor = config?.accentColor || "#6366f1"
  const contactTitle = config?.contactTitle || ""
  const contactDescription = config?.contactDescription || ""
  const contactFormTitle = config?.contactFormTitle || ""
  const contactEmail = config?.contactEmail || ""
  const contactWhatsapp = config?.contactWhatsapp || "https://wa.me/5522992231569"
  const contactInstagram = config?.contactInstagram || "https://www.instagram.com/gatoarquitetura?igsh=MWUwZWE4dXJ1dm5zcA=="

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setEmailCopied(true)
      toast.success("Email copiado!")
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      toast.error("Erro ao copiar email")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname: "",
          email,
          message,
          project,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        toast.success("Mensagem enviada com sucesso!")
        setFirstname("")
        setEmail("")
        setMessage("")
        setProject("Residencial")
      } else {
        toast.error("Erro ao enviar mensagem. Tente novamente.")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              {contactTitle}
            </h2>

            <div
              className="text-xl text-white/90 mb-8 leading-relaxed prose prose-xl max-w-none
                [&>p]:text-white/90 [&>p]:text-xl [&>p]:mb-2 [&>p]:leading-relaxed
                [&>strong]:font-bold [&>em]:italic"
              dangerouslySetInnerHTML={{ __html: contactDescription }}
            />

            <div className="space-y-4">
              {/* Social icons */}
              <div className="flex items-center space-x-4">
                <a
                  href={contactInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors cursor-pointer relative group/instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 relative z-0" />
                  <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover/instagram:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-10">
                    Clique para visitar
                  </span>
                </a>
                <a
                  href={contactWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors cursor-pointer relative group/whatsapp"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 relative z-0" />
                  <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover/whatsapp:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-10">
                    Clique para conversar
                  </span>
                </a>
                <div
                  className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors cursor-pointer relative group/email"
                  onClick={handleCopyEmail}
                  aria-label="Copy email"
                >
                  <Mail className="w-5 h-5 relative z-0" />
                  <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover/email:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-10">
                    Clique para copiar o email
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              {contactFormTitle}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome field (full width) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  style={{
                    ['--tw-ring-color' as any]: accentColor
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  placeholder="nome@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Projeto
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <option>Residencial</option>
                  <option>Comercial</option>
                  <option>Design de interiores</option>
                  <option>Consultoria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors resize-none"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  placeholder="Nos conte um pouco do seu projeto..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-medium py-3"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.opacity = '1'
                }}
              >
                {isSubmitting ? "Enviando..." : "Entre em contato"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}