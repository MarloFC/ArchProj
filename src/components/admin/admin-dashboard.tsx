"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentEditor } from "./content-editor"
import { ColorCustomizer } from "./color-customizer"
import { ProjectManager } from "./project-manager"
import { Settings, Palette, FolderOpen, LogOut, Home } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface AdminDashboardProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || ""}
                  className="rounded-full w-7 h-7"
                />
              )}
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Colors</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4" />
              <span>Projects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="p-6">
              <ContentEditor />
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card className="p-6">
              <ColorCustomizer />
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="p-6">
              <ProjectManager />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}