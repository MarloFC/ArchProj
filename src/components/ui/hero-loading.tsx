"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import type { SiteConfig } from "@prisma/client"

const STORAGE_KEY = "hero_loading_timestamp"
const SHOW_INTERVAL = 30 * 60 * 1000 // 30 minutes in milliseconds
const LOADING_DURATION = 3000 // 3 seconds

interface HeroLoadingProps {
  config: SiteConfig | null
}

export function HeroLoading({ config }: HeroLoadingProps) {
  const [showLoading, setShowLoading] = useState(() => {
    // Check immediately if we should show
    if (typeof window === 'undefined') return false

    const lastShownTime = localStorage.getItem(STORAGE_KEY)
    const currentTime = Date.now()

    if (!lastShownTime) {
      return true
    }

    const timeDiff = currentTime - parseInt(lastShownTime, 10)
    return timeDiff >= SHOW_INTERVAL
  })
  const accentColor = config?.accentColor || "#6366f1"

  useEffect(() => {
    if (!showLoading) return

    // Update timestamp
    const currentTime = Date.now()
    localStorage.setItem(STORAGE_KEY, currentTime.toString())

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, LOADING_DURATION)

    return () => clearTimeout(timer)
  }, [showLoading])

  return (
    <AnimatePresence>
      {showLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: accentColor
          }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 },
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className="relative w-32 h-32 md:w-40 md:h-40"
          >
            <Image
              src="/loading-spinner.svg"
              alt="Loading"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
