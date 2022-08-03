import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Listbox, Transition } from "@headlessui/react"
import { StoryState as StoryStateEnum, StoryType as StoryTypeEnum } from "@prisma/client"
import { StoryStates, StoryTypes } from "../../server/data/data"

import { Fragment } from "react"
import { classNames } from "../../utils/aux"

export type SelectEntry = {
  id: string
  text: string
  image?: string
}

interface Props {
  label?: string
  note?: string
  upwards?: boolean
  entries: SelectEntry[]
  selectedState: [SelectEntry, (entry: SelectEntry) => void]
}

export default function Select(props: Props) {
  const [selected, setSelected] = props.selectedState

  return (
    <Listbox disabled={props.entries.length === 0} value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {props.label ? (
            <Listbox.Label className="block text-sm font-medium text-gray-700">{props.label}</Listbox.Label>
          ) : (
            <></>
          )}
          <div className="relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                {selected.image ? (
                  <img src={selected.image} alt="" className="flex-shrink-0 h-5 w-5 rounded-full" />
                ) : (
                  <></>
                )}
                <span className="ml-3 block truncate">{selected.text}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
                  props.upwards ? "bottom-11" : "",
                  "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-36 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                )}
              >
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
                            <img src={entry.image} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                          ) : (
                            <></>
                          )}
                          <span
                            className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}
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

export const UnassignedUser: SelectEntry = {
  id: "unassigned",
  text: "Unassigned",
  image: "https://static.thenounproject.com/png/55168-200.png",
}

export const NewStoryState: SelectEntry = {
  id: StoryStateEnum.NEW,
  text: StoryStates.get(StoryStateEnum.NEW)!,
}

export const StoryDevelopmentType: SelectEntry = {
  id: StoryTypeEnum.DEVELOPMENT,
  text: StoryTypes.get(StoryTypeEnum.DEVELOPMENT)!,
}

export const NoSprint: SelectEntry = {
  id: "noSprint",
  text: "<No sprint>",
}
