import { ButtonDefaultCSS, EventWrapper, classNames } from "../../utils/aux"
import { StoryInput, WorklogInput } from "../../server/schemas/schemas"
import { setHours, setMinutes, setSeconds } from "date-fns"

import DatePicker from "../Datepicker/Datepicker"
import Input from "../Input/Input"
import Textarea from "../Textarea/Textarea"
import WorklogEntry from "../WorklogEntry/WorklogEntry"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
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

export default function StoryWorklogs({ story, isAddingWorklog, worklogDay, onCreate, onUpdate, onDelete, onCancel }: Props) {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const [selectedDate, setSelectedDate] = useState(worklogDay ? worklogDay : new Date())
  const [isWrittingWorklog, setIsWrittingWorklog] = useState<boolean>(isAddingWorklog ? isAddingWorklog : false)

  const createWorklogM = trpc.useMutation(["worklog.create"], { onSuccess: onCreate?.onSuccess, onError: onCreate?.onError })

  const { register, getValues } = useForm<WorklogInput>()

  const handleCreateWorklog = () => {
    const now = new Date()
    const dateWithHour: Date = setHours(setMinutes(setSeconds(selectedDate, now.getSeconds()), now.getMinutes()), now.getHours())

    let values = getValues()

    values.creatorId = session?.data?.userid as string
    values.projectId = projectId
    values.date = dateWithHour
    values.storyId = story!.id

    createWorklogM.mutate(values)
  }

  return (
    <div className="p-6">
      <div className={classNames(isWrittingWorklog ? "" : "hidden", "col-span-6 grid grid-cols-6 gap-y-6 gap-x-4")}>
        <div className="col-span-2">
          <DatePicker
            selectedDateState={[
              selectedDate,
              (d: Date) => {
                setSelectedDate(d)
              },
            ]}
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Worklog effort"
            register={register("effort", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Remaining effort"
            register={register("remainingEffort", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="col-span-6">
          <Textarea
            label="What did you do?"
            register={register("description")}
            note="(Markdown will be supported in the future)"
            nRows={10}
          />
        </div>
        <div className="col-span-1 col-start-3 inline-flex items-center justify-center">
          <button className={ButtonDefaultCSS} onClick={() => setIsWrittingWorklog(false)}>
            Cancel
          </button>
        </div>
        <div className="col-span-1 inline-flex items-center justify-center">
          <button
            className={ButtonDefaultCSS}
            onClick={() => {
              handleCreateWorklog()
              setIsWrittingWorklog(false)
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className={classNames((story && story.worklogs.length > 0) || isWrittingWorklog ? "hidden" : "")}>
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
          story && story.worklogs.length === 0 ? "hidden" : "",
          "grid grid-cols-6 gap-y-6 gap-x-4 overflow-y-scroll px-2"
        )}
      >
        {story && story.worklogs.length > 0 ? (
          <div className="col-span-6 shadow-sm">
            <ul role="list">
              {story.worklogs.map((worklog: WorklogInput) => (
                <li
                  className="py-1"
                  key={worklog.id}
                  onClick={() => {
                    // TODO(SP): allow edit
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
