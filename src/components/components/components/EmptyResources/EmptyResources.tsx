import { GoTelescope } from "react-icons/go"

interface Props {
  message: string
}

export default function EmptyResources(props: Props) {
  return (
    <>
      <div className="flex items-center justify-center py-2">
        <GoTelescope className="h-24 w-24 text-slate-600" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-center py-2 text-xl font-semibold text-slate-600">
        <h1>{props.message}</h1>
      </div>
      <div className="p-2" />
    </>
  )
}
