"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SlateEditor } from "@/components/ui/slate-editor"
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: string
  title: string | null
  description: string | null
  textarea: string | null
  category: string | null
  imageUrl: string | null
  featured: boolean
  order: number
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = () => {
    setIsAddingNew(true)
    setEditingProject({
      id: "",
      title: "",
      description: "",
      textarea: "",
      category: "residential",
      imageUrl: "",
      featured: false,
      order: projects.length,
    })
  }

  const handleSaveProject = async () => {
    if (!editingProject) return

    try {
      setSaving(true)

      if (isAddingNew) {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingProject.title,
            description: editingProject.description,
            textarea: editingProject.textarea,
            category: editingProject.category,
            imageUrl: editingProject.imageUrl,
            featured: editingProject.featured,
            order: editingProject.order,
          }),
        })

        if (!response.ok) throw new Error("Failed to create project")
        await fetchProjects()
      } else {
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingProject.title,
            description: editingProject.description,
            textarea: editingProject.textarea,
            category: editingProject.category,
            imageUrl: editingProject.imageUrl,
            featured: editingProject.featured,
            order: editingProject.order,
          }),
        })

        if (!response.ok) throw new Error("Failed to update project")
        await fetchProjects()
      }

      setEditingProject(null)
      setIsAddingNew(false)
      toast.success(isAddingNew ? "Project created successfully!" : "Project updated successfully!")
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Failed to save project. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")
      await fetchProjects()
      toast.success("Project deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project. Please try again.")
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setEditingProject(null)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Portfolio</h2>
          <p className="text-gray-600">
            Manage your project showcase and portfolio items.
          </p>
        </div>

        <Button
          onClick={handleAddProject}
          disabled={saving}
          className="bg-gradient-to-r from-gray-600 to-black hover:from-black hover:to-gray-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {editingProject && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>
              {isAddingNew ? "Add New Project" : "Edit Project"}
            </CardTitle>
            <CardDescription>
              Fill in the project details below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject(prev =>
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editingProject.category || "residential"}
                  onChange={(e) => setEditingProject(prev =>
                    prev ? { ...prev, category: e.target.value } : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="residential">Residencial</option>
                  <option value="commercial">Comercial</option>
                  <option value="cultural">Cultural</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={editingProject.imageUrl || ""}
                onChange={(e) => setEditingProject(prev =>
                  prev ? { ...prev, imageUrl: e.target.value } : null
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Project description (supports rich text formatting)</CardDescription>
              </CardHeader>
              <CardContent>
                <SlateEditor
                  key={`description-${editingProject.id}`}
                  value={editingProject.description || ""}
                  onChange={(value) => setEditingProject(prev =>
                    prev ? { ...prev, description: value } : null
                  )}
                  placeholder="Describe the project..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>Extended project information (supports rich text formatting)</CardDescription>
              </CardHeader>
              <CardContent>
                <SlateEditor
                  key={`textarea-${editingProject.id}`}
                  value={editingProject.textarea || ""}
                  onChange={(value) => setEditingProject(prev =>
                    prev ? { ...prev, textarea: value } : null
                  )}
                  placeholder="Add additional details or extended project information..."
                />
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={editingProject.featured}
                onChange={(e) => setEditingProject(prev => 
                  prev ? { ...prev, featured: e.target.checked } : null
                )}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured project (show on homepage)
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Project
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">No projects yet. Click "Add Project" to create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="w-full sm:w-20 h-48 sm:h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title || "Project"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 break-words">
                        {project.title || "Untitled Project"}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 mb-2">{project.category || "Uncategorized"}</p>
                    <p className="text-sm md:text-base text-gray-700 break-words">{project.description || "No description"}</p>
                  </div>
                </div>

                <div className="flex space-x-2 justify-end md:ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
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