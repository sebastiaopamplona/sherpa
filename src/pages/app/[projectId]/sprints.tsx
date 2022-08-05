import { ArrElement, classNames } from "../../../utils/aux"

import EmptyResources from "../../../components/emptyResources/emptyResources"
import Layout from "../../../components/layout/layout"
import { NoSprint } from "../../../server/data/data"
import Select from "../../../components/select/select"
import Sidebar from "../../../components/sidebar/sidebar"
import { SprintGetByProjectIdOutput } from "../../../server/router/sprint"
import { trpc } from "../../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Dashboard() {
  const router = useRouter()
  const { projectId } = router.query

  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }])

  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>(NoSprint)

  if (sprints.isLoading) return null

  return (
    <section>
      <div className="h-full px-[300px]">
        {sprints.data && sprints.data.length === 0 ? (
          <div className={classNames(sprints.data && sprints.data.length === 0 ? "" : "hidden")}>
            <EmptyResources message="You have no sprints in your backlog. Get started by creating one." />
          </div>
        ) : (
          <div className="grid grid-cols-3 content-center gap-[2px]">
            <div className="col-span-3 flex items-center justify-center py-2">
              <nav className="relative z-0 inline-flex -space-x-px rounded-md" aria-label="Pagination">
                <Select
                  entries={sprints.data!}
                  getId={(t) => t.id}
                  getText={(t) => t.title}
                  selectedState={[selectedSprint, setSelectedSprint]}
                />
                <div className="pr-2" />
              </nav>
            </div>
            <div className="col-span-3 flex items-center justify-center py-2"></div>
          </div>
        )}
      </div>
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
