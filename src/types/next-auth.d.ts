import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    userid?: string
    user?: {
      id?: string
    } & DefaultSession["user"]
  }
}
