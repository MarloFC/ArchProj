"use client"

import { motion } from "framer-motion"
import { Building2, Home, Paintbrush, Users, Building, Hammer, Lightbulb, MapPin } from "lucide-react"
import type { Service, SiteConfig } from "@prisma/client"

// Map icon names from database to lucide-react icons
const iconMap: Record<string, any> = {
  building: Building2,
  building2: Building2,
  home: Home,
  paintbrush: Paintbrush,
  users: Users,
  hammer: Hammer,
  lightbulb: Lightbulb,
  mappin: MapPin,
}

interface ServicesSectionProps {
  services: Service[]
  config: SiteConfig | null
}

export function ServicesSection({ services: dbServices, config }: ServicesSectionProps) {
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const accentColor = config?.accentColor || "#6366f1"
  // Fallback to default services if none in database
  const defaultServices = [
    {
      icon: "building2",
      title: "Commercial Design",
      description: "Modern office buildings and commercial spaces that enhance productivity and brand identity.",
    },
    {
      icon: "home",
      title: "Residential Architecture",
      description: "Custom homes designed to reflect your lifestyle and create lasting memories.",
    },
    {
      icon: "paintbrush",
      title: "Interior Design",
      description: "Complete interior solutions that harmonize with architectural elements.",
    },
    {
      icon: "users",
      title: "Consultation Services",
      description: "Expert guidance through every phase of your architectural project.",
    },
  ]

  const services = dbServices.length > 0 ? dbServices : defaultServices
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
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive architectural solutions tailored to your unique vision and requirements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon.toLowerCase()] || Building2
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl transition-all duration-300 hover:shadow-xl border border-gray-100"
                style={{
                  ['--hover-from' as any]: `${gradientFrom}10`,
                  ['--hover-to' as any]: `${gradientTo}10`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(to bottom right, ${gradientFrom}10, ${gradientTo}10)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to bottom right, rgb(249, 250, 251), white)'
                }}
              >
                <div
                  className="mb-6 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
                  }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}