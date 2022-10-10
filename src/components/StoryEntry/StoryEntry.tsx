import { GiCube, GiEmptyHourglass, GiSprint } from "react-icons/gi"
import { StoryStates, StoryTypes } from "../../server/data/data"

import { StoryGetByIdOutput } from "../../server/router/story"
import { StoryState as StoryStateEnum } from "@prisma/client"
import { classNames } from "../../utils/aux"
import { useMemo } from "react"

interface Props {
  story: StoryGetByIdOutput
  showAssignee?: boolean
}

export default function StoryEntry({ story, showAssignee }: Props) {
  const storyEffort = useMemo(() => {
    if (story) {
      let worklogDaySum: number = 0
      story.worklogs.forEach((w) => (worklogDaySum += w.effort))
      return worklogDaySum
    }
  }, [story])

  if (!story) return null

  return (
    <div className="px-4 pt-4 pb-3 hover:cursor-pointer hover:bg-slate-100 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-md truncate font-semibold text-gray-600 hover:cursor-pointer hover:text-gray-500">
          {story.title}
        </p>
        <div className="flex flex-shrink-0">
          <p
            className={classNames(
              story.state === StoryStateEnum.NEW
                ? "bg-violet-400 text-violet-700"
                : story.state === StoryStateEnum.READY
                ? "bg-purple-200 text-purple-700"
                : story.state === StoryStateEnum.IN_PROGRESS
                ? "pulse animate-pulse bg-amber-400 text-amber-800"
                : story.state === StoryStateEnum.DELIVERED
                ? "bg-cyan-400 text-cyan-700"
                : story.state === StoryStateEnum.IN_REVIEW
                ? "bg-teal-400 text-teal-700"
                : story.state === StoryStateEnum.DONE
                ? "bg-green-400 text-green-700"
                : story.state === StoryStateEnum.BLOCKED
                ? "bg-rose-400 text-rose-700"
                : "",
              "inline-flex rounded-sm px-2 text-xs font-semibold uppercase leading-5"
            )}
          >
            {StoryStates.get(story.state) as string}
          </p>
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <div className="flex">
          <p className="flex items-center text-gray-500">
            <GiCube className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {StoryTypes.get(story.type) as string}
          </p>
          <div className="pr-3" />
          <p className="flex items-center text-gray-500">
            <GiEmptyHourglass className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {storyEffort}h / {story.estimate}h
          </p>

          <>
            <div className="pr-3" />
            <p className="flex items-center text-gray-500">
              <GiSprint className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {story.sprint ? story.sprint.title : "Backlog"}
            </p>
          </>
          {showAssignee && story.assignee ? (
            <>
              <div className="pl-3" />
              <img
                className="inline-block h-7 w-7 rounded-full border shadow-md"
                src={story.assignee.image}
                alt="profile_pic"
                title={story.assignee.name}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
}
