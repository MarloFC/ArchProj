"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SlateEditor } from "@/components/ui/slate-editor"
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react"

interface Service {
  id: string
  title: string
  description: string
  detailedDescription: string | null
  icon: string
  iconSvg: string | null
  iconImageUrl: string | null
  order: number
}

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Fetch services on mount
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/services")
      if (!response.ok) throw new Error("Failed to fetch services")
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = () => {
    setIsAddingNew(true)
    setEditingService({
      id: "",
      title: "",
      description: "",
      detailedDescription: "",
      icon: "building",
      iconSvg: "",
      iconImageUrl: "",
      order: services.length,
    })
  }

  const handleSaveService = async () => {
    if (!editingService) return

    try {
      setSaving(true)

      if (isAddingNew) {
        const response = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingService.title,
            description: editingService.description,
            detailedDescription: editingService.detailedDescription || null,
            icon: editingService.icon,
            iconSvg: editingService.iconSvg || null,
            iconImageUrl: editingService.iconImageUrl || null,
            order: editingService.order,
          }),
        })

        if (!response.ok) throw new Error("Failed to create service")
        await fetchServices()
      } else {
        const response = await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingService.title,
            description: editingService.description,
            detailedDescription: editingService.detailedDescription || null,
            icon: editingService.icon,
            iconSvg: editingService.iconSvg || null,
            iconImageUrl: editingService.iconImageUrl || null,
            order: editingService.order,
          }),
        })

        if (!response.ok) throw new Error("Failed to update service")
        await fetchServices()
      }

      setEditingService(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error("Error saving service:", error)
      alert("Failed to save service. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete service")
      await fetchServices()
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Failed to delete service. Please try again.")
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setEditingService(null)
    setIsAddingNew(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Services Management</h2>
          <p className="text-gray-600">
            Manage your services section with custom icons, SVGs, or images.
          </p>
        </div>

        <Button
          onClick={handleAddService}
          disabled={saving}
          className="bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {editingService && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>
              {isAddingNew ? "Add New Service" : "Edit Service"}
            </CardTitle>
            <CardDescription>
              Fill in the service details below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title
                </label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService(prev =>
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Enter service title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lucide Icon Name (Fallback)
                </label>
                <input
                  type="text"
                  value={editingService.icon}
                  onChange={(e) => setEditingService(prev =>
                    prev ? { ...prev, icon: e.target.value } : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="building, home, paintbrush, etc."
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Short Description</CardTitle>
                <CardDescription>Brief description for the service card (supports rich text formatting)</CardDescription>
              </CardHeader>
              <CardContent>
                <SlateEditor
                  key={`description-${editingService.id}`}
                  value={editingService.description}
                  onChange={(value) => setEditingService(prev =>
                    prev ? { ...prev, description: value } : null
                  )}
                  placeholder="Brief description for the service card..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Description (for Modal)</CardTitle>
                <CardDescription>Longer, more detailed description that will appear in the popup modal (supports rich text formatting)</CardDescription>
              </CardHeader>
              <CardContent>
                <SlateEditor
                  key={`detailed-${editingService.id}`}
                  value={editingService.detailedDescription || ""}
                  onChange={(value) => setEditingService(prev =>
                    prev ? { ...prev, detailedDescription: value } : null
                  )}
                  placeholder="Longer, more detailed description that will appear in the popup modal..."
                />
              </CardContent>
            </Card>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom SVG Code (Optional)
              </label>
              <textarea
                value={editingService.iconSvg || ""}
                onChange={(e) => setEditingService(prev =>
                  prev ? { ...prev, iconSvg: e.target.value } : null
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
                rows={4}
                placeholder='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">...</svg>'
              />
              {editingService.iconSvg && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div
                    className="w-12 h-12"
                    dangerouslySetInnerHTML={{ __html: editingService.iconSvg }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Image URL (Optional)
              </label>
              <input
                type="url"
                value={editingService.iconImageUrl || ""}
                onChange={(e) => setEditingService(prev =>
                  prev ? { ...prev, iconImageUrl: e.target.value } : null
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="https://example.com/icon.png"
              />
              {editingService.iconImageUrl && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <img
                    src={editingService.iconImageUrl}
                    alt="Icon preview"
                    className="w-12 h-12 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Priority:</strong> Icon Image URL → Custom SVG → Lucide Icon
              </p>
              <p className="text-xs text-blue-600 mt-1">
                If an image URL is provided, it will be used. Otherwise, custom SVG will be used. If neither is provided, the Lucide icon will be used as fallback.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveService} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Service
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {services.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No services yet. Click "Add Service" to create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {service.iconImageUrl ? (
                      <img
                        src={service.iconImageUrl}
                        alt={service.title}
                        className="w-10 h-10 object-contain"
                      />
                    ) : service.iconSvg ? (
                      <div
                        className="w-10 h-10 text-gray-700"
                        dangerouslySetInnerHTML={{ __html: service.iconSvg }}
                      />
                    ) : (
                      <span className="text-xs text-gray-500">{service.icon}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <div
                      className="text-gray-700 text-sm prose prose-sm max-w-none
                        [&>p]:text-gray-700 [&>p]:mb-1 [&>p]:text-sm
                        [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-1
                        [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mb-1
                        [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:my-1
                        [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:my-1
                        [&>li]:text-gray-700 [&>li]:text-sm [&>li]:mb-0.5
                        [&>strong]:font-bold [&>em]:italic"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>
    </div>
  )
}
