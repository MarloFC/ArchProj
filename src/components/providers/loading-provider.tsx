"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const STORAGE_KEY = "hero_loading_timestamp"
const SHOW_INTERVAL = 30 * 60 * 1000 // 30 minutes in milliseconds
const LOADING_DURATION = 3000 // 3 seconds

interface LoadingProviderProps {
  children: React.ReactNode
  accentColor?: string
}

export function LoadingProvider({ children, accentColor = "#6366f1" }: LoadingProviderProps) {
  const [showLoading, setShowLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if we should show the loading animation
    const lastShownTime = localStorage.getItem(STORAGE_KEY)
    const currentTime = Date.now()

    let shouldShow = false
    if (!lastShownTime) {
      // First time visit
      shouldShow = true
      localStorage.setItem(STORAGE_KEY, currentTime.toString())
    } else {
      const timeDiff = currentTime - parseInt(lastShownTime, 10)

      if (timeDiff >= SHOW_INTERVAL) {
        // 30 minutes have passed
        shouldShow = true
        localStorage.setItem(STORAGE_KEY, currentTime.toString())
      }
    }

    if (shouldShow) {
      setShowLoading(true)

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, LOADING_DURATION)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {showLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: accentColor
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
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
      {children}
    </>
  )
}
