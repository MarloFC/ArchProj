"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, User } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import type { SiteConfig } from "@prisma/client"

interface NavbarProps {
  config?: SiteConfig | null
}

export function Navbar({ config }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const logoName = config?.logoName || ""
  const logoSvg = config?.logoSvg
  const logoWidth = config?.logoWidth || 20
  const logoHeight = config?.logoHeight || 20

  const toggleMenu = () => setIsOpen(!isOpen)

  // Helper function to determine the correct href for section links
  const getSectionLink = (hash: string) => {
    // If we're on the home page, just use the hash
    if (pathname === "/") {
      return hash
    }
    // Otherwise, redirect to home with the hash
    return `/${hash}`
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            {logoSvg ? (
              <div
                style={{ width: `${logoWidth * 4}px`, height: `${logoHeight * 4}px` }}
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: logoSvg }}
              />
            ) : (
              logoName && <Building2 className="w-8 h-8 text-gray-600" />
            )}
            {logoName && <span className="text-xl font-bold text-gray-900">{logoName}</span>}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={getSectionLink("#services")} className="group relative text-gray-700 hover:text-gray-900 transition-colors">
              Serviços
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href={getSectionLink("#projects")} className="group relative text-gray-700 hover:text-gray-900 transition-colors">
              Projetos
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href={getSectionLink("#contact")} className="group relative text-gray-700 hover:text-gray-900 transition-colors">
              Contato
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href="/team" className="group relative text-gray-700 hover:text-gray-900 transition-colors">
              Equipe
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sair
                </Button>
              </div>
            ) : (
              // <Link href="/auth/signin">
              //   <Button variant="ghost" size="sm">
              //     Admin Login
              //   </Button>
              // </Link>
              <></>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100vh - 4rem)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed top-16 left-0 w-full bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-6">
                <Link
                  href={getSectionLink("#services")}
                  className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Serviços
                </Link>
                <Link
                  href={getSectionLink("#projects")}
                  className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Projetos
                </Link>
                <Link
                  href={getSectionLink("#contact")}
                  className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contato
                </Link>
                <Link
                  href="/team"
                  className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Equipe
                </Link>

                {session ? (
                  <>
                    <Link
                      href="/admin"
                      className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Painel Admin
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="text-lg font-medium text-left text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login Admin
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}