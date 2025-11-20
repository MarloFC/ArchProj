import { Navbar } from "@/components/navigation/navbar"
import { TeamSection } from "@/components/sections/team-section"
import { prisma } from "@/lib/prisma"

// Revalidate every 10 seconds
export const revalidate = 10

export default async function TeamPage() {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 'main' },
  })

  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  })

  const gradientFrom = siteConfig?.gradientFrom || "#6366f1"
  const gradientTo = siteConfig?.gradientTo || "#8b5cf6"
  const accentColor = siteConfig?.accentColor || "#6366f1"
  const secondaryColor = siteConfig?.secondaryColor || "#ffffff"
  const teamTitle = siteConfig?.teamTitle || "Meet Our Team"
  const teamSubtitle = siteConfig?.teamSubtitle || "The minds behind our vision"
  const teamDescription = siteConfig?.teamDescription || "Our team of passionate professionals is dedicated to transforming architectural dreams into reality."

  return (
    <>
      <Navbar config={siteConfig} />
      <TeamSection
        teamMembers={teamMembers}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        accentColor={accentColor}
        secondaryColor={secondaryColor}
        teamTitle={teamTitle}
        teamSubtitle={teamSubtitle}
        teamDescription={teamDescription}
      />
    </>
  )
}
