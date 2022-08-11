import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcrypt"
import { prisma } from "../../../server/db/client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "local_user",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })
        if (!user) return null

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordsMatch) return null

        return user
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          userid: user.id,
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.userid = token.userid
      }

      return session
    },
  },
}

export default NextAuth(authOptions)
