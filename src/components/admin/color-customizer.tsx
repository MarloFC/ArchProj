"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const presetThemes = [
  {
    name: "Ocean",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#06b6d4",
    gradientFrom: "#1e40af",
    gradientTo: "#06b6d4",
  },
  {
    name: "Sunset",
    primary: "#dc2626",
    secondary: "#f97316",
    accent: "#fbbf24",
    gradientFrom: "#dc2626",
    gradientTo: "#f97316",
  },
  {
    name: "Forest",
    primary: "#166534",
    secondary: "#22c55e",
    accent: "#84cc16",
    gradientFrom: "#166534",
    gradientTo: "#22c55e",
  },
  {
    name: "Purple Dream",
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#d946ef",
    gradientFrom: "#7c3aed",
    gradientTo: "#d946ef",
  },
]

export function ColorCustomizer() {
  const [colors, setColors] = useState({
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    alternative: "#DB650F",
    gradientFrom: "#6366f1",
    gradientTo: "#8b5cf6",
  })

  const [loading, setLoading] = useState(false)

  // Load existing colors from database
  useEffect(() => {
    const loadColors = async () => {
      try {
        const response = await fetch('/api/get-config')
        if (response.ok) {
          const data = await response.json()
          setColors({
            primary: data.primaryColor || "#6366f1",
            secondary: data.secondaryColor || "#8b5cf6",
            accent: data.accentColor || "#06b6d4",
            alternative: data.alternativeColor || "#DB650F",
            gradientFrom: data.gradientFrom || "#6366f1",
            gradientTo: data.gradientTo || "#8b5cf6",
          })
        }
      } catch (error) {
        console.error('Error loading colors:', error)
      }
    }
    loadColors()
  }, [])

  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }))
  }

  const applyPreset = (theme: typeof presetThemes[0]) => {
    setColors({
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      alternative: colors.alternative, // Keep current alternative color
      gradientFrom: theme.gradientFrom,
      gradientTo: theme.gradientTo,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'colors',
          data: colors,
        }),
      })

      if (response.ok) {
        // Update CSS variables for immediate visual feedback
        const root = document.documentElement
        root.style.setProperty('--primary', colors.primary)
        root.style.setProperty('--secondary', colors.secondary)
        root.style.setProperty('--accent', colors.accent)

        toast.success("Colors saved successfully!")
      } else {
        toast.error('Failed to save colors')
      }
    } catch (error) {
      console.error('Error saving colors:', error)
      toast.error('Failed to save colors')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Color Theme</h2>
        <p className="text-gray-600">
          Customize your website's color scheme to match your brand identity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
          <CardDescription>
            Choose from our predefined color themes or customize your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {presetThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => applyPreset(theme)}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
              >
                <div className="flex space-x-1 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <div
                  className="w-full h-6 rounded mb-2"
                  style={{
                    background: `linear-gradient(45deg, ${theme.gradientFrom}, ${theme.gradientTo})`
                  }}
                />
                <p className="text-sm font-medium text-gray-900">{theme.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Colors</CardTitle>
            <CardDescription>
              Fine-tune your color palette
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => handleColorChange("primary", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange("secondary", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange("secondary", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange("accent", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.accent}
                  onChange={(e) => handleColorChange("accent", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternative Color (Footer)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={colors.alternative}
                  onChange={(e) => handleColorChange("alternative", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.alternative}
                  onChange={(e) => handleColorChange("alternative", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gradient Settings</CardTitle>
            <CardDescription>
              Configure the hero section gradient
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient Start
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={colors.gradientFrom}
                  onChange={(e) => handleColorChange("gradientFrom", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.gradientFrom}
                  onChange={(e) => handleColorChange("gradientFrom", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient End
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={colors.gradientTo}
                  onChange={(e) => handleColorChange("gradientTo", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.gradientTo}
                  onChange={(e) => handleColorChange("gradientTo", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div 
                className="w-full h-16 rounded-lg"
                style={{
                  background: `linear-gradient(45deg, ${colors.gradientFrom}, ${colors.gradientTo})`
                }}
              />
            </div>
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
          {loading ? "Saving..." : "Save Theme"}
        </Button>
      </div>
    </div>
  )
}