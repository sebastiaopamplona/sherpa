import { GiMagnifyingGlass } from "react-icons/gi"

interface Props {
  message: string
}

export default function EmptyResources(props: Props) {
  return (
    <>
      <div className="mt-1 flex items-center justify-center">
        <GiMagnifyingGlass className="h-32 w-32 text-slate-600" aria-hidden="true" />
      </div>
      <div className="mt-1 flex items-center justify-center text-xl font-semibold text-slate-600">
        <h1>{props.message}</h1>
      </div>
      <div className="p-2" />
    </>
  )
}
