import { SprintActionLogReg } from "../../server/schemas/schemas"

interface Props {
  sprintActionLog: SprintActionLogReg
}

export default function sprintActionLogEntry({ sprintActionLog }: Props) {
  return (
    <div className="relative pb-8">
      <div className="relative flex space-x-3">
        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
          <div>
            <p className="text-sm text-gray-500">{sprintActionLog.description} </p>
          </div>
          <div className="whitespace-nowrap text-right text-sm text-gray-500">
            <time dateTime={sprintActionLog.createdAt}>{sprintActionLog.createdAt.toString()}</time>
          </div>
        </div>
      </div>
    </div>
  )
}
