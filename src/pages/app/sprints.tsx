import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ButtonDefaultCSS, classNames } from "../../utils/aux"

import EmptyResources from "../../components/EmptyResources/EmptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/Layout/Layout"
import Modal from "../../components/Modal/Modal"
import SprintForm from "../../components/SprintForm/SprintForm"
import { checkIfShouldRedirect } from "../../server/aux"
import { getJourndevAuthSession } from "../../server/session"
import { useRouter } from "next/router"
import { useState } from "react"

const data = [
  {
    name: "Day 1",
    ready: 10,
    in_progress: 0,
    done: 0,
  },
  {
    name: "Day 2",
    ready: 7,
    in_progress: 3,
    done: 0,
  },
  {
    name: "Day 3",
    ready: 6,
    in_progress: 3,
    done: 1,
  },
  {
    name: "Day 4",
    ready: 4,
    in_progress: 3,
    done: 3,
  },
  {
    name: "Day 5",
    ready: 4,
    in_progress: 3,
    done: 3,
  },
  {
    name: "Day 6",
    ready: 2,
    in_progress: 3,
    done: 5,
  },
  {
    name: "Day 7",
  },
  {
    name: "Day 8",
  },
  {
    name: "Day 9",
  },
  {
    name: "Day 7",
  },
]
export default function Dashboard() {
  const router = useRouter()
  const { projectId, sprintId } = router.query

  const [isSprintsDetailsOpen, setIsSprintDetailsOpen] = useState<boolean>(false)

  // type dummyEntry = {
  //   name: string
  //   ready: number
  //   started: number
  //   delivered: number
  // }
  // const dummyData = useMemo(() => {
  //   let tmp: dummyEntry[] = []
  //   tmp.push({ name: "Day 0", ready: 10, started: 0, delivered: 0 })
  //   for (let i = 0; i < 1 * 8; i++) tmp.push({ name: "", ready: 10, started: 0, delivered: 0 })
  //   for (let i = 0; i < 2 * 8; i++) tmp.push({ name: "", ready: 7, started: 3, delivered: 0 })
  //   for (let i = 0; i < 1 * 8; i++) tmp.push({ name: "", ready: 5, started: 3, delivered: 2 })
  //   for (let i = 0; i < 1 * 8; i++) tmp.push({ name: "", ready: 2, started: 3, delivered: 5 })
  //   for (let i = 0; i < 1 * 8; i++) tmp.push({ name: "", ready: 0, started: 0, delivered: 10 })
  //   return tmp
  // }, [])

  return (
    <section>
      <div className="h-full px-[300px]">
        <div className={classNames(typeof sprintId === "undefined" ? "" : "hidden")}>
          <EmptyResources message="The current project has no sprints. Get started by creating one." />
        </div>
        <nav className="relative z-10 inline-flex w-full items-center justify-center pb-5">
          <button
            className={ButtonDefaultCSS}
            onClick={() => {
              setIsSprintDetailsOpen(true)
            }}
          >
            Create sprint
          </button>
        </nav>
        {sprintId ? (
          <div className="grid grid-cols-3 gap-y-2 overflow-hidden bg-white pb-2">
            <div className="col-span-3 flex items-center justify-center">
              <h1 className="text-xl font-semibold">Sprint state overview</h1>
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="done" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="in_progress" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="ready" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Modal
        isOpen={isSprintsDetailsOpen}
        onClose={() => {
          setIsSprintDetailsOpen(false)
        }}
      >
        <SprintForm
          onCreateOrUpdateSuccess={() => {
            setIsSprintDetailsOpen(false)
          }}
          onCreateOrUpdateError={() => {
            alert("failed to create sprint")
          }}
        />
      </Modal>
    </section>
  )
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/sprints", session!.userid as string, ctx.query)
  if (redirect !== null) return redirect
  return { props: {} }
}
