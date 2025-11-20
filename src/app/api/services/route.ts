import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}

// POST create new service
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const service = await prisma.service.create({
      data: {
        title: data.title || null,
        description: data.description || null,
        detailedDescription: data.detailedDescription || null,
        icon: data.icon || "building",
        iconSvg: data.iconSvg || null,
        iconImageUrl: data.iconImageUrl || null,
        order: data.order || 0,
      },
    })

    // Revalidate home page to show new service
    revalidatePath('/')

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}
