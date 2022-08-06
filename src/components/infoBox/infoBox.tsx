import { XCircleIcon } from "@heroicons/react/outline"

interface Props {
  message: string
  level: MessageLevel
}

export default function InfoBox({ message, level }: Props) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          {(() => {
            switch (level) {
              case MessageLevel.Success:
                return <p>hey</p>

                break

              default:
                return <p>hey</p>
                break
            }
          })()}

          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
        </div>
      </div>
    </div>
  )
}

export enum MessageLevel {
  Success = 1,
  Error,
  Info,
  Warning,
}
