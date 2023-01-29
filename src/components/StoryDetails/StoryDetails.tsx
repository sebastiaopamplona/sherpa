import { CrudEventWrapper, classNames } from "../../utils/aux"
import { SVGProps, useEffect, useMemo, useState } from "react"

import SlideOver from "../SlideOver/SlideOver"
import StoryForm from "./StoryForm"
import { StoryInput } from "../../server/schemas/schemas"
import { UserIcon } from "@heroicons/react/solid"
import Worklogs from "./Worklogs"

type Tab = {
  name: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  enabled: boolean
}

interface Props {
  isOpen: boolean
  story?: StoryInput
  isAddingWorklog?: boolean
  worklogDay?: Date
  storyCrudEventWrapper?: CrudEventWrapper
  worklogCrudEventWrapper?: CrudEventWrapper
  preview?: boolean
  onClose: () => void
}

export default function StoryDetails({
  isOpen,
  story,
  isAddingWorklog,
  worklogDay,
  storyCrudEventWrapper,
  worklogCrudEventWrapper,
  preview,
  onClose,
}: Props) {
  const tabs = useMemo(
    () => [
      { name: "Details", icon: UserIcon, enabled: true },
      { name: "Worklogs", icon: UserIcon, enabled: typeof story !== "undefined" },
    ],
    [story]
  )

  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]!)
  useEffect(() => {
    if (story) {
      tabs[1]!.enabled = true

      if (isAddingWorklog) {
        setSelectedTab(tabs[1]!)
      } else {
        setSelectedTab(tabs[0]!)
      }
    } else {
      setSelectedTab(tabs[0]!)
    }
  }, [tabs, story, isAddingWorklog])

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={typeof story === "undefined" ? "New story" : story.title}
      titleSumary={
        typeof story === "undefined"
          ? "Get started by creating a new story"
          : "Edit story details and register worklogs"
      }
    >
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 px-4">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                className={classNames(
                  tab.enabled ? "" : "hidden",
                  tab.name === selectedTab.name
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium hover:cursor-pointer"
                )}
                aria-current={tab.name === selectedTab.name ? "page" : undefined}
                onClick={() => {
                  setSelectedTab(tab)
                }}
              >
                <tab.icon
                  className={classNames(
                    tab.name === selectedTab.name ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div className={classNames(selectedTab.name === "Details" ? "" : "hidden")}>
        <StoryForm story={story} crudEventWrapper={storyCrudEventWrapper} onCancel={onClose} preview={preview} />
      </div>
      <div className={classNames(selectedTab.name === "Worklogs" ? "" : "hidden")}>
        <Worklogs
          story={story}
          isAddingWorklog={isAddingWorklog}
          worklogDay={worklogDay}
          crudEventWrapper={worklogCrudEventWrapper}
          onCancel={onClose}
        />
      </div>
    </SlideOver>
  )
}
