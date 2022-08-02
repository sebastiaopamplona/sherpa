import { GetServerSideProps, GetServerSidePropsContext } from "next"

import { getJourndevAuthSession } from "../../server/session"
import { prisma } from "../../server/db/client"

export default function Index() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)

  // TODO: if !session -> error

  const userRolesProject = await prisma.userRolesInProjects.findMany({
    where: {
      userId: session!.userid as string,
    },
  })

  if (userRolesProject.length === 0) {
    return {
      redirect: { destination: "/app/createproject", permanent: false },
    }
  }

  const project = await prisma.project.findFirst({
    where: {
      id: userRolesProject[0]!.projectId,
    },
  })

  return {
    redirect: {
      destination: `/app/${project!.id}/timekeeper`,
      permanent: false,
    },
  }
}
