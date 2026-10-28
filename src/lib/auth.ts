import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const getSession = () => getServerSession(authOptions)

export const getCurrentUser = async () => {
  const session = await getSession()
  return session?.user
}

export const isUserAdmin = async () => {
  const session = await getSession()
  const userId = (session?.user as any)?.id
  if (!userId) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { admin: true },
  })

  return user?.admin === true
}