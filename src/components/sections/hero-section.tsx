"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Building2 } from "lucide-react"
import type { SiteConfig } from "@prisma/client"

interface HeroSectionProps {
  config: SiteConfig | null
}

export function HeroSection({ config }: HeroSectionProps) {
  // Use database config or fallback to defaults
  const heroTitle = config?.heroTitle || "Architectural Excellence"
  const heroSubtitle = config?.heroSubtitle || "Creating spaces that inspire and endure"
  const heroDescription = config?.heroDescription || "Transform your vision into reality with our innovative architectural solutions."
  const heroButton1Text = config?.heroButton1Text || "View Projects"
  const heroButton2Text = config?.heroButton2Text || "Get Consultation"
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <motion.div
        style={{
          y,
          opacity,
          background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
        }}
        className="absolute inset-0"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 flex items-center justify-center">
              {/* <Building2 size={48} className="text-white/90" /> */}
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              <span
                className="block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent prose prose-lg max-w-none
                  [&>p]:inline [&>p]:text-inherit [&>p]:font-inherit [&>p]:text-5xl [&>p]:md:text-7xl [&>p]:leading-tight
                  [&>strong]:font-bold [&>em]:italic"
                dangerouslySetInnerHTML={{ __html: heroTitle }}
              />
            </h1>

            <div
              className="mb-8 text-xl text-white/90 md:text-2xl prose prose-xl max-w-none
                [&>p]:text-white/90 [&>p]:text-xl [&>p]:md:text-2xl [&>p]:mb-0
                [&>strong]:font-bold [&>em]:italic"
              dangerouslySetInnerHTML={{ __html: heroSubtitle }}
            />

            <div
              className="mx-auto mb-10 max-w-2xl text-lg text-white/80 prose prose-lg max-w-2xl
                [&>p]:text-white/80 [&>p]:text-lg [&>p]:mb-2
                [&>strong]:font-bold [&>em]:italic"
              dangerouslySetInnerHTML={{ __html: heroDescription }}
            />
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                {heroButton1Text}
              </Button>
              <Button
                size="lg"
                style={{
                  background: `linear-gradient(to left, ${gradientFrom}, ${gradientTo})`,
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                {heroButton2Text}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/80"
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>
    </div>
  )
}