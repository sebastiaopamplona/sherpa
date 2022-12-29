import { CrudEventWrapper, classNames } from "../../utils/aux"
import { setHours, setMinutes, setSeconds } from "date-fns"

import DatePicker from "../Datepicker/Datepicker"
import Input from "../Input/Input"
import Textarea from "../Textarea/Textarea"
import { WorklogInput } from "../../server/schemas/schemas"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface Props {
  storyId: string
  worklog?: WorklogInput
  worklogDay?: Date
  crudEventWrapper: CrudEventWrapper
  onCancel: () => void
}

export default function WorklogForm({ storyId, worklog, worklogDay, crudEventWrapper, onCancel }: Props) {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const isCreateMode = typeof worklog === "undefined"

  const [selectedDate, setSelectedDate] = useState(worklogDay ? worklogDay : new Date())
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const createWorklogM = trpc.worklog.create.useMutation({
    onSuccess: (data) => {
      if (crudEventWrapper?.onCreate?.onSuccess) crudEventWrapper?.onCreate?.onSuccess(data)
    },
    onError: crudEventWrapper?.onCreate?.onError,
  })
  const updateWorklogM = trpc.worklog.update.useMutation({
    onSuccess: (data) => {
      if (crudEventWrapper?.onUpdate?.onSuccess) crudEventWrapper?.onUpdate?.onSuccess(data)
    },
    onError: crudEventWrapper?.onUpdate?.onError,
  })
  const deleteWorklogM = trpc.worklog.deleteById.useMutation({
    onSuccess: crudEventWrapper?.onDelete?.onSuccess,
    onError: crudEventWrapper?.onDelete?.onError,
  })

  const dateWithHour = (): Date => {
    const now = new Date()
    return setHours(setMinutes(setSeconds(selectedDate, now.getSeconds()), now.getMinutes()), now.getHours())
  }

  const { register, getValues, reset } = useForm<WorklogInput>({
    defaultValues: {
      description: worklog ? worklog.description : "",
      effort: worklog ? worklog.effort : 0,
      remainingEffort: worklog ? worklog.remainingEffort : 0,
    },
  })

  const handleCreateWorklog = () => {
    let values = getValues()

    values.creatorId = session?.data?.userid as string
    values.projectId = projectId
    values.date = dateWithHour()
    values.storyId = storyId

    createWorklogM.mutate(values)
  }

  const handleUpdateWorklog = () => {
    let values = getValues()

    values.id = worklog!.id
    values.date = dateWithHour()

    updateWorklogM.mutate(values)
  }

  const handleDeleteWorklog = () => {
    deleteWorklogM.mutate({ id: worklog!.id })
  }

  return (
    <>
      <div className={"col-span-6 grid transform grid-cols-6 gap-y-6 gap-x-4 transition duration-1000 ease-in-out "}>
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
            value={worklog ? worklog.effort : 0}
            register={register("effort", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="col-span-2">
          <Input
            label="Remaining effort"
            // calculate remaining effort
            register={register("remainingEffort", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="col-span-6">
          <Textarea
            label="What did you do?"
            value={worklog ? worklog.description : ""}
            register={register("description")}
            note="(Markdown will be supported in the future)"
            nRows={10}
          />
        </div>
      </div>
      <div className="flex items-center justify-center py-2">
        <div className={classNames(isDeleting ? "hidden" : "", "inline-flex items-center justify-center")}>
          <button
            className="s-btn-base s-btn-default"
            onClick={() => {
              reset()
              onCancel()
            }}
          >
            Cancel
          </button>
        </div>
        <div className="pr-4" />
        <div className={classNames(isDeleting ? "hidden" : "", "inline-flex items-center justify-center")}>
          <button
            className="s-btn-base s-btn-default"
            onClick={() => {
              isCreateMode ? handleCreateWorklog() : handleUpdateWorklog()
            }}
          >
            {isCreateMode ? "Create" : "Save"}
          </button>
        </div>
        <div className="pr-4" />
        <div
          className={classNames(
            !isCreateMode ? (isDeleting ? "hidden" : "") : "hidden",
            "inline-flex items-center justify-center"
          )}
        >
          <button className="s-btn-base s-btn-red" onClick={() => setIsDeleting(true)}>
            Delete
          </button>
        </div>
        <div className={classNames(isDeleting ? "" : "hidden", "inline-flex items-center justify-center")}>
          <button className="s-btn-base s-btn-default" onClick={() => setIsDeleting(false)}>
            Cancel delete
          </button>
        </div>
        <div className="pr-4" />
        <div className={classNames(isDeleting ? "" : "hidden", "inline-flex items-center justify-center")}>
          <button
            className="s-btn-base s-btn-red"
            onClick={() => {
              handleDeleteWorklog()
            }}
          >
            Confirm delete?
          </button>
        </div>
      </div>
    </>
  )
}
