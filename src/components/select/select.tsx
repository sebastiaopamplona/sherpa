import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Dispatch, Fragment, SetStateAction } from "react"
/* This example requires Tailwind CSS v2.0+ */
import { Listbox, Transition } from "@headlessui/react"

import { classNames } from "../../utils/aux"

export type SelectEntry = {
  id: string
  text: string
  image?: string
}

interface Props {
  label: string
  note?: string
  selectedState: [SelectEntry, Dispatch<SetStateAction<SelectEntry>>]
  entries: SelectEntry[]
}

export default function Select(props: Props) {
  const [selected, setSelected] = props.selectedState

  // const [selected, setSelected] = useState<SelectEntry>(
  //   props.entries[0] as SelectEntry
  // )

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {props.label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt=""
                    className="flex-shrink-0 h-5 w-5 rounded-full"
                  />
                ) : (
                  <></>
                )}
                <span className="ml-3 block truncate">{selected.text}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-36 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {props.entries.map((entry) => (
                  <Listbox.Option
                    key={entry.id}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={entry}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {entry.image ? (
                            <img
                              src={entry.image}
                              alt=""
                              className="flex-shrink-0 h-6 w-6 rounded-full"
                            />
                          ) : (
                            <></>
                          )}
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {entry.text}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
