import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
      // Save site content configuration with nullable fields
      const config = await prisma.siteConfig.upsert({
        where: { id: 'main' },
        update: {
          heroTitle: data.heroTitle !== undefined ? data.heroTitle : null,
          heroSubtitle: data.heroSubtitle !== undefined ? data.heroSubtitle : null,
          heroDescription: data.heroDescription !== undefined ? data.heroDescription : null,
          heroButton1Text: data.heroButton1Text !== undefined ? data.heroButton1Text : null,
          heroButton2Text: data.heroButton2Text !== undefined ? data.heroButton2Text : null,
          heroBackgroundImage: data.heroBackgroundImage !== undefined ? data.heroBackgroundImage : null,
          logoName: data.logoName !== undefined ? data.logoName : null,
          logoSvg: data.logoSvg !== undefined ? data.logoSvg : null,
          logoWidth: data.logoWidth !== undefined ? data.logoWidth : null,
          logoHeight: data.logoHeight !== undefined ? data.logoHeight : null,
          beforeAfterTitle: data.beforeAfterTitle !== undefined ? data.beforeAfterTitle : null,
          beforeAfterDescription: data.beforeAfterDescription !== undefined ? data.beforeAfterDescription : null,
          beforeImage: data.beforeImage !== undefined ? data.beforeImage : null,
          afterImage: data.afterImage !== undefined ? data.afterImage : null,
          servicesTitle: data.servicesTitle !== undefined ? data.servicesTitle : null,
          servicesDescription: data.servicesDescription !== undefined ? data.servicesDescription : null,
          projectsTitle: data.projectsTitle !== undefined ? data.projectsTitle : null,
          projectsDescription: data.projectsDescription !== undefined ? data.projectsDescription : null,
          contactTitle: data.contactTitle !== undefined ? data.contactTitle : null,
          contactDescription: data.contactDescription !== undefined ? data.contactDescription : null,
          contactFormTitle: data.contactFormTitle !== undefined ? data.contactFormTitle : null,
          teamTitle: data.teamTitle !== undefined ? data.teamTitle : null,
          teamSubtitle: data.teamSubtitle !== undefined ? data.teamSubtitle : null,
          teamDescription: data.teamDescription !== undefined ? data.teamDescription : null,
          contactEmail: data.contactEmail !== undefined ? data.contactEmail : null,
          contactPhone: data.contactPhone !== undefined ? data.contactPhone : null,
          contactAddress: data.contactAddress !== undefined ? data.contactAddress : null,
        },
        create: {
          id: 'main',
          heroTitle: data.heroTitle !== undefined ? data.heroTitle : null,
          heroSubtitle: data.heroSubtitle !== undefined ? data.heroSubtitle : null,
          heroDescription: data.heroDescription !== undefined ? data.heroDescription : null,
          heroButton1Text: data.heroButton1Text !== undefined ? data.heroButton1Text : null,
          heroButton2Text: data.heroButton2Text !== undefined ? data.heroButton2Text : null,
          heroBackgroundImage: data.heroBackgroundImage !== undefined ? data.heroBackgroundImage : null,
          logoName: data.logoName !== undefined ? data.logoName : null,
          logoSvg: data.logoSvg !== undefined ? data.logoSvg : null,
          logoWidth: data.logoWidth !== undefined ? data.logoWidth : null,
          logoHeight: data.logoHeight !== undefined ? data.logoHeight : null,
          beforeAfterTitle: data.beforeAfterTitle !== undefined ? data.beforeAfterTitle : null,
          beforeAfterDescription: data.beforeAfterDescription !== undefined ? data.beforeAfterDescription : null,
          beforeImage: data.beforeImage !== undefined ? data.beforeImage : null,
          afterImage: data.afterImage !== undefined ? data.afterImage : null,
          servicesTitle: data.servicesTitle !== undefined ? data.servicesTitle : null,
          servicesDescription: data.servicesDescription !== undefined ? data.servicesDescription : null,
          projectsTitle: data.projectsTitle !== undefined ? data.projectsTitle : null,
          projectsDescription: data.projectsDescription !== undefined ? data.projectsDescription : null,
          contactTitle: data.contactTitle !== undefined ? data.contactTitle : null,
          contactDescription: data.contactDescription !== undefined ? data.contactDescription : null,
          contactFormTitle: data.contactFormTitle !== undefined ? data.contactFormTitle : null,
          teamTitle: data.teamTitle !== undefined ? data.teamTitle : null,
          teamSubtitle: data.teamSubtitle !== undefined ? data.teamSubtitle : null,
          teamDescription: data.teamDescription !== undefined ? data.teamDescription : null,
          contactEmail: data.contactEmail !== undefined ? data.contactEmail : null,
          contactPhone: data.contactPhone !== undefined ? data.contactPhone : null,
          contactAddress: data.contactAddress !== undefined ? data.contactAddress : null,
        },
      })

      console.log('Config saved successfully')

      // Revalidate the home page to show updated content immediately
      revalidatePath('/')

      return NextResponse.json({ success: true, config })
    } else if (type === 'colors') {
      // Save color configuration with nullable fields
      const config = await prisma.siteConfig.upsert({
        where: { id: 'main' },
        update: {
          primaryColor: data.primary !== undefined ? data.primary : null,
          secondaryColor: data.secondary !== undefined ? data.secondary : null,
          accentColor: data.accent !== undefined ? data.accent : null,
          alternativeColor: data.alternative !== undefined ? data.alternative : null,
          gradientFrom: data.gradientFrom !== undefined ? data.gradientFrom : null,
          gradientTo: data.gradientTo !== undefined ? data.gradientTo : null,
        },
        create: {
          id: 'main',
          primaryColor: data.primary !== undefined ? data.primary : null,
          secondaryColor: data.secondary !== undefined ? data.secondary : null,
          accentColor: data.accent !== undefined ? data.accent : null,
          alternativeColor: data.alternative !== undefined ? data.alternative : null,
          gradientFrom: data.gradientFrom !== undefined ? data.gradientFrom : null,
          gradientTo: data.gradientTo !== undefined ? data.gradientTo : null,
        },
      })

      // Revalidate the home page to show updated colors immediately
      revalidatePath('/')

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