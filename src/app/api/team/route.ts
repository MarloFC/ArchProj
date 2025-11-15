import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
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
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, imageUrl, linkedin, instagram, email, order } = body

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        imageUrl,
        linkedin,
        instagram,
        email,
        order,
      },
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    )
  }
}
