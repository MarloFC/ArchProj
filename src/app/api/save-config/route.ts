import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'content') {
      // Save site content configuration
      const config = await prisma.siteConfig.upsert({
        where: { id: 'main' },
        update: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
        },
        create: {
          id: 'main',
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
        },
      })

      return NextResponse.json({ success: true, config })
    } else if (type === 'colors') {
      // Save color configuration
      const config = await prisma.siteConfig.upsert({
        where: { id: 'main' },
        update: {
          primaryColor: data.primary,
          secondaryColor: data.secondary,
          accentColor: data.accent,
          gradientFrom: data.gradientFrom,
          gradientTo: data.gradientTo,
        },
        create: {
          id: 'main',
          primaryColor: data.primary,
          secondaryColor: data.secondary,
          accentColor: data.accent,
          gradientFrom: data.gradientFrom,
          gradientTo: data.gradientTo,
        },
      })

      return NextResponse.json({ success: true, config })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}