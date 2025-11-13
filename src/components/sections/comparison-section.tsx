"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react"
import type { SiteConfig } from "@prisma/client"

interface ComparisonSectionProps {
  config: SiteConfig | null
}

export function ComparisonSection({ config }: ComparisonSectionProps) {
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const accentColor = config?.accentColor || "#6366f1"
  const beforeAfterTitle = config?.beforeAfterTitle || "Before & After"
  const beforeAfterDescription = config?.beforeAfterDescription || "See the transformation. Drag the slider to compare our architectural renovations."
  const beforeImage = config?.beforeImage || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop"
  const afterImage = config?.afterImage || "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop"

  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100

    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !e.touches[0]) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  return (
    <section className="py-20 bg-white">
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
            {beforeAfterTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {beforeAfterDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Right) - Base layer */}
            <div className="absolute inset-0">
              <img
                src={afterImage}
                alt="After renovation"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-semibold text-gray-900">Depois</span>
              </div>
            </div>

            {/* Before Image (Left) - Clipped layer */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
              }}
            >
              <img
                src={beforeImage}
                alt="Before renovation"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-semibold text-gray-900">Antes</span>
              </div>
            </div>

            {/* Slider Line and Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 cursor-ew-resize"
              style={{
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)',
                background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
                boxShadow: '0 0 20px rgba(0,0,0,0.3)'
              }}
            >
              {/* Handle */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                }}
              >
                {/* Left Arrow */}
                <svg
                  className="w-3 h-3 text-white absolute left-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>

                {/* Right Arrow */}
                <svg
                  className="w-3 h-3 text-white absolute right-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-6 text-sm"
          >
            ← Arraste o controle deslizante para comparar o antes e o depois da transformação. →
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
