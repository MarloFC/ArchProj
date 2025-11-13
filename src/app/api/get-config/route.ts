import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'main' },
    })

    if (!config) {
      // Return default values if no config exists
      return NextResponse.json({
        heroTitle: "Architectural Excellence",
        heroSubtitle: "Creating spaces that inspire and endure",
        heroDescription: "Transform your vision into reality with our innovative architectural solutions.",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
        accentColor: "#6366f1",
        gradientFrom: "#6366f1",
        gradientTo: "#8b5cf6",
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 })
  }
}
