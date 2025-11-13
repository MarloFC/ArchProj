"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  featured: boolean
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Modern Skyline Tower",
      description: "A 40-story mixed-use development featuring sustainable design principles.",
      category: "Commercial",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      featured: true,
    },
    {
      id: "2",
      title: "Riverside Residence",
      description: "Contemporary family home with panoramic river views and eco-friendly features.",
      category: "Residential",
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      featured: true,
    },
  ])

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleAddProject = () => {
    setIsAddingNew(true)
    setEditingProject({
      id: "",
      title: "",
      description: "",
      category: "Residential",
      imageUrl: "",
      featured: false,
    })
  }

  const handleSaveProject = () => {
    if (!editingProject) return

    if (isAddingNew) {
      const newProject = {
        ...editingProject,
        id: Date.now().toString(),
      }
      setProjects(prev => [...prev, newProject])
    } else {
      setProjects(prev =>
        prev.map(p => p.id === editingProject.id ? editingProject : p)
      )
    }

    setEditingProject(null)
    setIsAddingNew(false)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(prev => prev.filter(p => p.id !== id))
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
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
                  value={editingProject.title}
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
                  value={editingProject.category}
                  onChange={(e) => setEditingProject(prev => 
                    prev ? { ...prev, category: e.target.value } : null
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={editingProject.imageUrl}
                onChange={(e) => setEditingProject(prev => 
                  prev ? { ...prev, imageUrl: e.target.value } : null
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingProject.description}
                onChange={(e) => setEditingProject(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                rows={3}
                placeholder="Describe the project..."
              />
            </div>

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
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject}>
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{project.category}</p>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
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
        ))}
      </div>
    </div>
  )
}