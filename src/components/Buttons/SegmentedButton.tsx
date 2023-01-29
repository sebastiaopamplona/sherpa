import { UseFormRegisterReturn } from "react-hook-form"
import { useState } from "react"

interface Props {
  options: Array<string>
  selected?: number
  onClick(btnIndex: number): void
}

export default function SegmentedButton(props: Props) {
  function defineSelected(): number {
    if (props.selected && props.selected > 0 && props.selected < props.options.length) {
      return props.selected
    }

    return 0
  }

  const [selected, setSelected] = useState<number>(defineSelected)

  function defineExtendedClasses(btnIndex: number): String {
    let res = ""
    if (btnIndex == selected) {
      res += "text-blue-700"
    }

    switch (btnIndex) {
      case 0:
        res += " rounded-l-lg"
        break
      case props.options.length - 1:
        res += " rounded-r-md"
        break
    }

    return res
  }

  return (
    <div className={"py-2"}>
      {props.options.map((option, i) => (
        <button
          key={`segmented-option-${i}-${option}`}
          type="button"
          className={`segmented-btn-base ${defineExtendedClasses(i)}`}
          onClick={() => {
            setSelected(i)
            props.onClick(i)
          }}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
