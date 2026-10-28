import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isUserAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}

// POST create new team member (admin only)
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
    const { name, role, imageUrl, linkedin, instagram, email, order } = body

    const teamMember = await prisma.teamMember.create({
      data: {
        name: name || null,
        role: role || null,
        imageUrl: imageUrl || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        email: email || null,
        order: order || 0,
      },
    })

    // Revalidate team page
    revalidatePath('/team')

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    )
  }
}
