import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { getJourndevAuthSession } from "../../server/session"
import { prisma } from "../../server/db/client"

export default function Index() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)

  const projects = await prisma.project.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      users: {
        where: {
          userId: session!.userid as string,
        },
      },
    },
  })

  if (projects.length === 0) {
    return {
      redirect: { destination: "/app/createproject", permanent: false },
    }
  }

  return {
    redirect: {
      destination: `/app/${projects[0]?.id}/timekeeper`,
      permanent: false,
    },
  }
}
