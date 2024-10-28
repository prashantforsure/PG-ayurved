import NextAuth, { AuthOptions, Profile } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isAdmin: user.isAdmin,
        },
      }
    },
    async signIn({ user, account, profile }) {
      if (!profile?.email) return false

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        })

        if (!existingUser) {
          const userCount = await prisma.user.count()
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.image,
              isAdmin: userCount === 0, // First user becomes an admin
            },
          })
          return true
        }

        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    redirect() {
      return '/'
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }