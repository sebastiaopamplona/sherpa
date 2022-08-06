import { ArrElement, ButtonDefaultCSS, classNames } from "../../../utils/aux"

import EmptyResources from "../../../components/emptyResources/emptyResources"
import Layout from "../../../components/layout/layout"
import Modal from "../../../components/modal/modal"
import { NoSprint } from "../../../server/data/data"
import Select from "../../../components/select/select"
import Sidebar from "../../../components/sidebar/sidebar"
import SprintForm from "../../../components/sprintForm/sprintForm"
import { SprintGetByProjectIdOutput } from "../../../server/router/sprint"
import { trpc } from "../../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Dashboard() {
  const router = useRouter()
  const { projectId } = router.query

  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }])

  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>(NoSprint)
  const [isSprintsDetailsOpen, setIsSprintDetailsOpen] = useState<boolean>(false)

  if (sprints.isLoading) return null

  return (
    <section>
      <div className="h-full px-[300px]">
        <div className={classNames(sprints.data && sprints.data.length === 0 ? "" : "hidden")}>
          <EmptyResources message="You have no sprints in your backlog. Get started by creating one." />
        </div>
        <div className="grid grid-cols-3 gap-y-6 overflow-hidden bg-white pb-2">
          <div className="col-span-1 col-start-2 mt-1 flex items-center justify-center">
            <nav className="relative z-0 inline-flex -space-x-px rounded-md" aria-label="Pagination">
              <div className={classNames(sprints.data && sprints.data.length === 0 ? "hidden" : "")}>
                <Select
                  entries={sprints.data!}
                  getId={(t) => t.id}
                  getText={(t) => t.title}
                  selectedState={[selectedSprint, setSelectedSprint]}
                />
              </div>
              <div className="pr-2" />
              <button
                className={ButtonDefaultCSS}
                onClick={() => {
                  setIsSprintDetailsOpen(true)
                }}
              >
                Create sprint
              </button>
            </nav>
          </div>
          <div className="col-span-3 flex items-center justify-center py-2"></div>
        </div>
      </div>
      <Modal
        isOpen={isSprintsDetailsOpen}
        onClose={() => {
          setIsSprintDetailsOpen(false)
        }}
      >
        <SprintForm />
      </Modal>
    </section>
  )
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
