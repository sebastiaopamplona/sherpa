import { ArrElement, classNames, pathWithParams, switchSprint } from "../../utils/aux"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { addDays, format, getWeek, isSameDay, setHours, startOfWeek, subDays } from "date-fns"
import { useMemo, useRef, useState } from "react"

import EmptyResourcesV2 from "../../components/EmptyResourcesv2/EmptyResourcesv2"
import { GetServerSidePropsContext } from "next"
import { IoTodayOutline } from "react-icons/io5"
import Layout from "../../components/Layout/Layout"
import Link from "next/link"
import { NoSprint } from "../../server/data/data"
import Select from "../../components/Select/Select"
import Sidebar from "../../components/Sidebar/Sidebar"
import { SprintGetByProjectIdOutput } from "../../server/router/sprint"
import StoryEntry from "../../components/StoryEntry/StoryEntry"
import StoryForm from "../../components/StoryForm/StoryForm"
import { StoryGetForTimekeeperOutput } from "../../server/router/story"
import { StoryInput } from "../../server/schemas/schemas"
import { appRouter } from "../../server/createRouter"
import { checkIfShouldRedirect } from "../../server/aux"
import { createSSGHelpers } from "@trpc/react/ssg"
import { getJourndevAuthSession } from "../../server/session"
import superjson from "superjson"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"

// TODO: move this to a module.css
const timekeeperGridCell = "col-span-1 border-2 flex items-center justify-center"
export default function TimeKeeper() {
  const router = useRouter()
  const { projectId, sprintId } = router.query

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentDayRange, setCurrentDayRange] = useState<Date[]>(getWeekBusinessDays(new Date()))

  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }])
  const stories = trpc.useQuery([
    "story.getForTimekeeper",
    {
      projectId: projectId as string,
      sprintId: sprintId as string,
      startDate: currentDayRange[0]!,
      endDate: currentDayRange[currentDayRange.length - 1]!,
    },
  ])

  const selectedSprint = useRef<ArrElement<SprintGetByProjectIdOutput>>(
    ((data) => {
      if (!data) return NoSprint
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.id === sprintId) return data[i]!
      }
      return NoSprint
    })(sprints.data)
  )

  const [currentStory, setCurrentStory] = useState<StoryInput>()
  const [isStoryDetailsOpen, setIsStoryDetailsOpen] = useState<boolean>(false)
  const [isAddingWorklog, setIsAddingWorklog] = useState<boolean>(false)
  const [worklogDay, setWorklogDay] = useState<Date>()

  if (sprints.isLoading || stories.isLoading) return null

  return (
    <section>
      <div className="h-full px-[100px]">
        {!(sprints.data && sprints.data.length !== 0) ? (
          <EmptyResourcesV2>
            <div className="grid grid-cols-1 content-center gap-1">
              <p className="flex items-center justify-center">The current project has no sprints.</p>
              <p>
                Head over to the{" "}
                <Link
                  href={pathWithParams(
                    "/app/sprints",
                    new Map([
                      ["projectId", projectId],
                      ["sprintId", sprintId],
                    ])
                  )}
                >
                  <a className="text-purple-300 hover:cursor-pointer hover:text-purple-400 hover:underline">
                    sprints page
                  </a>
                </Link>{" "}
                and create one.
              </p>
            </div>
          </EmptyResourcesV2>
        ) : !(stories.data && stories.data.length !== 0) ? (
          <EmptyResourcesV2>
            <div className="grid grid-cols-1 content-center gap-1">
              <p className="flex items-center justify-center">
                The sprint {selectedSprint.current.title} has no stories.
              </p>
              <p>
                Head over to the{" "}
                <Link
                  href={pathWithParams(
                    "/app/backlog",
                    new Map([
                      ["projectId", projectId],
                      ["sprintId", sprintId],
                    ])
                  )}
                >
                  <a className="text-purple-300 hover:cursor-pointer hover:text-purple-400 hover:underline">
                    backlog page
                  </a>
                </Link>{" "}
                and create one.
              </p>
            </div>
          </EmptyResourcesV2>
        ) : (
          <div className={classNames("grid grid-cols-11 content-center gap-[2px]")}>
            <div className="col-span-11 flex items-center justify-center py-2">
              <TimeKeeperNav
                sprints={sprints.data!}
                selectedSprint={selectedSprint.current}
                setSelectedSprint={(s) => switchSprint(s.id, router)}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                setCurrentDayRange={setCurrentDayRange}
                onToday={() => {
                  const newCurrDate = new Date()
                  setCurrentDate(newCurrDate)
                  setCurrentDayRange(getWeekBusinessDays(newCurrDate))
                  stories.refetch()
                }}
                onPrevWeek={() => {
                  const newCurrDate = subDays(currentDate, 7)
                  setCurrentDate(newCurrDate)
                  setCurrentDayRange(getWeekBusinessDays(newCurrDate))
                  stories.refetch()
                }}
                onNextWeek={() => {
                  const newCurrDate = addDays(currentDate, 7)
                  setCurrentDate(newCurrDate)
                  setCurrentDayRange(getWeekBusinessDays(newCurrDate))
                  stories.refetch()
                }}
              />
            </div>
            <div className="col-span-6 h-6 rounded-sm"></div>
            {currentDayRange.map((d) => (
              <div key={d.toUTCString()} className={`text-sm font-semibold ${timekeeperGridCell}`}>
                {`${format(d, "eeeeee")}, ${format(d, "d/M")}`}
              </div>
            ))}
            {/* 
          // TODO: uncomment when we handle capacity
          <div className="col-span-6 h-6 rounded-sm"></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          <div className={timekeeperGridCell}></div>
          */}
            {/* {stories.data?.map((story) => (
            <TimeKeeperEntry
              key={story.id}
              story={story}
              dayRange={currentDayRange}
              onStoryClick={(story: StoryType) => {
                setCurrentStory(story)
                setIsStoryDetailsOpen(true)
              }}
              onWorklogCellClick={(story: StoryType, date: Date) => {
                setCurrentStory(story)
                setIsAddingWorklog(true)
                setWorklogDay(date)
                setIsStoryDetailsOpen(true)
              }}
            />
          ))} */}
            {stories.data?.map((story) => (
              <TimeKeeperEntry
                key={story.id}
                story={story}
                dayRange={currentDayRange}
                onStoryClick={(story: StoryInput) => {
                  setIsAddingWorklog(false)
                  setCurrentStory(story)
                  setIsStoryDetailsOpen(true)
                }}
                onWorklogCellClick={(story: StoryInput, date: Date) => {
                  setCurrentStory(story)
                  setIsAddingWorklog(true)
                  setWorklogDay(date)
                  setIsStoryDetailsOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </div>
      <StoryForm
        story={currentStory}
        isAddingWorklog={isAddingWorklog}
        worklogDay={worklogDay}
        isOpen={isStoryDetailsOpen}
        onClose={() => {
          setIsStoryDetailsOpen(false)
        }}
        onStoryCreate={{
          onSuccess: () => {
            setIsStoryDetailsOpen(false)
            stories.refetch()
          },
          onError: () => {},
        }}
        onStoryUpdate={{
          onSuccess: () => {
            setIsStoryDetailsOpen(false)
            stories.refetch()
          },
          onError: () => {},
        }}
        onWorklogCreate={{
          onSuccess: () => {
            // FIXME(SP): fetch single story intead of all stories
            stories.refetch()
          },
          onError: () => {},
        }}
        onWorklogUpdate={{
          onSuccess: () => {
            // FIXME(SP): fetch single story intead of all stories
            stories.refetch()
          },
          onError: () => {},
        }}
      />
    </section>
  )
}

const TimeKeeperNav: React.FC<{
  sprints: SprintGetByProjectIdOutput
  selectedSprint: ArrElement<SprintGetByProjectIdOutput>
  setSelectedSprint: (e: ArrElement<SprintGetByProjectIdOutput>) => void
  currentDate: Date
  setCurrentDate: (setCurrentDayRanged: Date) => void
  setCurrentDayRange: (ds: Date[]) => void
  onToday: () => void
  onPrevWeek: () => void
  onNextWeek: () => void
}> = ({
  sprints,
  selectedSprint,
  setSelectedSprint,
  currentDate,
  setCurrentDate,
  setCurrentDayRange,
  onToday,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <nav className="relative z-0 inline-flex -space-x-px rounded-md" aria-label="Pagination">
      <Select
        entries={sprints}
        getId={(t) => t.id}
        getText={(t) => t.title}
        selectedState={[selectedSprint, setSelectedSprint]}
      />
      <div className="pr-2" />
      <div
        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:cursor-pointer hover:bg-gray-50"
        onClick={
          onPrevWeek
          // const newCurrDate = subDays(currentDate, 7)
          // setCurrentDate(newCurrDate)
          // setCurrentDayRange(getWeekBusinessDays(newCurrDate))
        }
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div
        aria-current="page"
        className="relative z-10 inline-flex items-center border border-gray-300 px-3 py-2 text-sm font-medium"
      >
        {`Week ${getWeek(currentDate)}`}
      </div>
      <div
        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:cursor-pointer hover:bg-gray-50"
        onClick={
          onNextWeek
          // const newCurrDate = addDays(currentDate, 7)
          // setCurrentDate(newCurrDate)
          // setCurrentDayRange(getWeekBusinessDays(newCurrDate))
        }
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="pr-2" />
      <div
        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:cursor-pointer hover:bg-gray-50"
        onClick={
          onToday
          // const newCurrDate = new Date()
          // setCurrentDate(newCurrDate)
          // setCurrentDayRange(getWeekBusinessDays(newCurrDate))
        }
      >
        <span className="sr-only">Today</span>
        <IoTodayOutline className="h-5 w-5" />
      </div>
    </nav>
  )
}

const TimeKeeperEntry: React.FC<{
  story: ArrElement<StoryGetForTimekeeperOutput>
  dayRange: Date[]
  onStoryClick: (story: StoryInput) => void
  onWorklogCellClick: (story: StoryInput, date: Date) => void
}> = ({ story, dayRange, onStoryClick, onWorklogCellClick }) => {
  return (
    <>
      <div
        className="col-span-6 rounded-sm border-2"
        onClick={() => {
          onStoryClick(story)
        }}
      >
        <StoryEntry story={story} showAssignee={false} />
      </div>
      {dayRange.map((d) => (
        <TimeKeeperWorklogCell
          key={d.toISOString()}
          story={story}
          day={d}
          onWorklogCellClick={() => {
            onWorklogCellClick(story, d)
          }}
        />
      ))}
    </>
  )
}

const TimeKeeperWorklogCell: React.FC<{
  story: ArrElement<StoryGetForTimekeeperOutput>
  day: Date
  onWorklogCellClick: (story: StoryInput) => void
}> = ({ story, day, onWorklogCellClick }) => {
  const dayEffort = useMemo(() => {
    let worklogDaySum: number = 0
    story.worklogs.forEach((w) => {
      if (isSameDay(w.date, day)) worklogDaySum += w.effort
    })
    return worklogDaySum
  }, [story, day])

  return (
    <div
      className={` hover:cursor-pointer hover:bg-slate-100 ${timekeeperGridCell}`}
      onClick={() => {
        onWorklogCellClick(story)
      }}
    >
      {dayEffort > 0 ? `${dayEffort}h` : ""}
    </div>
  )
}

TimeKeeper.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}

const getWeekBusinessDays = (currentDate: Date): Date[] => {
  let curr: Date = startOfWeek(currentDate, { weekStartsOn: 1 })
  let days: Date[] = []
  for (let i = 0; i < 5; i++) {
    // NOTE(SP): adding 23 hours is a hack to work around a serialization
    // issue from this date format to zod format (zod was ignoring the
    // timezone and the days were shifted 1 back)
    days.push(setHours(curr, 1))
    curr = addDays(curr, 1)
  }
  return days
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getJourndevAuthSession(ctx)
  const { projectId, sprintId } = ctx.query
  const redirect = await checkIfShouldRedirect("/app/timekeeper", session!.userid as string, ctx.query)

  if (redirect !== null) return redirect

  const ssg = await createSSGHelpers({
    router: appRouter,
    // @ts-ignore TODO(SP): this might be a real issue, so far it's not
    ctx: ctx,
    transformer: superjson,
  })

  const businessDays: Date[] = getWeekBusinessDays(new Date())

  // Prefetching
  await ssg.fetchQuery("sprint.getByProjectId", { projectId: projectId as string })
  await ssg.fetchQuery("story.getForTimekeeper", {
    projectId: projectId as string,
    sprintId: sprintId as string,
    startDate: businessDays[0]!,
    endDate: businessDays[businessDays.length - 1]!,
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}
