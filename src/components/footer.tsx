"use client"

import { Mail, MapPin, Phone, Instagram, MessageCircle } from "lucide-react"
import Link from "next/link"
import type { SiteConfig } from "@prisma/client"

interface FooterProps {
  config: SiteConfig | null
}

export function Footer({ config }: FooterProps) {
  const companyName = "Gato Arquitetura"
  const contactEmail = config?.contactEmail || ""
  const contactPhone = config?.contactPhone || ""
  const contactAddress = config?.contactAddress || ""
  const contactWhatsapp = config?.contactWhatsapp || "https://wa.me/5522992231569"
  const contactInstagram = config?.contactInstagram || "https://www.instagram.com/gatoarquitetura?igsh=MWUwZWE4dXJ1dm5zcA=="
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const alternativeColor = config?.alternativeColor || "#DB650F"

  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-white" style={{ backgroundColor: alternativeColor }}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3
              className="text-2xl font-bold mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
              }}
            >
              {companyName}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Transformando espaços em experiências únicas através do design e da arquitetura.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projetos
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Equipe
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              {contactEmail && (
                <li className="flex items-start gap-2">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: gradientFrom }} />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-gray-400 hover:text-white transition-colors break-all"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: gradientFrom }} />
                  <a
                    href={`https://wa.me/5522992231569`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={contactInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  background: `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
                  e.currentTarget.querySelector('svg')?.classList.add('text-white')
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`
                  e.currentTarget.querySelector('svg')?.classList.remove('text-white')
                }}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 transition-colors duration-300" style={{ color: gradientFrom }} />
              </a>
              <a
                href={contactWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  background: `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
                  e.currentTarget.querySelector('svg')?.classList.add('text-white')
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}15, ${gradientTo}15)`
                  e.currentTarget.querySelector('svg')?.classList.remove('text-white')
                }}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 transition-colors duration-300" style={{ color: gradientFrom }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {companyName}. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
