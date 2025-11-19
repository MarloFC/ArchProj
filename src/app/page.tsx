import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { ComparisonSection } from "@/components/sections/comparison-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Navbar } from "@/components/navigation/navbar"
import { LoadingProvider } from "@/components/providers/loading-provider"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  // Fetch site config from database
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 'main' },
  })

  // Fetch services from database
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
  })

  // Fetch featured projects from database
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: 'asc' },
    take: 6,
  })

  return (
    <LoadingProvider accentColor={siteConfig?.accentColor || "#6366f1"}>
      <Navbar config={siteConfig} />
      <main className="min-h-screen">
        <HeroSection config={siteConfig} />
        <section id="services">
          <ServicesSection services={services} config={siteConfig} />
        </section>
        <section id="comparison">
          <ComparisonSection config={siteConfig} />
        </section>
        <section id="projects">
          <ProjectsSection projects={projects} config={siteConfig} />
        </section>
        <section id="contact">
          <ContactSection config={siteConfig} />
        </section>
      </main>
    </LoadingProvider>
  );
}
