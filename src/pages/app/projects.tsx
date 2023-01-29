import { ArrElement, classNames } from "../../utils/aux"

import EmptyResources from "../../components/EmptyResources/EmptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/Layout/Layout"
import Modal from "../../components/Modal/Modal"
import ProjectEntry from "../../components/ProjectEntry/ProjectEntry"
import ProjectForm from "../../components/ProjectForm/ProjectForm"
import { ProjectGetByUserIdOutput } from "../../server/trpc/router/project"
import { checkIfShouldRedirect } from "../../server/aux"
import { getJourndevAuthSession } from "../../server/session"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Projects() {
  const session = useSession()

  const projects = trpc.project.getByUserId.useQuery({ userId: session?.data?.userid as string })

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
            className="s-btn-base s-btn-default"
            onClick={() => {
              setCurrentProject(undefined)
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
          onCreateOrUpdateError={() => {}}
          onDeleteSuccess={() => {
            projects.refetch()
            setIsProjectDetailsOpen(false)
          }}
          onDeleteError={() => {}}
        />
      </Modal>
    </section>
  )
}

Projects.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/projects", session!.userid as string, ctx.query)
  if (redirect !== null) return redirect
  return { props: {} }
}
