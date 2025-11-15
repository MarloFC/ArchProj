import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Temporary: Allow saves without authentication in development
    if (!user && process.env.NODE_ENV !== 'development') {
      console.error('User not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user) {
      console.warn('Warning: Saving config without authentication (development mode)')
    }

    const body = await request.json()
    const { type, data } = body

    console.log('Saving config - Type:', type)
    console.log('Saving config - Data keys:', Object.keys(data))

    if (type === 'content') {
      // Validate required fields
      const requiredFields = [
        'heroTitle', 'heroSubtitle', 'heroDescription', 'heroButton1Text', 'heroButton2Text',
        'beforeAfterTitle', 'beforeAfterDescription', 'beforeImage', 'afterImage',
        'servicesTitle', 'servicesDescription',
        'projectsTitle', 'projectsDescription', 'contactTitle', 'contactDescription',
        'contactFormTitle', 'contactEmail', 'contactPhone', 'contactAddress'
      ]

      const missingFields = requiredFields.filter(field => !data[field])
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields)
        return NextResponse.json({
          error: 'Missing required fields',
          fields: missingFields
        }, { status: 400 })
      }

      // Save site content configuration
      const config = await prisma.siteConfig.upsert({
        where: { id: 'main' },
        update: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          heroButton1Text: data.heroButton1Text,
          heroButton2Text: data.heroButton2Text,
          logoName: data.logoName || '',
          logoSvg: data.logoSvg || null,
          logoWidth: data.logoWidth || 8,
          logoHeight: data.logoHeight || 8,
          beforeAfterTitle: data.beforeAfterTitle,
          beforeAfterDescription: data.beforeAfterDescription,
          beforeImage: data.beforeImage,
          afterImage: data.afterImage,
          servicesTitle: data.servicesTitle,
          servicesDescription: data.servicesDescription,
          projectsTitle: data.projectsTitle,
          projectsDescription: data.projectsDescription,
          contactTitle: data.contactTitle,
          contactDescription: data.contactDescription,
          contactFormTitle: data.contactFormTitle,
          teamTitle: data.teamTitle || '',
          teamSubtitle: data.teamSubtitle || '',
          teamDescription: data.teamDescription || '',
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          contactAddress: data.contactAddress,
        },
        create: {
          id: 'main',
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          heroButton1Text: data.heroButton1Text,
          heroButton2Text: data.heroButton2Text,
          logoName: data.logoName || '',
          logoSvg: data.logoSvg || null,
          logoWidth: data.logoWidth || 8,
          logoHeight: data.logoHeight || 8,
          beforeAfterTitle: data.beforeAfterTitle,
          beforeAfterDescription: data.beforeAfterDescription,
          beforeImage: data.beforeImage,
          afterImage: data.afterImage,
          servicesTitle: data.servicesTitle,
          servicesDescription: data.servicesDescription,
          projectsTitle: data.projectsTitle,
          projectsDescription: data.projectsDescription,
          contactTitle: data.contactTitle,
          contactDescription: data.contactDescription,
          contactFormTitle: data.contactFormTitle,
          teamTitle: data.teamTitle || '',
          teamSubtitle: data.teamSubtitle || '',
          teamDescription: data.teamDescription || '',
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          contactAddress: data.contactAddress,
        },
      })

      console.log('Config saved successfully')
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
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({
      error: 'Failed to save configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}