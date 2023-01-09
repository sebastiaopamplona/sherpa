import { CalendarIcon, ClockIcon } from "@heroicons/react/outline"

import { CrudEventWrapper } from "../../utils/aux"
import WorklogForm from "../StoryDetails/WorklogForm"
import { WorklogInput } from "../../server/schemas/schemas"
import { useState } from "react"

interface Props {
  worklog: WorklogInput
  showAssignee?: boolean
  crudEventWrapper: CrudEventWrapper
}

export default function WorklogEntry({ worklog, showAssignee, crudEventWrapper }: Props) {
  const [currWorklog, setCurrWorklog] = useState<WorklogInput>(worklog)

  const dateAsString = `${currWorklog.date.getDate()}/${
    currWorklog.date.getMonth() + 1
  }/${currWorklog.date.getFullYear()}`
  const nRows = currWorklog.description.split(/\r\n|\r|\n/).length

  const [isEditing, setIsEditing] = useState<boolean>(false)

  return (
    <div className="rounded-md border-2  px-4 pt-4 pb-3 sm:px-6">
      {isEditing ? (
        <WorklogForm
          storyId={currWorklog.storyId}
          worklog={worklog}
          worklogDay={currWorklog.date}
          onCancel={() => {
            setIsEditing(false)
          }}
          crudEventWrapper={{
            onUpdate: {
              onSuccess: (data) => {
                if (crudEventWrapper?.onUpdate?.onSuccess) crudEventWrapper?.onUpdate?.onSuccess(data)
                setIsEditing(false)
                setCurrWorklog(data as WorklogInput)
              },
            },
          }}
        />
      ) : (
        <div
          onClick={() => {
            setIsEditing(true)
          }}
        >
          <div className="flex items-center justify-between">
            <textarea
              readOnly={true}
              value={currWorklog.description}
              rows={Math.min(10, nRows)}
              className="block w-full resize-none rounded-md border border-gray-100 shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm"
            />
          </div>
          <div className="py-1" />
          <div className="flex justify-between text-xs">
            <div className="flex">
              <img
                className="inline-block h-7 w-7 rounded-full border shadow-md"
                src={currWorklog.creator.image}
                alt="profile_pic"
                title={currWorklog.creator.name}
              />
              <p className="flex items-center pl-2 text-gray-500">{currWorklog.creator.name}</p>

              <p className="flex items-center pl-3 text-gray-500">
                <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {currWorklog.effort}h
              </p>
              <p className="flex items-center pl-3 text-gray-500">
                <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {dateAsString}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
