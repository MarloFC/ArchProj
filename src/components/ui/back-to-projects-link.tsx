"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export function BackToProjectsLink() {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Navigate to home page
    router.push('/')

    // Wait for navigation and then scroll to projects section
    setTimeout(() => {
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <a
      href="/#projects"
      onClick={handleClick}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors cursor-pointer"
    >
      <ChevronLeft className="w-5 h-5 mr-1" />
      Voltar
    </a>
  )
}
