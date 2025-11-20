"use client"

import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project, SiteConfig } from "@prisma/client"
import { useState, useRef, MouseEvent, useEffect } from "react"

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

  const trackRef = useRef<HTMLDivElement>(null)
  const [mouseDownAt, setMouseDownAt] = useState(0)
  const [prevPercentage, setPrevPercentage] = useState(0)
  const [currentPercentage, setCurrentPercentage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const [isDraggingCarousel, setIsDraggingCarousel] = useState(false)

  // Fallback to default projects if none in database
  const defaultProjects = [
    {
      id: "1",
      title: "Modern Skyline Tower",
      category: "commercial",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
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
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
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
      imageUrl: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&h=800&fit=crop",
      description: "Dynamic performance venue combining traditional and modern architectural elements.",
      featured: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "Sustainable Office Complex",
      category: "commercial",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
      description: "LEED-certified workspace with innovative green technology and design.",
      featured: true,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "5",
      title: "Mountain Villa",
      category: "residential",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      description: "Luxury retreat seamlessly integrated into natural landscape.",
      featured: true,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "6",
      title: "Mountain Villa",
      category: "residential",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      description: "Luxury retreat seamlessly integrated into natural landscape.",
      featured: true,
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const allProjects = dbProjects.length > 0 ? dbProjects : defaultProjects
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Set initial percentage based on device type
      const initialPercentage = mobile ? -12 : -24.7
      setPrevPercentage(initialPercentage)
      setCurrentPercentage(initialPercentage)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use 3 images for mobile, 5 for desktop
  const projects = isMobile ? allProjects : allProjects.slice(0, 6)

  // Carousel navigation for mobile
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)
  }

  // Handle drag for mobile carousel
  const handleCarouselDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setIsDraggingCarousel(false)
  }

  const handleCarouselDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX === 0) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = dragStartX - clientX

    if (Math.abs(diff) > 10) {
      setIsDraggingCarousel(true)
    }
  }

  const handleCarouselDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX === 0) return

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : ('clientX' in e ? e.clientX : dragStartX)
    const diff = dragStartX - clientX

    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left, go to next
        nextSlide()
      } else {
        // Swiped right, go to previous
        prevSlide()
      }
    }

    setDragStartX(0)
    setTimeout(() => setIsDraggingCarousel(false), 100)
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setMouseDownAt(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setMouseDownAt(e.touches[0].clientX)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (mouseDownAt === 0) return

    const mouseDelta = mouseDownAt - e.clientX
    const maxDelta = window.innerWidth

    // If moved more than 5px, consider it a drag
    if (Math.abs(mouseDelta) > 5) {
      setIsDragging(true)
    }

    const percentage = (mouseDelta / maxDelta) * -100
    const nextPercentageUnconstrained = prevPercentage + percentage
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100)

    setCurrentPercentage(nextPercentage)

    if (trackRef.current) {
      trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`

      const images = trackRef.current.getElementsByClassName("gallery-image")
      for (const image of Array.from(images)) {
        (image as HTMLElement).style.objectPosition = `${100 + nextPercentage}% center`
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (mouseDownAt === 0) return

    const mouseDelta = mouseDownAt - e.touches[0].clientX
    const maxDelta = window.innerWidth

    const percentage = (mouseDelta / maxDelta) * -100
    const nextPercentageUnconstrained = prevPercentage + percentage
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100)

    setCurrentPercentage(nextPercentage)

    if (trackRef.current) {
      trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`

      const images = trackRef.current.getElementsByClassName("gallery-image")
      for (const image of Array.from(images)) {
        (image as HTMLElement).style.objectPosition = `${100 + nextPercentage}% center`
      }
    }
  }

  const handleMouseUp = () => {
    if (mouseDownAt === 0) return

    setPrevPercentage(currentPercentage)
    setMouseDownAt(0)

    // Reset dragging state after a short delay to allow click detection
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent prose prose-2xl max-w-none
              [&>p]:inline [&>p]:text-inherit [&>p]:font-inherit [&>p]:text-4xl [&>p]:mb-0
              [&>strong]:font-bold [&>em]:italic"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
            }}
            dangerouslySetInnerHTML={{ __html: projectsTitle }}
          />
          <div
            className="text-xl text-gray-600 max-w-2xl mx-auto prose prose-xl max-w-2xl
              [&>p]:text-gray-600 [&>p]:text-xl [&>p]:mb-2
              [&>strong]:font-bold [&>em]:italic"
            dangerouslySetInnerHTML={{ __html: projectsDescription }}
          />
          <p className="text-sm text-gray-500 mt-4">Arraste ou deslize para explorar</p>
        </motion.div>
      </div>

      {/* Mobile: Simple carousel */}
      <div className="md:hidden relative">
        <div
          className="relative h-[500px] overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleCarouselDragStart}
          onMouseMove={handleCarouselDragMove}
          onMouseUp={handleCarouselDragEnd}
          onMouseLeave={handleCarouselDragEnd}
          onTouchStart={handleCarouselDragStart}
          onTouchMove={handleCarouselDragMove}
          onTouchEnd={handleCarouselDragEnd}
        >
          {projects.map((project, index) => {
            const projectId = (project.title || 'project').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            return (
              <motion.div
                key={project.id}
                className="absolute inset-0 flex items-center justify-center px-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                  x: index === currentSlide ? 0 : index < currentSlide ? -100 : 100,
                  scale: index === currentSlide ? 1 : 0.8,
                }}
                transition={{ duration: 0.5 }}
                style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
              >
                <a
                  href={`/projects#${projectId}`}
                  className="relative group block w-full"
                  onClick={(e) => {
                    if (isDraggingCarousel) {
                      e.preventDefault()
                    }
                  }}
                >
                  <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={project.imageUrl || `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop`}
                      alt={project.title || "Project"}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-medium rounded-full mb-2 capitalize">
                          {project.category}
                        </span>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-200">{project.description}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          style={{ color: accentColor }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          style={{ color: accentColor }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index === currentSlide ? accentColor : '#d1d5db',
                width: index === currentSlide ? '2rem' : '0.5rem',
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Drag gallery */}
      <div
        className="hidden md:block relative h-screen select-none cursor-grab active:cursor-grabbing -mt-20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          ref={trackRef}
          className="absolute left-1/2 top-1/2 flex gap-[4vmin] select-none"
          style={{
            transform: `translate(${currentPercentage}%, -50%)`,
            userSelect: "none",
          }}
        >
          {projects.map((project) => {
            const projectId = (project.title || 'project').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            return (
            <a
              key={project.id}
              href={`/projects#${projectId}`}
              className="relative group w-80 block"
              draggable="false"
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault()
                }
              }}
              onDragStart={(e) => {
                e.preventDefault()
              }}
            >
              <img
                src={project.imageUrl || `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop`}
                alt={project.title || "Project"}
                className="gallery-image w-[40vw] h-[65vmin] object-cover select-none pointer-events-none rounded-2xl shadow-2xl"
                draggable="false"
                style={{
                  objectPosition: `${100 + currentPercentage}% center`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="inline-block px-3 bg-white/20 backdrop-blur-sm text-xs font-medium rounded-full mb-2 capitalize">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold mb-2 overflow-hidden">{project.title}</h3>
                  <p className="text-sm text-gray-200 overflow-hidden line-clamp-2">{project.description}</p>
                </div>
              </div>
            </a>
          )})}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 text-gray-600"
          >
            <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full" />
            </div>
          </motion.div>
          <p className="text-sm text-gray-500 font-medium">Scroll</p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 text-center">
        <a href="/projects">
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
            className="cursor-pointer"
          >
            Veja todos os projetos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>
    </section>
  )
}