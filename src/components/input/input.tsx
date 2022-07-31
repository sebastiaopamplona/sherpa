import { UseFormRegisterReturn } from "react-hook-form"

interface Props {
  label: string
  value?: string
  note?: string
  inputType?: string
  register?: UseFormRegisterReturn<string>
}

export default function Input(props: Props) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700">{props.label}</label>
      <div className="mt-1">
        <input
          defaultValue={props.value ? props.value : ""}
          type={props.inputType ? props.inputType : "text"}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-300 rounded-md"
          {...props.register}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500"> {props.note && props.note}</p>
    </>
  )
}
