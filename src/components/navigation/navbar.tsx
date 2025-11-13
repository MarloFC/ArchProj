"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, User } from "lucide-react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import type { SiteConfig } from "@prisma/client"

interface NavbarProps {
  config?: SiteConfig | null
}

export function Navbar({ config }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const logoName = config?.logoName || "ArchStudio"

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">{logoName}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Services
            </Link>
            <Link href="#projects" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Projects
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
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
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3">
              <Link 
                href="#services" 
                className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="#projects" 
                className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
              <Link 
                href="#contact" 
                className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {session ? (
                <>
                  <Link 
                    href="/admin"
                    className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button 
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="px-3 py-2 text-left text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}