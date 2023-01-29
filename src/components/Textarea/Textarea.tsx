import { UseFormRegisterReturn } from "react-hook-form"

interface Props {
  label?: string
  register?: UseFormRegisterReturn<string>
  value?: string
  note?: string
  nRows?: number
}

export default function Textarea(props: Props) {
  return (
    <>
      {props.label ? <label className="mb-1 block text-sm font-medium text-gray-700">{props.label}</label> : <></>}
      <div className="">
        <textarea
          defaultValue={props.value ? props.value : ""}
          rows={props.nRows ? props.nRows : 3}
          maxLength={1500}
          className="story-description-area"
          {...props.register}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500"> {props.note && props.note}</p>
    </>
  )
}
