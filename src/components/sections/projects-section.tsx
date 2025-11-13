"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project, SiteConfig } from "@prisma/client"
import { useState, useRef, MouseEvent } from "react"

interface ProjectsSectionProps {
  projects: Project[]
  config: SiteConfig | null
}

function ProjectCard({ project, index, gradientFrom, gradientTo, accentColor }: {
  project: any
  index: number
  gradientFrom: string
  gradientTo: string
  accentColor: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: mousePosition.x !== 0 ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Glow effect following mouse */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientFrom}15, transparent 40%)`,
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${accentColor}40, transparent 40%)`,
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <div className="relative h-64 overflow-hidden">
        <div
          className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          style={{
            background: project.imageUrl
              ? `url(${project.imageUrl})`
              : `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 text-sm font-medium rounded-full capitalize">
            {project.category}
          </span>
        </div>
      </div>

      <div className="relative p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {project.title}
        </h3>

        <p className="text-gray-600 leading-relaxed mb-4">
          {project.description}
        </p>

        <Button
          variant="ghost"
          className="group/btn p-0 h-auto font-medium transition-colors"
          style={{ color: accentColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          View Project
          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}

export function ProjectsSection({ projects: dbProjects, config }: ProjectsSectionProps) {
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const accentColor = config?.accentColor || "#6366f1"
  const projectsTitle = config?.projectsTitle || "Featured Projects"
  const projectsDescription = config?.projectsDescription || "Explore our portfolio of award-winning architectural projects that showcase innovation and excellence."
  // Fallback to default projects if none in database
  const defaultProjects = [
    {
      id: "1",
      title: "Modern Skyline Tower",
      category: "commercial",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      description: "A 40-story mixed-use development featuring sustainable design principles.",
      featured: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Riverside Residence",
      category: "residential",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      description: "Contemporary family home with panoramic river views and eco-friendly features.",
      featured: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Cultural Arts Center",
      category: "cultural",
      imageUrl: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&h=600&fit=crop",
      description: "Dynamic performance venue combining traditional and modern architectural elements.",
      featured: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const projects = dbProjects.length > 0 ? dbProjects : defaultProjects
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
            }}
          >
            {projectsTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {projectsDescription}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              gradientFrom={gradientFrom}
              gradientTo={gradientTo}
              accentColor={accentColor}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            style={{
              background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}