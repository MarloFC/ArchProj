"use client"

import type { Project } from "@prisma/client"

interface ProjectCardProps {
  project: Project
  color?: string
}

export function ProjectCard({ project, color = "#f97316" }: ProjectCardProps) {
  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden shadow-lg group cursor-pointer">
      {/* Background Image Layer - absolute positioning to cover full card */}
      <div className="absolute inset-0">
        <img
          src={project.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Foreground Colored Block - positioned at top-left corner */}
      <div
        className="absolute opacity-95 top-0 left-0 w-2/5 h-15vh p-6 flex flex-col justify-end text-white transition-all duration-300"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-2xl font-bold mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-sm opacity-90 mb-1">
          {project.category}
        </p>
        <p className="text-xs opacity-75 line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Hover overlay on image area */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  )
}
