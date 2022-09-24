import { UseFormRegisterReturn } from "react-hook-form"

interface Props {
  label: string
  register?: UseFormRegisterReturn<string>
  value?: string
  note?: string
  nRows?: number
}

export default function Textarea(props: Props) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="mt-1">
        <textarea
          defaultValue={props.value ? props.value : ""}
          rows={props.nRows ? props.nRows : 3}
          maxLength={1500}
          className="block min-h-[200px] w-full rounded-sm border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...props.register}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500"> {props.note && props.note}</p>
    </>
  )
}
