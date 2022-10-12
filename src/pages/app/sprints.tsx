import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import EmptyResources from "../../components/EmptyResources/EmptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/Layout/Layout"
import Modal from "../../components/Modal/Modal"
import SprintForm from "../../components/SprintForm/SprintForm"
import { checkIfShouldRedirect } from "../../server/aux"
import { classNames } from "../../utils/aux"
import { getJourndevAuthSession } from "../../server/session"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Dashboard() {
  const router = useRouter()
  const { sprintId } = router.query

  const sprintStateBreakdown = trpc.useQuery(["sprint.getStateBreakdown", { sprintId: sprintId as string }])

  const [isSprintsDetailsOpen, setIsSprintDetailsOpen] = useState<boolean>(false)

  if (sprintStateBreakdown.isLoading) return null

  return (
    <section>
      <div className="h-full px-[200px]">
        <div className={classNames(typeof sprintId === "undefined" ? "" : "hidden")}>
          <EmptyResources message="The current project has no sprints. Get started by creating one." />
        </div>
        <nav className="relative z-10 inline-flex w-full items-center justify-center pb-5">
          <button
            className="s-btn-base s-btn-default"
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
                  data={sprintStateBreakdown.data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                  <Area type="linear" dataKey="done" stackId="1" stroke="#15803d" fill="#4ade80" />
                  <Area type="linear" dataKey="inReview" stackId="1" stroke="#0f766e" fill="#2dd4bf" />
                  <Area type="linear" dataKey="delivered" stackId="1" stroke="#0e7490" fill="#22d3ee" />
                  <Area type="linear" dataKey="inProgress" stackId="1" stroke="#92400e" fill="#fbbf24" />
                  <Area type="linear" dataKey="ready" stackId="1" stroke="#7e22ce" fill="#e9d5ff" />
                  <Area type="linear" dataKey="new" stackId="1" stroke="#6d28d9" fill="#a78bfa" />
                  <Area type="linear" dataKey="blocked" stackId="1" stroke="#be123c" fill="#fb7185" />
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
