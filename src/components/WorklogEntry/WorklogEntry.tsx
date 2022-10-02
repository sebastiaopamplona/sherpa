import { CalendarIcon, ClockIcon } from "@heroicons/react/outline"

import { WorklogInput } from "../../server/schemas/schemas"

interface Props {
  worklog: WorklogInput
  showAssignee?: boolean
}

export default function WorklogEntry(props: Props) {
  const dateAsString = `${props.worklog.date.getDate()}/${
    props.worklog.date.getMonth() + 1
  }/${props.worklog.date.getFullYear()}`
  const nRows = props.worklog.description.split(/\r\n|\r|\n/).length

  return (
    <div className="rounded-md border-2  px-4 pt-4 pb-3 sm:px-6">
      <div className="flex items-center justify-between">
        <textarea
          readOnly={true}
          value={props.worklog.description}
          rows={Math.min(10, nRows)}
          className="block w-full resize-none rounded-md border border-gray-100 shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm"
        />
      </div>
      <div className="py-1" />
      <div className="flex justify-between text-xs">
        <div className="flex">
          <img
            className="inline-block h-7 w-7 rounded-full border shadow-md"
            src={props.worklog.creator.image}
            alt="profile_pic"
            title={props.worklog.creator.name}
          />
          <p className="flex items-center pl-2 text-gray-500">{props.worklog.creator.name}</p>

          <p className="flex items-center pl-3 text-gray-500">
            <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {props.worklog.effort}h
          </p>
          <p className="flex items-center pl-3 text-gray-500">
            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {dateAsString}
          </p>
        </div>
      </div>
    </div>
  )
}
