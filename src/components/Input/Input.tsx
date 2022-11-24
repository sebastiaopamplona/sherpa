import { UseFormRegisterReturn } from "react-hook-form"
import { classNames } from "../../utils/aux"

interface Props {
  // core
  label?: string
  value?: string | number
  note?: string
  inputType?: string
  classNames?: string

  // events
  register?: UseFormRegisterReturn<string>
  onBlur?: Function
}

export default function Input(props: Props) {
  return (
    <>
      {props.label ? (
        <>
          <label className="block text-sm font-medium text-gray-700">{props.label}</label>
          <div className="pt-1" />
        </>
      ) : (
        <></>
      )}
      <div>
        <input
          defaultValue={props.value ? props.value : ""}
          type={props.inputType ? props.inputType : "text"}
          className={classNames(
            props.classNames
              ? props.classNames
              : "block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          )}
          {...props.register}
          onBlur={() => {
            props.onBlur ? props.onBlur() : () => {}
          }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500"> {props.note && props.note}</p>
    </>
  )
}
