"use client"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    title: string
    description: string
    detailedDescription: string | null
    icon: string
    iconSvg: string | null
    iconImageUrl: string | null
  } | null
  gradientFrom?: string
  gradientTo?: string
  originRect?: DOMRect | null
}

export function ServiceModal({ isOpen, onClose, service, gradientFrom = "#6366f1", gradientTo = "#8b5cf6", originRect }: ServiceModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // Prevent scroll events
      const preventScroll = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Keep scrollbar visible but prevent scrolling
      document.body.style.overflowY = 'scroll'

      // Add event listeners to prevent scroll
      window.addEventListener('scroll', preventScroll, { passive: false })
      window.addEventListener('wheel', preventScroll, { passive: false })
      window.addEventListener('touchmove', preventScroll, { passive: false })
      document.body.addEventListener('scroll', preventScroll, { passive: false })
      document.body.addEventListener('wheel', preventScroll, { passive: false })
      document.body.addEventListener('touchmove', preventScroll, { passive: false })

      setIsClosing(false)
      setIsAnimating(true)
      // Trigger animation after a tiny delay to ensure CSS transition works
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false)
        })
      })

      // Cleanup function for event listeners
      return () => {
        window.removeEventListener('scroll', preventScroll)
        window.removeEventListener('wheel', preventScroll)
        window.removeEventListener('touchmove', preventScroll)
        document.body.removeEventListener('scroll', preventScroll)
        document.body.removeEventListener('wheel', preventScroll)
        document.body.removeEventListener('touchmove', preventScroll)
        document.body.style.overflowY = ''
      }
    } else {
      // Restore scrolling
      document.body.style.overflowY = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(true)
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 400) // Match animation duration
  }

  if (!isOpen && !isClosing) return null
  if (!service) return null

  // Calculate the position and scale transforms for morphing effect
  const getMorphTransform = () => {
    if (!originRect || !isAnimating) {
      return {
        transform: 'translate(0, 0) scale(1)',
        width: '100%',
        maxWidth: '42rem', // max-w-2xl
      }
    }

    // Get viewport center
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const centerX = viewportWidth / 2
    const centerY = viewportHeight / 2

    // Calculate card center position
    const cardCenterX = originRect.left + originRect.width / 2
    const cardCenterY = originRect.top + originRect.height / 2

    // Calculate translation needed (from card position to viewport center)
    const translateX = cardCenterX - centerX
    const translateY = cardCenterY - centerY

    // Calculate scale (from card size to modal size)
    const modalWidth = Math.min(672, viewportWidth - 32) // max-w-2xl = 42rem = 672px, with padding
    const scaleRatio = originRect.width / modalWidth

    if (isClosing) {
      return {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleRatio})`,
        width: `${modalWidth}px`,
        maxWidth: `${modalWidth}px`,
      }
    } else {
      return {
        transform: 'translate(0, 0) scale(1)',
        width: '100%',
        maxWidth: '42rem',
      }
    }
  }

  const morphStyle = getMorphTransform()

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-400 overflow-y-auto ${
        isAnimating && !isClosing ? 'bg-black/0' : isClosing ? 'bg-black/0' : 'bg-black/50 backdrop-blur-sm'
      }`}
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl transition-all duration-400 ease-in-out my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...morphStyle,
          opacity: (isAnimating && !isClosing) ? 0.8 : 1,
        }}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 transition-opacity duration-200 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className={`mb-4 sm:mb-6 flex justify-center transition-all duration-300 ${
            isAnimating ? 'opacity-70 scale-75' : 'opacity-100 scale-100'
          }`}>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-400"
              style={{
                background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
              }}
            >
              {service.iconImageUrl ? (
                <img
                  src={service.iconImageUrl}
                  alt={service.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              ) : service.iconSvg ? (
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                  dangerouslySetInnerHTML={{ __html: service.iconSvg }}
                />
              ) : (
                <span className="text-sm text-white font-medium">{service.icon}</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4 transition-all duration-300 delay-75 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {service.title}
          </h2>

          {/* Short description */}
          <p className={`text-base sm:text-lg text-gray-600 text-center mb-4 sm:mb-6 transition-all duration-300 delay-100 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {service.description}
          </p>

          {/* Divider */}
          <div className={`border-t border-gray-200 my-4 sm:my-6 transition-all duration-300 delay-150 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}></div>

          {/* Detailed description */}
          <div className={`prose prose-sm sm:prose-lg max-w-none transition-all duration-300 delay-200 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {service.detailedDescription || service.description}
            </p>
          </div>

          {/* Close button at bottom */}
          <div className={`mt-6 sm:mt-8 flex justify-center transition-all duration-300 delay-250 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <Button
              onClick={handleClose}
              className="text-white px-6 sm:px-8 py-2 text-sm sm:text-base"
              style={{
                background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
