"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import type { SiteConfig } from "@prisma/client"

interface ContactSectionProps {
  config: SiteConfig | null
}

export function ContactSection({ config }: ContactSectionProps) {
  const gradientFrom = config?.gradientFrom || "#6366f1"
  const gradientTo = config?.gradientTo || "#8b5cf6"
  const accentColor = config?.accentColor || "#6366f1"

  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Let's transform your vision into architectural reality. Contact us today 
              for a consultation and discover how we can bring your ideas to life.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-white/90">contact@architecturalexcellence.com</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-white/90">+1 (555) 123-4567</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-white/90">123 Design Street, Creative City, CC 12345</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Send us a message
            </h3>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                    style={{
                      ['--tw-ring-color' as any]: accentColor
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accentColor
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    placeholder="John"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accentColor
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Interior Design</option>
                  <option>Consultation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition-colors resize-none"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = accentColor
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}40`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  placeholder="Tell us about your project..."
                />
              </div>
              
              <Button
                className="w-full text-white font-medium py-3"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}