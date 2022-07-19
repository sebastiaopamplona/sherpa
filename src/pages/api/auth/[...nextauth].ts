import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { prisma } from "../../../server/db/client";

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
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      const userCount = await prisma.user.count({
        where: {
          email: user.email,
        },
      });

      if (userCount === 0) {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });
      }

      return true;
    },
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
