"use client"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    title: string | null
    description: string | null
    detailedDescription: string | null
    icon: string | null
    iconSvg: string | null
    iconImageUrl: string | null
  } | null
  gradientFrom?: string
  gradientTo?: string
  originRect?: DOMRect | null
}

export function ServiceModal({ isOpen, onClose, service, gradientFrom = "#6366f1", gradientTo = "#8b5cf6", originRect }: ServiceModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      setHasAnimated(false)
      // Trigger animation after a tiny delay to ensure CSS transition works
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHasAnimated(true)
        })
      })
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
    setHasAnimated(false)
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 400) // Match animation duration
  }

  if (!isOpen && !isClosing) return null
  if (!service) return null

  // Calculate the position and scale transforms for morphing effect
  const getMorphTransform = () => {
    if (!originRect) {
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

    // When NOT animated yet (opening) or closing, show card position
    // When animated (opened), show modal position
    if (!hasAnimated || isClosing) {
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
        !hasAnimated && !isClosing ? 'bg-black/0' : isClosing ? 'bg-black/0' : 'bg-black/50 backdrop-blur-sm'
      }`}
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl transition-all duration-400 ease-in-out my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...morphStyle,
          opacity: (!hasAnimated && !isClosing) ? 0.8 : 1,
        }}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 transition-opacity duration-200 ${
            !hasAnimated ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className={`mb-4 sm:mb-6 flex justify-center transition-all duration-300 ${
            !hasAnimated ? 'opacity-70 scale-75' : 'opacity-100 scale-100'
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
                  alt={service.title || "Service"}
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
            !hasAnimated ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {service.title || "Untitled Service"}
          </h2>

          {/* Short description */}
          <div
            className={`text-base sm:text-lg text-gray-600 text-center mb-4 sm:mb-6 transition-all duration-300 delay-100 prose prose-sm sm:prose-lg max-w-none
              [&>p]:text-center [&>p]:text-gray-600 [&>p]:mb-2
              [&>h1]:text-center [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:text-gray-900
              [&>h2]:text-center [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:text-gray-900
              [&>ul]:text-left [&>ul]:mx-auto [&>ul]:max-w-2xl [&>ul]:list-disc [&>ul]:pl-6
              [&>ol]:text-left [&>ol]:mx-auto [&>ol]:max-w-2xl [&>ol]:list-decimal [&>ol]:pl-6
              [&>li]:text-gray-600 [&>li]:mb-1
              [&>strong]:font-bold [&>em]:italic
              ${!hasAnimated ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            dangerouslySetInnerHTML={{ __html: service.description || "" }}
          />

          {/* Divider */}
          <div className={`border-t border-gray-200 my-4 sm:my-6 transition-all duration-300 delay-150 ${
            !hasAnimated ? 'opacity-0' : 'opacity-100'
          }`}></div>

          {/* Detailed description */}
          <div
            className={`prose prose-sm sm:prose-lg max-w-none transition-all duration-300 delay-200
              [&>p]:text-gray-700 [&>p]:mb-4 [&>p]:leading-relaxed
              [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900
              [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:text-gray-900
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4
              [&>li]:text-gray-700 [&>li]:mb-2 [&>li]:leading-relaxed
              [&>strong]:font-bold [&>em]:italic
              ${!hasAnimated ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            dangerouslySetInnerHTML={{ __html: service.detailedDescription || service.description || "" }}
          />

          {/* Close button at bottom */}
          <div className={`mt-6 sm:mt-8 flex justify-center transition-all duration-300 delay-250 ${
            !hasAnimated ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
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
