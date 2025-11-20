"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, Loader2, X } from "lucide-react"
import { toast } from "sonner"

interface TeamMember {
  id: string
  name: string | null
  role: string | null
  imageUrl: string | null
  linkedin: string | null
  instagram: string | null
  email: string | null
  order: number
}

export function TeamManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/team")
      if (!response.ok) throw new Error("Failed to fetch team members")
      const data = await response.json()
      setTeamMembers(data)
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = () => {
    setIsAddingNew(true)
    setEditingMember({
      id: "",
      name: "",
      role: "",
      imageUrl: "",
      linkedin: "",
      instagram: "",
      email: "",
      order: teamMembers.length,
    })
  }

  const handleSaveMember = async () => {
    if (!editingMember) return

    try {
      setSaving(true)

      if (isAddingNew) {
        const response = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingMember.name,
            role: editingMember.role,
            imageUrl: editingMember.imageUrl,
            linkedin: editingMember.linkedin || null,
            instagram: editingMember.instagram || null,
            email: editingMember.email || null,
            order: editingMember.order,
          }),
        })

        if (!response.ok) throw new Error("Failed to create team member")
        await fetchTeamMembers()
      } else {
        const response = await fetch(`/api/team/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingMember.name,
            role: editingMember.role,
            imageUrl: editingMember.imageUrl,
            linkedin: editingMember.linkedin || null,
            instagram: editingMember.instagram || null,
            email: editingMember.email || null,
            order: editingMember.order,
          }),
        })

        if (!response.ok) throw new Error("Failed to update team member")
        await fetchTeamMembers()
      }

      setEditingMember(null)
      setIsAddingNew(false)
      toast.success(isAddingNew ? "Team member added successfully!" : "Team member updated successfully!")
    } catch (error) {
      console.error("Error saving team member:", error)
      toast.error("Failed to save team member")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete team member")
      await fetchTeamMembers()
      toast.success("Team member deleted successfully!")
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast.error("Failed to delete team member")
    }
  }

  const handleCancel = () => {
    setEditingMember(null)
    setIsAddingNew(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading team members...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members</CardDescription>
          </div>
          <Button onClick={handleAddMember} disabled={isAddingNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Editing Form */}
          {editingMember && (
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                  {isAddingNew ? "Add New Team Member" : "Edit Team Member"}
                </h3>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editingMember.name || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editingMember.role || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    placeholder="Lead Architect"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={editingMember.imageUrl || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, imageUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMember.linkedin || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, linkedin: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Instagram</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMember.instagram || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, instagram: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingMember.email || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMember} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Team Members List */}
          {teamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No team members yet. Click "Add Member" to create one.
            </div>
          ) : (
            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base break-words">{member.name}</h4>
                    <p className="text-xs md:text-sm text-gray-600 break-words">{member.role}</p>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                      {member.linkedin && <span>LinkedIn</span>}
                      {member.instagram && <span>Instagram</span>}
                      {member.email && <span className="truncate max-w-[150px]">Email</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMember(member)
                        setIsAddingNew(false)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
