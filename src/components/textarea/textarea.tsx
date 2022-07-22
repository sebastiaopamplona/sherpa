import { UseFormRegisterReturn } from "react-hook-form"

interface Props {
  label: string
  note?: string
  register: UseFormRegisterReturn<string>
}

export default function Textarea(props: Props) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="mt-1">
        <textarea
          rows={3}
          className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
          defaultValue={""}
          {...props.register}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500"> {props.note && props.note}</p>
    </>
  )
}
