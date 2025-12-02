import { Navbar } from "@/components/navigation/navbar"
import { TeamSection } from "@/components/sections/team-section"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"

// Revalidate every 10 seconds
export const revalidate = 10

export default async function TeamPage() {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 'main' },
  })

  const teamMembersData = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  })

  // Map to the format expected by TeamSection
  const teamMembers = teamMembersData.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    imageUrl: member.imageUrl,
    linkedin: member.linkedin,
    instagram: member.instagram,
    email: member.email,
    order: member.order,
  }))

  const gradientFrom = siteConfig?.gradientFrom || "#6366f1"
  const gradientTo = siteConfig?.gradientTo || "#8b5cf6"
  const accentColor = siteConfig?.accentColor || "#6366f1"
  const secondaryColor = siteConfig?.secondaryColor || "#ffffff"
  const teamTitle = siteConfig?.teamTitle || ""
  const teamSubtitle = siteConfig?.teamSubtitle || ""
  const teamDescription = siteConfig?.teamDescription || ""

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
      <Footer config={siteConfig} />
    </>
  )
}
