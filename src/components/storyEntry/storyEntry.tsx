import { GiCube, GiEmptyHourglass, GiSprint } from "react-icons/gi"
import { StoryStates, StoryTypes } from "../../server/data/data"

import { StoryGetByIdOutput } from "../../server/router/story"
import { useMemo } from "react"

interface Props {
  story: StoryGetByIdOutput
  showAssignee?: boolean
}

export default function StoryEntry(props: Props) {
  const storyEffort = useMemo(() => {
    if (props.story) {
      let worklogDaySum: number = 0
      props.story.worklogs.forEach((w) => (worklogDaySum += w.effort))
      return worklogDaySum
    }
  }, [props.story])

  if (!props.story) return null

  return (
    <div className="px-4 pt-4 pb-3 hover:cursor-pointer hover:bg-slate-100 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-md truncate font-semibold text-gray-600 hover:cursor-pointer hover:text-gray-500">
          {props.story.title}
        </p>
        <div className="flex flex-shrink-0">
          <p className="inline-flex rounded-sm bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
            {StoryStates.get(props.story.state) as string}
          </p>
        </div>
      </div>
      <div className="py-1" />
      <div className="flex justify-between text-xs">
        <div className="flex">
          <p className="flex items-center text-gray-500">
            <GiCube className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {StoryTypes.get(props.story.type) as string}
          </p>
          <div className="pr-3" />
          <p className="flex items-center text-gray-500">
            <GiEmptyHourglass className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {storyEffort}h / {props.story.estimate}h
          </p>

          <>
            <div className="pr-3" />
            <p className="flex items-center text-gray-500">
              <GiSprint className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              {props.story.sprint ? props.story.sprint.title : "Backlog"}
            </p>
          </>
          {props.showAssignee && props.story.assignee ? (
            <>
              <div className="pl-3" />
              <img
                className="inline-block h-7 w-7 rounded-full border shadow-md"
                src={props.story.assignee.image}
                alt="profile_pic"
                title={props.story.assignee.name}
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
