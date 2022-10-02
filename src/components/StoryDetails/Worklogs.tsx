import { ButtonDefaultCSS, EventWrapper, classNames } from "../../utils/aux"
import { StoryInput, WorklogInput } from "../../server/schemas/schemas"

import WorklogEntry from "../WorklogEntry/WorklogEntry"
import WorklogForm from "./WorklogForm"
import { useState } from "react"

interface Props {
  story?: StoryInput
  isAddingWorklog?: boolean
  worklogDay?: Date

  onCreate?: EventWrapper
  onUpdate?: EventWrapper
  onDelete?: EventWrapper

  onCancel: () => void
}

export default function Worklogs({
  story,
  isAddingWorklog,
  worklogDay,
  onCreate,
  onUpdate,
  onDelete,
  onCancel,
}: Props) {
  // const remainingEffort = useMemo(() => {
  //   if (!story) return 0

  //   if (story.worklogs.length === 0) {
  //     return story.estimate
  //   } else {
  //     let worklogSum: number = 0
  //     story.worklogs.forEach((w: WorklogInput) => (worklogSum += w.effort))
  //     return story.estimate - worklogSum
  //   }
  // }, [story])

  const [isWrittingWorklog, setIsWrittingWorklog] = useState<boolean>(isAddingWorklog ? isAddingWorklog : false)
  const [worklogs, setWorklogs] = useState<WorklogInput[]>(story ? story.worklogs : [])
  const [editingWorklog, setEditingWorklog] = useState<{ worklog: WorklogInput; idx: number } | undefined>(undefined)

  // TODO(SP): use date to insert
  const insertWorklog = (w: WorklogInput, idx: number = -1) => {
    if (idx === -1) {
      setWorklogs([w, ...worklogs])
    } else {
      let tmp: WorklogInput[] = worklogs
      tmp.splice(idx, 0, w)
      setWorklogs(tmp)
    }
  }

  return (
    <div className="p-6">
      <div className={classNames(isWrittingWorklog ? "" : "hidden")}>
        <WorklogForm
          storyId={story!.id}
          worklog={editingWorklog?.worklog}
          worklogDay={worklogDay}
          onCreate={{
            onSuccess: (data) => {
              onCreate?.onSuccess()
              setWorklogs([data, ...worklogs])
              setIsWrittingWorklog(false)
            },
            onError: () => {
              onCreate?.onError()
            },
          }}
          // onCreate={() => {
          //   onCreate()
          //   setIsWrittingWorklog(false)
          // }}
          onCancel={() => {
            setIsWrittingWorklog(false)
          }}
        />
      </div>
      <div className={classNames((worklogs && worklogs.length > 0) || isWrittingWorklog ? "hidden" : "")}>
        <div className="text-md flex items-center justify-center py-2 text-slate-500">
          <h1>You have no worklogs.</h1>
        </div>
      </div>
      <div className="mb-3 grid grid-cols-6 gap-y-6 gap-x-4">
        <div className="col-span-6 inline-flex items-center justify-center">
          <button
            className={classNames(isWrittingWorklog ? "hidden" : "", ButtonDefaultCSS)}
            onClick={() => setIsWrittingWorklog(true)}
          >
            New worklog
          </button>
        </div>
      </div>
      <div
        className={classNames(
          worklogs && worklogs.length === 0 ? "hidden" : "",
          "grid grid-cols-6 gap-y-6 gap-x-4 overflow-y-scroll px-2"
        )}
      >
        {worklogs && worklogs.length > 0 ? (
          <div className="col-span-6 shadow-sm">
            <ul role="list">
              {worklogs.map((worklog: WorklogInput, idx: number) => (
                <li
                  className="cursor-pointer py-1"
                  key={worklog.id}
                  onClick={() => {
                    // alert("hey")
                    // setEditingWorklog({ worklog: worklog, idx: idx })
                    // setWorklogs(worklogs.filter((w: WorklogInput) => w.id !== worklog.id))
                    // // setSelectedDate(worklog.date)
                    // // setValue("description", worklog.description)
                    // // setValue("effort", worklog.effort)
                    // setIsWrittingWorklog(true)
                  }}
                >
                  <WorklogEntry worklog={worklog} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div
              className={classNames(
                isWrittingWorklog ? "hidden" : "",
                "text-md col-span-6 inline-flex items-center justify-center"
              )}
            >
              This story has no worklogs yet.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
