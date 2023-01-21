import { ArrElement, classNames, pathWithParams, pathWithProjSprintUser } from "../../utils/aux"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
import { ProjectGetUserCapacityOutput, ProjectSetUserCapacityInput } from "../../server/trpc/router/project"
import React, { useMemo, useState } from "react"
import { addDays, format, getWeek, isSameDay, isToday, setHours, startOfWeek, subDays } from "date-fns"

import EmptyResourcesV2 from "../../components/EmptyResourcesv2/EmptyResourcesv2"
import { GetServerSidePropsContext } from "next"
import Input from "../../components/Input/Input"
import { IoTodayOutline } from "react-icons/io5"
import Layout from "../../components/Layout/Layout"
import Link from "next/link"
import StoryDetails from "../../components/StoryDetails/StoryDetails"
import StoryEntry from "../../components/StoryEntry/StoryEntry"
import { StoryGetForTimekeeperOutput } from "../../server/trpc/router/story"
import { StoryInput } from "../../server/schemas/schemas"
import { checkIfShouldRedirect } from "../../server/aux"
import { getJourndevAuthSession } from "../../server/session"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"

// TODO: move this to a module.css
const timekeeperGridCell = "col-span-1 border-2 flex items-center justify-center"

export default function TimeKeeper() {
  const router = useRouter()
  const { projectId, sprintId, userId } = router.query

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentDayRange, setCurrentDayRange] = useState<Date[]>(getWeekBusinessDays(new Date()))

  const stories = trpc.story.getForTimeKeeper.useQuery({
    projectId: projectId as string,
    sprintId: sprintId as string,
    assigneeId: userId as string,
    startDate: currentDayRange[0]!,
    endDate: currentDayRange[currentDayRange.length - 1]!,
  })

  const capacities = trpc.project.getUserCapacity.useQuery({
    projectId: projectId as string,
    userId: userId as string,
    startDate: currentDayRange[0]!,
    endDate: currentDayRange[currentDayRange.length - 1]!,
  })

  const [currentStory, setCurrentStory] = useState<StoryInput>()
  const [isStoryDetailsOpen, setIsStoryDetailsOpen] = useState<boolean>(false)
  const [isAddingWorklog, setIsAddingWorklog] = useState<boolean>(false)
  const [worklogDay, setWorklogDay] = useState<Date>()

  if (stories.isLoading || capacities.isLoading) return null

  return (
    <section>
      <div className="h-full px-[100px]">
        {typeof sprintId === "undefined" ? (
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
                  <span className="text-purple-300 hover:cursor-pointer hover:text-purple-400 hover:underline">
                    sprints page
                  </span>
                </Link>{" "}
                and create one.
              </p>
            </div>
          </EmptyResourcesV2>
        ) : !(stories.data && stories.data.length !== 0) ? (
          <EmptyResourcesV2>
            <div className="grid grid-cols-1 content-center gap-1">
              <p className="flex items-center justify-center">
                The selected user has no stories in the selected sprint.
              </p>
              <p className="flex items-center justify-center">
                Head over to the
                <Link
                  href={pathWithProjSprintUser(
                    "/app/backlog",
                    projectId as string,
                    sprintId as string,
                    userId as string
                  )}
                >
                  <span className="px-1 text-purple-300 hover:cursor-pointer hover:text-purple-400 hover:underline">
                    backlog page
                  </span>
                </Link>
                and create one.
              </p>
            </div>
          </EmptyResourcesV2>
        ) : (
          <div className={"grid min-w-[1304px] grid-cols-11 content-center gap-[2px]"}>
            <div className="col-span-11 flex items-end justify-end py-2">
              <TimeKeeperNav
                currentDate={currentDate}
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
              <div
                key={d.toUTCString()}
                className={classNames(isToday(d) ? "bg-slate-200" : "", "text-sm font-semibold", timekeeperGridCell)}
              >
                {`${format(d, "eeeeee")}, ${format(d, "d/M")}`}
              </div>
            ))}
            <div className="col-span-6 h-6 rounded-sm"></div>
            {capacities.data?.map((cap, i) => (
              <div key={cap.date.toString()}>
                <TimeKeeperCapacityCell
                  projectId={projectId as string}
                  userId={userId as string}
                  capacity={cap}
                  onCapacityUpdate={() => {
                    capacities.refetch()
                  }}
                />
              </div>
            ))}

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
      <StoryDetails
        story={currentStory}
        isAddingWorklog={isAddingWorklog}
        worklogDay={worklogDay}
        isOpen={isStoryDetailsOpen}
        onClose={() => {
          setIsStoryDetailsOpen(false)
        }}
        // FIXME(SP): fetch single story intead of all stories
        storyCrudEventWrapper={{
          onCreate: {
            onSuccess: () => {
              setIsStoryDetailsOpen(false)
              stories.refetch()
            },
          },
          onUpdate: {
            onSuccess: () => {
              setIsStoryDetailsOpen(false)
              stories.refetch()
            },
          },
          onDelete: {
            onSuccess: stories.refetch,
          },
        }}
        worklogCrudEventWrapper={{
          onCreate: {
            onSuccess: stories.refetch,
          },
          onUpdate: {
            onSuccess: stories.refetch,
          },
          onDelete: {
            onSuccess: stories.refetch,
          },
        }}
      />
    </section>
  )
}

const TimeKeeperNav: React.FC<{
  currentDate: Date
  onToday: () => void
  onPrevWeek: () => void
  onNextWeek: () => void
}> = ({ currentDate, onToday, onPrevWeek, onNextWeek }) => {
  return (
    <nav className="relative z-0 inline-flex -space-x-px rounded-sm" aria-label="Pagination">
      <div
        className="relative inline-flex items-center rounded-sm border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:cursor-pointer hover:bg-gray-50"
        onClick={onToday}
      >
        <span className="sr-only">Today</span>
        <IoTodayOutline className="h-5 w-5" />
      </div>
      <div className="pr-2" />
      <div
        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:cursor-pointer hover:bg-gray-50"
        onClick={onPrevWeek}
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
        onClick={onNextWeek}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
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
        <StoryEntry story={story} showAssignee={true} />
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

const TimeKeeperCapacityCell: React.FC<{
  projectId: string
  userId: string
  capacity: ArrElement<ProjectGetUserCapacityOutput>
  onCapacityUpdate: (story: StoryInput) => void
}> = ({ projectId, userId, capacity, onCapacityUpdate }) => {
  const { register, getValues } = useForm<ProjectSetUserCapacityInput>()

  const setCapacityM = trpc.project.setUserCapacity.useMutation({
    onSuccess: onCapacityUpdate,
  })

  const handleSetCapacity = () => {
    const cap: number = getValues("capacity")
    if (!isNaN(cap)) {
      setCapacityM.mutate({
        projectId: projectId,
        userId: userId,
        date: capacity.date,
        capacity: cap,
      })
    }
  }

  return (
    <div
      className={classNames(timekeeperGridCell)}
      onKeyDown={(e: { key: string }) => {
        if (e.key == "Enter") {
          handleSetCapacity()
        }
      }}
    >
      <div className={"font shadow-n rou hidden border-none"} />
      <Input
        value={capacity ? capacity.capacity : 0}
        inputType={"number"}
        classNames={
          "text-center font-medium hover:cursor-pointer hover:bg-slate-100 block w-full h-full rounded-none border-none text-sm shadow-none focus:border-none focus:ring-0"
        }
        register={register("capacity", { valueAsNumber: true })}
        onBlur={handleSetCapacity}
      />
    </div>
  )
}

const TimeKeeperWorklogCell: React.FC<{
  story: ArrElement<StoryGetForTimekeeperOutput>
  day: Date
  onWorklogCellClick: (story: StoryInput) => void
}> = ({ story, day, onWorklogCellClick }) => {
  const dayEffort = useMemo(() => {
    let worklogDaySum: number = 0
    story.worklogs?.forEach((w) => {
      if (isSameDay(w.date, day)) worklogDaySum += w.effort
    })
    return worklogDaySum
  }, [story, day])

  return (
    <div
      className={classNames("hover:cursor-pointer hover:bg-slate-100", timekeeperGridCell)}
      onClick={() => {
        onWorklogCellClick(story)
      }}
    >
      {dayEffort > 0 ? `${dayEffort}h` : ""}
    </div>
  )
}

TimeKeeper.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
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
  const redirect = await checkIfShouldRedirect("/app/timekeeper", session!.userid as string, ctx.query)
  if (redirect !== null) return redirect
  return { props: {} }
}
