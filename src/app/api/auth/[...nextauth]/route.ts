import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        // Fetch admin status from database when creating token
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { admin: true }
        })
        token.admin = dbUser?.admin || false
      }
      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        admin: token.admin as boolean,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user, account }) {
      // Check if user has admin role when signing in
      if (user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { admin: true }
        })
        if (dbUser?.admin === false) {
          console.log('Non-admin user signed in:', user.email)
        }
      }
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }