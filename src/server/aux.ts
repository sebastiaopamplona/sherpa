import { ParsedUrlQuery } from "querystring"
import { pathWithProjSprintUser } from "../utils/aux"
import { prisma } from "./db/client"

export async function checkIfShouldRedirect(path: string, loggedInUserId: string, query: ParsedUrlQuery) {
  let shouldRedirect: boolean = false

  let { projectId, sprintId, userId } = query

  if (typeof projectId === "undefined") {
    shouldRedirect = true

    const userRolesProject = await prisma.userRolesInProjects.findMany({
      where: {
        userId: loggedInUserId,
      },
    })

    if (userRolesProject.length === 0) {
      return {
        redirect: {
          destination: "/app/createproject",
          permanent: false,
        },
      }
    }

    const project = await prisma.project.findFirst({
      where: {
        id: userRolesProject[0]!.projectId,
      },
    })

    projectId = project!.id
  }

  if (typeof sprintId === "undefined") {
    const sprint = await prisma.sprint.findFirst({
      where: {
        projectId: projectId as string,
      },
    })

    if (sprint) {
      shouldRedirect = true
      sprintId = sprint.id
    }
  }

  if (shouldRedirect) {
    return {
      redirect: {
        destination: pathWithProjSprintUser("/app/timekeeper", projectId, sprintId, userId),
        permanent: false,
      },
    }
  }

  return null
}
