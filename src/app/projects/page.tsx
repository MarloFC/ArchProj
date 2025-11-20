import { prisma } from "@/lib/prisma"
import { ProjectCard } from "@/components/ui/project-card"
import { Navbar } from "@/components/navigation/navbar"

// Revalidate every 10 seconds
export const revalidate = 10

export default async function ProjectsPage() {
  // Fetch site config
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 'main' },
  })

  // Fetch all projects ordered by their order field
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  })

  // Use colors from site configuration palette
  const accentColor = siteConfig?.accentColor || "#6366f1"
  const primaryColor = siteConfig?.primaryColor || "#000000"

  // Alternate between accent and primary colors
  const projectColors = [accentColor, primaryColor]

  return (
    <>
      <Navbar config={siteConfig} />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {siteConfig?.projectsTitle || "Our Projects"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {siteConfig?.projectsDescription || "Explore our complete portfolio of architectural projects"}
            </p>
          </div>

          {/* Responsive Grid: 1 column on mobile, 2 columns on md+ screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                color={projectColors[index % projectColors.length]}
              />
            ))}
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No projects available yet.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
