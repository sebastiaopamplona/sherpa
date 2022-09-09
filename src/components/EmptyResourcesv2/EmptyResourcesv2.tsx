import { GoTelescope } from "react-icons/go"

interface Props {
  children: React.ReactNode
}

export default function EmptyResourcesV2({ children }: Props) {
  return (
    <>
      <div className="flex items-center justify-center py-2">
        <GoTelescope className="h-24 w-24 text-slate-600" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-center py-2 text-xl font-semibold text-slate-600">{children}</div>
      <div className="p-2" />
    </>
  )
}
