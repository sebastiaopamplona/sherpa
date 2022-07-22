interface Props {
  label: string
  onClick: () => void
}

export default function Button(props: Props) {
  return (
    <button
      className="w-full inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}
