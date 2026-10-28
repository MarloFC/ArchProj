import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isUserAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST new project (admin only)
export async function POST(request: Request) {
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

    const project = await prisma.project.create({
      data: {
        title: title || null,
        description: description || null,
        textarea: textarea || null,
        imageUrl: imageUrl || null,
        images: images || [],
        category: category || "residential",
        featured: featured || false,
        order: order || 0,
      },
    })

    // Revalidate home and projects pages
    revalidatePath('/')
    revalidatePath('/projects')

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
