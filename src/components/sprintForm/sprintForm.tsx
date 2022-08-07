import { ButtonDefaultCSS } from "../../utils/aux"
import DatePicker from "../datepicker/datepicker"
import Input from "../input/input"
import { SprintInput } from "../../server/schemas/schemas"
import Textarea from "../textarea/textarea"
import { addDays } from "date-fns"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface Props {
  onCreateOrUpdateSuccess: () => void
  onCreateOrUpdateError: () => void
}

export default function SprintForm({ onCreateOrUpdateSuccess, onCreateOrUpdateError }: Props) {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const [startAt, setStartAt] = useState<Date>(new Date())
  const [endAt, setEndAt] = useState<Date>(addDays(new Date(), 14))

  const { handleSubmit, register } = useForm<SprintInput>()
  const createSprintMutation = trpc.useMutation(["sprint.create"], {
    onSuccess: () => {
      onCreateOrUpdateSuccess()
    },
    onError: () => {
      onCreateOrUpdateError()
    },
  })
  const handleCreateSprint = (values: SprintInput) => {
    values.creatorId = session?.data?.userid as string
    values.projectId = projectId
    values.startAt = startAt
    values.endAt = endAt

    createSprintMutation.mutate(values)
  }

  return (
    <div>
      <div className="overflow-y-scroll">
        <form onSubmit={handleSubmit(handleCreateSprint)}>
          <div className="p-2">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Sprint</h3>
            </div>
            <div className="mt-6 grid grid-cols-6 gap-y-6 gap-x-4 overflow-y-scroll px-2 pb-20">
              <div className="col-span-2">
                <Input label="Title" register={register("title")} />
              </div>
              <div className="col-span-2">
                <DatePicker
                  label="Start at"
                  selectedDateState={[
                    startAt,
                    (d: Date) => {
                      setStartAt(d)
                    },
                  ]}
                />
              </div>
              <div className="col-span-2">
                <DatePicker
                  label="End at"
                  selectedDateState={[
                    endAt,
                    (d: Date) => {
                      setEndAt(d)
                    },
                  ]}
                />
              </div>
              <div className="col-span-6">
                <Textarea
                  label="Description"
                  value={""}
                  register={register("description")}
                  note="(Markdown will be supported in the future)"
                  nRows={10}
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-6 gap-y-6 gap-x-4">
              <div className="col-span-6 inline-flex items-center justify-center">
                <button className={ButtonDefaultCSS}>Create sprint</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
