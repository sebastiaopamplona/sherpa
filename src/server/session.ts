import { GetServerSidePropsContext } from "next"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth"

export const getJourndevAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions)
}
