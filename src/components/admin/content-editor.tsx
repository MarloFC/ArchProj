"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Save } from "lucide-react"

export function ContentEditor() {
  const [content, setContent] = useState({
    heroTitle: "Architectural Excellence",
    heroSubtitle: "Creating spaces that inspire and endure",
    heroDescription: "Transform your vision into reality with our innovative architectural solutions.",
  })

  const [loading, setLoading] = useState(false)

  // Load existing content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/get-config')
        if (response.ok) {
          const data = await response.json()
          setContent({
            heroTitle: data.heroTitle,
            heroSubtitle: data.heroSubtitle,
            heroDescription: data.heroDescription,
          })
        }
      } catch (error) {
        console.error('Error loading content:', error)
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
          data: {
            heroTitle: content.heroTitle,
            heroSubtitle: content.heroSubtitle,
            heroDescription: content.heroDescription,
          },
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

  const generateWithAI = async (field: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate ${field} for an architectural firm`,
          contentType: field === "heroTitle" ? "title" : field === "heroSubtitle" ? "subtitle" : "description",
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
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Content</h2>
        <p className="text-gray-600">
          Manage your website's text content. Use AI assistance to generate compelling copy.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hero Title
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateWithAI("heroTitle")}
                disabled={loading}
                className="flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Suggest</span>
              </Button>
            </CardTitle>
            <CardDescription>
              The main headline that appears on your landing page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={content.heroTitle}
              onChange={(e) => setContent(prev => ({ ...prev, heroTitle: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              rows={2}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hero Subtitle
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateWithAI("heroSubtitle")}
                disabled={loading}
                className="flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Suggest</span>
              </Button>
            </CardTitle>
            <CardDescription>
              The subtitle that appears below the main headline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={content.heroSubtitle}
              onChange={(e) => setContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              rows={2}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hero Description
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateWithAI("heroDescription")}
                disabled={loading}
                className="flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Suggest</span>
              </Button>
            </CardTitle>
            <CardDescription>
              The detailed description that explains your services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={content.heroDescription}
              onChange={(e) => setContent(prev => ({ ...prev, heroDescription: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}