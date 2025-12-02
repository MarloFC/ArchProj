"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import type { SiteConfig } from "@prisma/client"

interface HeroSectionProps {
  config: SiteConfig | null
}

export function HeroSection({ config }: HeroSectionProps) {
  const heroBackgroundImage = config?.heroBackgroundImage
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
    <>
      {/* Hero Image Only */}
      <div ref={ref} className="relative h-screen overflow-hidden">
        {heroBackgroundImage ? (
          <>
            <motion.div
              style={{ y, opacity }}
              className="absolute inset-0"
            >
              <img
                src={heroBackgroundImage}
                alt="Hero background"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10" />
          </>
        ) : (
          <>
            <motion.div
              style={{
                y,
                opacity,
                background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
              }}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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

      {/* Hero Content Section - Below Image */}
      <HeroContentSection config={config} />
    </>
  )
}

function HeroContentSection({ config }: { config: SiteConfig | null }) {
  const heroTitle = config?.heroTitle || ""
  const heroSubtitle = config?.heroSubtitle || ""
  const heroDescription = config?.heroDescription || ""
  const heroButton1Text = config?.heroButton1Text
  const heroButton2Text = config?.heroButton2Text
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h1 className="mb-6 text-6xl font-bold leading-tight md:text-8xl text-left">
            <span
              className="block bg-gradient-to-r bg-clip-text text-transparent prose prose-lg max-w-none
                [&>p]:inline [&>p]:text-inherit [&>p]:font-inherit [&>p]:text-6xl [&>p]:md:text-8xl [&>p]:leading-tight
                [&>strong]:font-bold [&>em]:italic"
              style={{
                backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
              }}
              dangerouslySetInnerHTML={{ __html: heroTitle }}
            />
          </h1>

          <div
            className="mb-8 text-2xl text-gray-700 md:text-3xl prose prose-xl max-w-none text-left
              [&>p]:text-gray-700 [&>p]:text-2xl [&>p]:md:text-3xl [&>p]:mb-2 [&>p]:leading-relaxed
              [&>strong]:font-bold [&>em]:italic"
            dangerouslySetInnerHTML={{ __html: heroSubtitle }}
          />

          <div
            className="mb-10 max-w-3xl text-lg text-gray-600 prose prose-lg text-left
              [&>p]:text-gray-600 [&>p]:text-lg [&>p]:mb-2 [&>p]:leading-relaxed
              [&>strong]:font-bold [&>em]:italic"
            dangerouslySetInnerHTML={{ __html: heroDescription }}
          />

          {/* {(heroButton1Text || heroButton2Text) && (
            <div className="flex flex-col gap-4 sm:flex-row items-start">
              {heroButton1Text && (
                <Button
                  size="lg"
                  className="text-white font-medium"
                  style={{
                    background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
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
              )}
              {heroButton2Text && (
                <Button
                  size="lg"
                  className="text-white font-medium"
                  style={{
                    background: `linear-gradient(to left, ${gradientFrom}, ${gradientTo})`,
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
              )}
            </div>
          )} */}
        </motion.div>
      </div>
    </section>
  )
}