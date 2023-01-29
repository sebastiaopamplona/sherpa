import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ArrElement, classNames } from "../../utils/aux"
import { useMemo, useState } from "react"

import EmptyResources from "../../components/EmptyResources/EmptyResources"
import { GetServerSidePropsContext } from "next"
import Layout from "../../components/Layout/Layout"
import Modal from "../../components/Modal/Modal"
import SprintForm from "../../components/SprintForm/SprintForm"
import { SprintGetUserBreakdownOutput } from "../../server/trpc/router/sprint"
import { StoryStatesColors } from "../../server/data/data"
import { checkIfShouldRedirect } from "../../server/aux"
import { getJourndevAuthSession } from "../../server/session"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"

const hoverUnderCapStories = (props: any) => {
  const { innerRadius, outerRadius, payload } = props
  return (
    <g>
      <text x={150} y={165} textAnchor="middle">
        {payload.title.length > 18 ? payload.title.substring(0, 18).concat("...") : payload.title}
      </text>
      <text
        x={150}
        y={185}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={"#716f6f"}
        className="text-sm font-semibold"
      >
        {payload.investedEffort}h / {payload.estimate}h (+{payload.remainingEffort}h)
      </text>
      <Sector {...props} />
      <Sector {...props} innerRadius={innerRadius + 20} outerRadius={outerRadius + 9} />
    </g>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const { projectId, sprintId } = router.query

  const sprintStateBreakdown = trpc.sprint.getStateBreakdown.useQuery({ sprintId: sprintId as string })
  const userStoriesBreakdown = trpc.sprint.getUserBreakdown.useQuery({
    projectId: projectId as string,
    sprintId: sprintId as string,
  })

  const [isSprintsDetailsOpen, setIsSprintDetailsOpen] = useState<boolean>(false)

  if (sprintStateBreakdown.isLoading || userStoriesBreakdown.isLoading) return null

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
                  <Area type="monotone" dataKey="done" stackId="1" stroke="#4ade80" fill="#4ade80" />
                  <Area type="monotone" dataKey="inReview" stackId="1" stroke="#2dd4bf" fill="#2dd4bf" />
                  <Area type="monotone" dataKey="delivered" stackId="1" stroke="#22d3ee" fill="#22d3ee" />
                  <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#fbbf24" fill="#fbbf24" />
                  <Area type="monotone" dataKey="ready" stackId="1" stroke="#e9d5ff" fill="#e9d5ff" />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#a78bfa" fill="#a78bfa" />
                  <Area type="monotone" dataKey="blocked" stackId="1" stroke="#fb7185" fill="#fb7185" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-3 flex h-96 items-center justify-center py-2">
              {userStoriesBreakdown.data?.map(
                (u, idx) =>
                  u.stories.length > 0 && (
                    <div key={`${u.user.id}-${idx}`}>
                      <UserStoryBreakdown u={u} />
                    </div>
                  )
              )}
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
          onCreateOrUpdateError={() => {}}
        />
      </Modal>
    </section>
  )
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

const UserStoryBreakdown: React.FC<{ u: ArrElement<SprintGetUserBreakdownOutput> }> = ({ u }) => {
  const [overCommitment] = useMemo(() => {
    let underCapEffort: number = 0
    let overCapEffort: number = 0
    for (const s of u.stories) {
      if (underCapEffort + s.totalEffort < u.user.capacity) {
        underCapEffort += s.totalEffort
      } else {
        overCapEffort += s.totalEffort
      }
    }
    return [underCapEffort + overCapEffort - u.user.capacity]
  }, [u.stories, u.user.capacity])

  const [storyHoverIdx, setStoryHoverIdx] = useState<number>(0)

  if (isNaN(overCommitment)) return null

  return (
    <div className="flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <img className="h-14 rounded-full border shadow-md" src={u.user.image} alt="profile_pic" />
      </div>
      <span className="flex items-center justify-center text-xl font-semibold">{u.user.name}</span>
      <div>
        <PieChart width={300} height={300}>
          <text x={150} y={90} textAnchor="middle" dominantBaseline="middle" className="text-lg font-semibold">
            Commitment
          </text>
          <text
            x={120}
            y={115}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={overCommitment < 0 ? "#22c55e" : "#ef4444"}
            className="text-xl font-bold"
          >
            {overCommitment < 0 ? "-" : "+"}
            {Math.abs(overCommitment)}h
          </text>
          <text x={150} y={115} textAnchor="middle" dominantBaseline="middle" className="text-xl">
            {`/`}
          </text>
          <text x={180} y={115} textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">
            {u.user.capacity}h
          </text>
          <text x={150} y={140} textAnchor="middle" dominantBaseline="middle">
            ➖
          </text>
          <Pie
            data={u.stories}
            dataKey="totalEffort"
            activeIndex={storyHoverIdx}
            activeShape={hoverUnderCapStories}
            innerRadius="75%"
            outerRadius="88%"
            fill="#4ade80"
            startAngle={0}
            endAngle={360}
            cornerRadius={5}
            onMouseEnter={(_, idx: number) => {
              setStoryHoverIdx(idx)
            }}
          >
            {u.stories.map((story, idx) => (
              <Cell key={`cell-${idx}`} fill={StoryStatesColors.get(story.state)} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const redirect = await checkIfShouldRedirect("/app/sprints", session!.userid as string, ctx.query)
  if (redirect !== null) return redirect
  return { props: {} }
}
