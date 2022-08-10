import { ArrElement, ButtonDefaultCSS, classNames } from "../../utils/aux"

import EmptyResources from "../../components/emptyResources/emptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/layout/layout"
import Modal from "../../components/modal/modal"
import ProjectEntry from "../../components/projectEntry/projectEntry"
import ProjectForm from "../../components/projectForm/projectForm"
import { ProjectGetByUserIdOutput } from "../../server/router/project"
import Sidebar from "../../components/sidebar/sidebar"
import { appRouter } from "../../server/createRouter"
import { checkIfShouldRedirect } from "../../server/aux"
import { createSSGHelpers } from "@trpc/react/ssg"
import { getJourndevAuthSession } from "../../server/session"
import superjson from "superjson"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Projects() {
  const session = useSession()

  const projects = trpc.useQuery(["project.getByUserId", { userId: session?.data?.userid as string }])

  const [currentProject, setCurrentProject] = useState<ArrElement<ProjectGetByUserIdOutput>>()
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState<boolean>(false)

  return (
    <section>
      <div className="h-full px-[400px]">
        <div className={classNames(projects.data && projects.data.length === 0 ? "" : "hidden")}>
          <EmptyResources message="You have no projects. Get started by creating one." />
        </div>
        <nav className="relative z-10 inline-flex w-full items-center justify-center pb-5">
          <button
            className={ButtonDefaultCSS}
            onClick={() => {
              setIsProjectDetailsOpen(true)
            }}
          >
            Create project
          </button>
        </nav>
        <div className={classNames(projects.data && projects.data.length === 0 ? "hidden" : "", "col-span-3")}>
          <ul role="list" className="space-y-4">
            {projects.data ? (
              projects.data.map((project) => (
                <li
                  className="rounded-sm border-2 shadow"
                  key={project.id}
                  onClick={() => {
                    setCurrentProject(project)
                    setIsProjectDetailsOpen(true)
                  }}
                >
                  <ProjectEntry project={project} />
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
      <Modal
        isOpen={isProjectDetailsOpen}
        onClose={() => {
          setIsProjectDetailsOpen(false)
        }}
      >
        <ProjectForm
          project={currentProject}
          onCreateOrUpdateSuccess={() => {
            projects.refetch()
            setIsProjectDetailsOpen(false)
          }}
          onCreateOrUpdateError={() => {
            // alert("failed to create sprint")
          }}
        />
      </Modal>
    </section>
  )
}

Projects.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/projects", session!.userid as string, ctx.query)

  if (redirect !== null) return redirect

  const ssg = await createSSGHelpers({
    router: appRouter,
    // @ts-ignore TODO(SP): this might be a real issue, so far it's not
    ctx: ctx,
    transformer: superjson,
  })

  await ssg.fetchQuery("project.getByUserId", { userId: session!.userid as string })

  return {
    props: {},
  }
}
