import NextAuth, { type NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { prisma } from "../../../server/db/client"

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: "user",
        },
      },
      profile: async (profile) => {
        // Return all the profile information you need.
        // The only truly required field is `id`
        // to be able identify the account when added to a database

        // TODO(SP): abstract logic to be reused in other providers

        let dbUser = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        })

        if (dbUser) {
          console.log("user exists, with id: ", dbUser.id)
        } else {
          console.log("user does not exist, creating...")
          dbUser = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.avatar_url,
            },
          })
        }

        return {
          id: dbUser.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.userid = user.id
      }

      return token
    },
    async session({ session, user, token }) {
      session.userid = token.userid

      return session
    },
  },
}

export default NextAuth(authOptions)
