import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Fragment, useEffect } from "react"
import { Listbox, Transition } from "@headlessui/react"

import { classNames } from "../../utils/aux"

export type SelectEntry = {
  id: string
  text: string
  image?: string
}

type Props<T> = {
  label?: string
  note?: string
  upwards?: boolean
  register?: (value: string) => void
  entries: T[]
  selectedState: [T, (entry: T) => void]
  getId: (e: T) => string
  getText: (e: T) => string
  getImage?: (e: T) => string
}

const Select = <T extends { id: string }>({
  label,
  note,
  upwards,
  selectedState,
  register,
  entries,
  getId,
  getText,
  getImage,
}: Props<T>) => {
  const [selected, setSelected] = selectedState

  useEffect(() => {
    if (register) {
      register(selected.id)
    }
  }, [register, selected])

  if (typeof entries === "undefined") return null

  return (
    <>
      <Listbox disabled={entries.length === 0} value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            {label ? <Listbox.Label className="mb-1 block text-sm font-medium text-gray-700">{label}</Listbox.Label> : <></>}
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                <span className="flex items-center">
                  {getImage ? <img src={getImage(selected)} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" /> : <></>}
                  <span className="ml-3 block truncate">{getText(selected)}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className={classNames(
                    upwards ? "bottom-11" : "",
                    "absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  )}
                >
                  {entries.map((entry: T) => (
                    <Listbox.Option
                      key={getId(entry)}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={entry}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            {getImage ? (
                              <img src={getImage(entry)} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                            ) : (
                              <></>
                            )}
                            <span className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
                              {getText(entry)}
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
      {note ? <p className="mt-2 text-xs text-gray-500"> {note}</p> : <></>}
    </>
  )
}

export default Select
