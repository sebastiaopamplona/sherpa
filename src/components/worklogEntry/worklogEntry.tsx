import { ClockIcon, CubeIcon, FlagIcon } from "@heroicons/react/outline"

import { WorklogType } from "../../server/schemas/schemas"

interface Props {
  worklog: WorklogType
  showAssignee?: boolean
}

export default function WorklogEntry(props: Props) {
  return (
    <div className="px-4 pt-4 pb-3 sm:px-6 hover:cursor-pointer hover:bg-slate-100">
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold text-gray-600 hover:text-gray-500 hover:cursor-pointer truncate">Title</p>
        <div className="flex-shrink-0 flex">
          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-sm uppercase bg-green-100 text-green-800">
            State
          </p>
        </div>
      </div>
      <div className="py-1" />
      <div className="flex justify-between text-xs">
        <div className="flex">
          <p className="flex items-center text-gray-500">
            <CubeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Type
          </p>
          <div className="pr-3" />
          <p className="flex items-center text-gray-500">
            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            0h / {props.worklog.estimate / 60}h
          </p>

          <>
            <div className="pr-3" />
            <p className="flex items-center text-gray-500">
              <FlagIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              {props.worklog.sprint ? props.worklog.sprint.title : "Backlog"}
            </p>
          </>
          {props.showAssignee && props.worklog.assignee ? (
            <>
              <div className="pl-3" />
              <img
                className="inline-block border shadow-md h-7 w-7 rounded-full"
                src={props.worklog.assignee.image}
                alt="profile_pic"
                title={props.worklog.assignee.name}
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
