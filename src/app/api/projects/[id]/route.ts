import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isUserAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT update project (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isUserAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, textarea, imageUrl, images, category, featured, order } = body
    const { id } = await params

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title || null,
        description: description || null,
        textarea: textarea || null,
        imageUrl: imageUrl || null,
        images: images !== undefined ? images : [],
        category: category || null,
        featured: featured !== undefined ? featured : false,
        order: order !== undefined ? order : 0,
      },
    })

    // Revalidate home and projects pages
    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// DELETE project (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isUserAdmin()
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params

    await prisma.project.delete({
      where: { id },
    })

    // Revalidate home and projects pages
    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
