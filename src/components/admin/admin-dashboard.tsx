"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentEditor } from "./content-editor"
import { ColorCustomizer } from "./color-customizer"
import { ProjectManager } from "./project-manager"
import { ServiceManager } from "./service-manager"
import { TeamManager } from "./team-manager"
import { Settings, Palette, FolderOpen, LogOut, Home, Briefcase, Users } from "lucide-react"
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
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 px-2 md:px-4">
                <Home className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || ""}
                  className="rounded-full w-6 h-6 md:w-7 md:h-7"
                />
              )}
              <span className="text-xs md:text-sm text-gray-700 hidden sm:inline">{user.name}</span>
            </div>

            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-gray-600 px-2 md:px-4"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-white p-1 rounded-lg shadow-sm h-auto">
            <TabsTrigger value="content" className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-2.5">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="cursor-pointer text-xs md:text-sm">Content</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-2.5">
              <Palette className="w-4 h-4 flex-shrink-0" />
              <span className="cursor-pointer text-xs md:text-sm">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-2.5">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="cursor-pointer text-xs md:text-sm">Services</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-2.5">
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              <span className="cursor-pointer text-xs md:text-sm">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-2.5 col-span-2 md:col-span-1">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="cursor-pointer text-xs md:text-sm">Team</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card className="p-4 md:p-6">
              <ContentEditor />
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card className="p-4 md:p-6">
              <ColorCustomizer />
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="p-4 md:p-6">
              <ServiceManager />
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="p-4 md:p-6">
              <ProjectManager />
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="p-4 md:p-6">
              <TeamManager />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}