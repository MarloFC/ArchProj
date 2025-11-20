"use client"

import type { Project } from "@prisma/client"

interface ProjectCardProps {
  project: Project
  color?: string
}

export function ProjectCard({ project, color = "#f97316" }: ProjectCardProps) {
  // Create a URL-friendly id from the project title
  const projectId = (project.title || 'project').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div id={projectId} className="relative w-full aspect-[4/5] overflow-hidden shadow-lg group cursor-pointer">
      {/* Background Image Layer - absolute positioning to cover full card */}
      <div className="absolute inset-0">
        <img
          src={project.imageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop"}
          alt={project.title || "Project"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Foreground Colored Block - positioned at top-left corner */}
      <div
        className="absolute opacity-95 top-0 left-0 w-3/5 md:w-[56%] p-3 md:p-6 flex flex-col justify-start text-white transition-all duration-300 min-h-[140px] md:min-h-[180px]"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 leading-tight break-words">
          {project.title}
        </h3>
        <p className="text-xs md:text-sm opacity-90 mb-1 capitalize">
          {project.category}
        </p>
        <p className="text-xs opacity-75 line-clamp-2 md:line-clamp-3 break-words">
          {project.description}
        </p>
      </div>

      {/* Textarea content on hover - positioned above bottom */}
      {project.textarea && (
        <div className="absolute left-6 right-6 bottom-24 md:bottom-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 md:p-5 text-white">
            <p className="text-xs md:text-sm leading-relaxed overflow-hidden line-clamp-6">
              {project.textarea}
            </p>
          </div>
        </div>
      )}

      {/* Hover overlay on image area */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  )
}
