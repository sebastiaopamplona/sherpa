import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrElement, ButtonDefaultCSS, classNames } from "../../../utils/aux"

import EmptyResources from "../../../components/emptyResources/emptyResources"
import Layout from "../../../components/layout/layout"
import Modal from "../../../components/modal/modal"
import { NoSprint } from "../../../server/data/data"
import Select from "../../../components/select/select"
import Sidebar from "../../../components/sidebar/sidebar"
import SprintForm from "../../../components/sprintForm/sprintForm"
import { SprintGetByProjectIdOutput } from "../../../server/router/sprint"
import { SprintInput } from "../../../server/schemas/schemas"
import { trpc } from "../../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useState } from "react"

const data = [
  {
    name: "Day 1",
    ready: 10,
    started: 0,
    delivered: 0,
  },
  {
    name: "Day 2",
    ready: 7,
    started: 3,
    delivered: 0,
  },
  {
    name: "Day 3",
    ready: 6,
    started: 3,
    delivered: 1,
  },
  {
    name: "Day 4",
    ready: 4,
    started: 3,
    delivered: 3,
  },
  {
    name: "Day 5",
    ready: 3,
    started: 3,
    delivered: 4,
  },
  {
    name: "Day 6",
    ready: 1,
    started: 3,
    delivered: 6,
  },
  {
    name: "Day 7",
    ready: 0,
    started: 0,
    delivered: 10,
  },
]
export default function Dashboard() {
  const router = useRouter()
  const { projectId } = router.query

  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }])

  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>(NoSprint)
  const [isSprintsDetailsOpen, setIsSprintDetailsOpen] = useState<boolean>(false)

  const { handleSubmit, register } = useForm<SprintInput>()
  const createStoryMutation = trpc.useMutation(["story.create"], {
    onSuccess: () => {
      setIsSprintDetailsOpen(false)
    },
    onError: () => {
      // TODO(SP):
    },
  })
  const handleCreateStory = (values: StoryInput) => {
    values.creatorId = session?.data?.userid as string
    if (selectedUser.id !== NoUser.id) {
      values.assigneeId = selectedUser.id
    }
    values.type = selectedType.id
    values.state = selectedState.id
    if (selectedSprint.id !== NoSprint.id) {
      values.sprintId = selectedSprint.id
    }
    values.projectId = projectId

    createStoryMutation.mutate(values)
  }

  if (sprints.isLoading) return null

  return (
    <section>
      <div className="h-full px-[300px]">
        <div className={classNames(sprints.data && sprints.data.length === 0 ? "" : "hidden")}>
          <EmptyResources message="You have no sprints in your backlog. Get started by creating one." />
        </div>
        <nav className="relative z-0 inline-flex w-full items-center justify-center" aria-label="Pagination">
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
        <div
          className={classNames(
            sprints.data && sprints.data.length === 0 ? "hidden" : "",
            "grid grid-cols-3 gap-y-2 overflow-hidden bg-white pb-2"
          )}
        >
          <div className="col-span-3 flex items-center justify-center">
            <h1>Story state overview</h1>
          </div>
          <div className="col-span-3 flex h-96 items-center justify-center py-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="name" />
                <YAxis tickCount={10 / 2} interval={0} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="delivered" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="started" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="ready" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="col-span-3 flex h-[1000px] items-center justify-center bg-red-200 py-2"></div>
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
