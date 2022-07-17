import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      // profile: (profile) => {
      //   // Return all the profile information you need.
      //   // The only truly required field is `id`
      //   // to be able identify the account when added to a database
      //   return {
      //     id: "1",
      //   };
      // },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, profile }) {
      console.log("jwt callback", token);
      console.log("profile", profile);
      token.userRole = "admin";
      return token;
    },
  },
};

export default NextAuth(authOptions);
