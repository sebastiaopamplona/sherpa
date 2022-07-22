import { UseFormRegisterReturn } from "react-hook-form"

interface Props {
  label: string
  note?: string
  register: UseFormRegisterReturn<string>
}

export default function Input(props: Props) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          {...props.register}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500"> {props.note && props.note}</p>
    </>
  )
}
