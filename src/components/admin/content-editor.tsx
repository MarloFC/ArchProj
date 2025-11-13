"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Save, Image as ImageIcon } from "lucide-react"

// Memoized components to prevent re-renders
const InputField = memo(({
  label,
  field,
  rows = 2,
  description,
  showAI = true,
  type = "text",
  value,
  onChange,
  onAIGenerate,
  loading
}: {
  label: string
  field: string
  rows?: number
  description: string
  showAI?: boolean
  type?: "text" | "textarea" | "url"
  value: string
  onChange: (value: string) => void
  onAIGenerate: () => void
  loading: boolean
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {label}
          {showAI && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAIGenerate}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Suggest</span>
            </Button>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            rows={rows}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        )}
      </CardContent>
    </Card>
  )
})

InputField.displayName = 'InputField'

const ImageField = memo(({
  label,
  description,
  currentImage,
  value,
  onChange
}: {
  label: string
  description: string
  currentImage: string
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {label}
          <ImageIcon className="w-4 h-4 text-gray-400" />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentImage && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={currentImage}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Enter image URL"
        />
      </CardContent>
    </Card>
  )
})

ImageField.displayName = 'ImageField'

export function ContentEditor() {
  const [content, setContent] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroButton1Text: "",
    heroButton2Text: "",
    logoName: "",
    logoSvg: "",
    beforeAfterTitle: "",
    beforeAfterDescription: "",
    beforeImage: "",
    afterImage: "",
    projectsTitle: "",
    projectsDescription: "",
    contactTitle: "",
    contactDescription: "",
    contactFormTitle: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")

  // Load existing content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/get-config')
        if (response.ok) {
          const data = await response.json()
          setContent({
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
            heroDescription: data.heroDescription || "",
            heroButton1Text: data.heroButton1Text || "",
            heroButton2Text: data.heroButton2Text || "",
            logoName: data.logoName || "",
            logoSvg: data.logoSvg || "",
            beforeAfterTitle: data.beforeAfterTitle || "",
            beforeAfterDescription: data.beforeAfterDescription || "",
            beforeImage: data.beforeImage || "",
            afterImage: data.afterImage || "",
            projectsTitle: data.projectsTitle || "",
            projectsDescription: data.projectsDescription || "",
            contactTitle: data.contactTitle || "",
            contactDescription: data.contactDescription || "",
            contactFormTitle: data.contactFormTitle || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            contactAddress: data.contactAddress || "",
          })
        }
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setInitialLoading(false)
      }
    }
    loadContent()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'content',
          data: content,
        }),
      })

      if (response.ok) {
        alert("Content saved successfully!")
      } else {
        alert('Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content')
    } finally {
      setLoading(false)
    }
  }

  const generateWithAI = useCallback(async (field: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate ${field} for an architectural firm`,
          contentType: field,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setContent(prev => ({ ...prev, [field]: data.content }))
      } else {
        alert('Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Failed to generate content')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFieldChange = useCallback((field: keyof typeof content) => {
    return (value: string) => {
      setContent(prev => ({ ...prev, [field]: value }))
    }
  }, [])

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Content</h2>
        <p className="text-gray-600">
          Manage your website's content organized by sections. Use AI assistance to generate compelling copy.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "hero", label: "Hero Section" },
          { id: "navbar", label: "Navbar & Logo" },
          { id: "beforeafter", label: "Before & After" },
          { id: "projects", label: "Projects" },
          { id: "contact", label: "Contact" },
        ].map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            onClick={() => setActiveSection(section.id)}
            className={activeSection === section.id ? "bg-indigo-600" : ""}
          >
            {section.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6">
        {/* Hero Section */}
        {activeSection === "hero" && (
          <>
            <InputField
              label="Hero Title"
              field="heroTitle"
              description="The main headline that appears on your landing page"
              type="textarea"
              value={content.heroTitle}
              onChange={handleFieldChange("heroTitle")}
              onAIGenerate={() => generateWithAI("heroTitle")}
              loading={loading}
            />
            <InputField
              label="Hero Subtitle"
              field="heroSubtitle"
              description="The subtitle that appears below the main headline"
              type="textarea"
              value={content.heroSubtitle}
              onChange={handleFieldChange("heroSubtitle")}
              onAIGenerate={() => generateWithAI("heroSubtitle")}
              loading={loading}
            />
            <InputField
              label="Hero Description"
              field="heroDescription"
              description="The detailed description that explains your services"
              type="textarea"
              rows={4}
              value={content.heroDescription}
              onChange={handleFieldChange("heroDescription")}
              onAIGenerate={() => generateWithAI("heroDescription")}
              loading={loading}
            />
            <InputField
              label="Button 1 Text"
              field="heroButton1Text"
              description="Text for the primary call-to-action button"
              showAI={false}
              value={content.heroButton1Text}
              onChange={handleFieldChange("heroButton1Text")}
              onAIGenerate={() => {}}
              loading={loading}
            />
            <InputField
              label="Button 2 Text"
              field="heroButton2Text"
              description="Text for the secondary call-to-action button"
              showAI={false}
              value={content.heroButton2Text}
              onChange={handleFieldChange("heroButton2Text")}
              onAIGenerate={() => {}}
              loading={loading}
            />
          </>
        )}

        {/* Navbar Section */}
        {activeSection === "navbar" && (
          <>
            <InputField
              label="Logo Name"
              field="logoName"
              description="Your company/brand name displayed in the navbar"
              showAI={false}
              value={content.logoName}
              onChange={handleFieldChange("logoName")}
              onAIGenerate={() => {}}
              loading={loading}
            />
            <InputField
              label="Logo SVG/Icon"
              field="logoSvg"
              description="SVG path or icon identifier for your logo (optional)"
              showAI={false}
              rows={4}
              type="textarea"
              value={content.logoSvg}
              onChange={handleFieldChange("logoSvg")}
              onAIGenerate={() => {}}
              loading={loading}
            />
          </>
        )}

        {/* Before & After Section */}
        {activeSection === "beforeafter" && (
          <>
            <InputField
              label="Section Title"
              field="beforeAfterTitle"
              description="Title for the before/after comparison section"
              value={content.beforeAfterTitle}
              onChange={handleFieldChange("beforeAfterTitle")}
              onAIGenerate={() => generateWithAI("beforeAfterTitle")}
              loading={loading}
            />
            <InputField
              label="Section Description"
              field="beforeAfterDescription"
              description="Description text for the before/after section"
              type="textarea"
              rows={3}
              value={content.beforeAfterDescription}
              onChange={handleFieldChange("beforeAfterDescription")}
              onAIGenerate={() => generateWithAI("beforeAfterDescription")}
              loading={loading}
            />
            <ImageField
              label="Before Image"
              description="Image URL for the 'before' state"
              currentImage={content.beforeImage}
              value={content.beforeImage}
              onChange={handleFieldChange("beforeImage")}
            />
            <ImageField
              label="After Image"
              description="Image URL for the 'after' state"
              currentImage={content.afterImage}
              value={content.afterImage}
              onChange={handleFieldChange("afterImage")}
            />
          </>
        )}

        {/* Projects Section */}
        {activeSection === "projects" && (
          <>
            <InputField
              label="Projects Section Title"
              field="projectsTitle"
              description="Title for the featured projects section"
              value={content.projectsTitle}
              onChange={handleFieldChange("projectsTitle")}
              onAIGenerate={() => generateWithAI("projectsTitle")}
              loading={loading}
            />
            <InputField
              label="Projects Section Description"
              field="projectsDescription"
              description="Description for the featured projects section"
              type="textarea"
              rows={3}
              value={content.projectsDescription}
              onChange={handleFieldChange("projectsDescription")}
              onAIGenerate={() => generateWithAI("projectsDescription")}
              loading={loading}
            />
            <Card>
              <CardHeader>
                <CardTitle>Individual Projects</CardTitle>
                <CardDescription>
                  To manage individual project images and details, go to the "Projects" tab
                </CardDescription>
              </CardHeader>
            </Card>
          </>
        )}

        {/* Contact Section */}
        {activeSection === "contact" && (
          <>
            <InputField
              label="Contact Section Title"
              field="contactTitle"
              description="Main heading for the contact section"
              value={content.contactTitle}
              onChange={handleFieldChange("contactTitle")}
              onAIGenerate={() => generateWithAI("contactTitle")}
              loading={loading}
            />
            <InputField
              label="Contact Description"
              field="contactDescription"
              description="Description text that appears in the contact section"
              type="textarea"
              rows={4}
              value={content.contactDescription}
              onChange={handleFieldChange("contactDescription")}
              onAIGenerate={() => generateWithAI("contactDescription")}
              loading={loading}
            />
            <InputField
              label="Contact Form Title"
              field="contactFormTitle"
              description="Title above the contact form"
              showAI={false}
              value={content.contactFormTitle}
              onChange={handleFieldChange("contactFormTitle")}
              onAIGenerate={() => {}}
              loading={loading}
            />
            <InputField
              label="Email Address"
              field="contactEmail"
              description="Your business email address"
              showAI={false}
              value={content.contactEmail}
              onChange={handleFieldChange("contactEmail")}
              onAIGenerate={() => {}}
              loading={loading}
            />
            <InputField
              label="Phone Number"
              field="contactPhone"
              description="Your business phone number"
              showAI={false}
              value={content.contactPhone}
              onChange={handleFieldChange("contactPhone")}
              onAIGenerate={() => {}}
              loading={loading}
            />
            <InputField
              label="Physical Address"
              field="contactAddress"
              description="Your business address"
              showAI={false}
              type="textarea"
              rows={2}
              value={content.contactAddress}
              onChange={handleFieldChange("contactAddress")}
              onAIGenerate={() => {}}
              loading={loading}
            />
          </>
        )}
      </div>

      <div className="flex justify-end sticky bottom-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
