import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navigation/navbar"
import { notFound } from "next/navigation"
import { ProjectGallery } from "@/components/project/project-gallery"
import { BackToProjectsLink } from "@/components/ui/back-to-projects-link"

export const revalidate = 10

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 'main' },
  })

  const accentColor = siteConfig?.accentColor || "#6366f1"
  const gradientFrom = siteConfig?.gradientFrom || "#6366f1"
  const gradientTo = siteConfig?.gradientTo || "#8b5cf6"

  // Use images array if available, otherwise fallback to imageUrl
  const images = project.images && project.images.length > 0
    ? project.images
    : project.imageUrl
    ? [project.imageUrl]
    : []

  return (
    <>
      <Navbar config={siteConfig} />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <BackToProjectsLink />

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {project.title || "Projeto sem título"}
            </h1>
            {project.category && (
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
                }}
              >
                {project.category}
              </span>
            )}
          </div>

          {/* Project Description */}
          {project.description && (
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          )}

          {/* Image Gallery with Lightbox */}
          {images.length > 0 && (
            <ProjectGallery images={images} projectTitle={project.title || "Project"} />
          )}

          {/* Detailed Description */}
          {project.textarea && (
            <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Detalhes do Projeto
              </h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: project.textarea }}
              />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
