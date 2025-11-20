import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

// PUT update service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json()
    const { id } = await params

    const service = await prisma.service.update({
      where: { id },
      data: {
        title: data.title || null,
        description: data.description || null,
        detailedDescription: data.detailedDescription || null,
        icon: data.icon || null,
        iconSvg: data.iconSvg || null,
        iconImageUrl: data.iconImageUrl || null,
        order: data.order !== undefined ? data.order : 0,
      },
    })

    // Revalidate home page to show updated service
    revalidatePath('/')

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error updating service:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: "Failed to update service",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// DELETE service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.service.delete({
      where: { id },
    })

    // Revalidate home page to remove deleted service
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    )
  }
}
