import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { prisma } from "../../../server/db/client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "local_user",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@example.com",
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
      // if (account && user) {
      //   return {
      //     ...token,
      //     accessToken: user.data.token,
      //     refreshToken: user.data.refreshToken,
      //   }
      // }

      return token
    },

    async session({ session, token }) {
      // session.user.accessToken = token.accessToken
      // session.user.refreshToken = token.refreshToken
      // session.user.accessTokenExpires = token.accessTokenExpires

      return session
    },
  },
}

export default NextAuth(authOptions)

const firstOrCreateUser = async (name: string, email: string, image: string): Promise<string> => {
  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        image: image,
      },
    })
  }

  return user.id
}
