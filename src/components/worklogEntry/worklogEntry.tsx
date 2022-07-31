import { CalendarIcon, ClockIcon } from "@heroicons/react/outline"

import { WorklogType } from "../../server/schemas/schemas"

interface Props {
  worklog: WorklogType
  showAssignee?: boolean
}

export default function WorklogEntry(props: Props) {
  const dateAsString = `${props.worklog.date.getDate()}/${
    props.worklog.date.getMonth() + 1
  }/${props.worklog.date.getFullYear()}`

  return (
    <div className="px-4 pt-4 pb-3 sm:px-6 hover:cursor-pointer hover:bg-slate-100">
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold text-gray-600 hover:text-gray-500 hover:cursor-pointer truncate">
          {props.worklog.description}
        </p>
      </div>
      <div className="py-1" />
      <div className="flex justify-between text-xs">
        <div className="flex">
          <img
            className="inline-block border shadow-md h-7 w-7 rounded-full"
            src={props.worklog.creator.image}
            alt="profile_pic"
            title={props.worklog.creator.name}
          />
          <p className="pl-2 flex items-center text-gray-500">{props.worklog.creator.name}</p>

          <p className="pl-3 flex items-center text-gray-500">
            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            {props.worklog.effort}h
          </p>
          <p className="pl-3 flex items-center text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            {dateAsString}
          </p>
        </div>
      </div>
    </div>
  )
}
