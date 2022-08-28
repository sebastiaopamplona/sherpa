import { ArrElement, ButtonDefaultCSS, ButtonDefaultRedCSS, ButtonDisabledCSS, classNames } from "../../utils/aux"
import {
  NoSprint,
  NoUser,
  StoryStates,
  StoryStatesArray,
  StoryType,
  StoryTypes,
  StoryTypesArray,
} from "../../server/data/data"
import { SVGProps, useEffect, useMemo, useState } from "react"
import { StoryInput, WorklogInput } from "../../server/schemas/schemas"
import { setHours, setMinutes, setSeconds } from "date-fns"

import DatePicker from "../datepicker/datepicker"
import EmptyResources from "../emptyResources/emptyResources"
import Input from "../input/input"
import Select from "../../components/select/select"
import { SprintGetByProjectIdOutput } from "../../server/router/sprint"
import Textarea from "../textarea/textarea"
import { UserGetByProjectIdOutput } from "../../server/router/user"
import { UserIcon } from "@heroicons/react/solid"
import WorklogEntry from "../worklogEntry/worklogEntry"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

type Tab = {
  name: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  enabled: boolean
}

interface Props {
  story?: StoryInput
  isAddingWorklog?: boolean
  worklogDay?: Date
  onCreateOrUpdateStorySuccess: () => void
  onCreateOrUpdateStoryError: () => void
  onDeleteSuccess: () => void
  onDeleteError: () => void
  onCreateOrUpdateWorklogSuccess: () => void
  onCreateOrUpdateWorklogError: () => void
}

export default function StoryForm(props: Props) {
  const tabs = useMemo(
    () => [
      { name: "Details", icon: UserIcon, enabled: true },
      { name: "Worklogs", icon: UserIcon, enabled: typeof props.story !== "undefined" },
    ],
    [props.story]
  )

  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]!)

  useEffect(() => {
    if (props.story) {
      tabs[1]!.enabled = true

      if (props.isAddingWorklog) {
        setSelectedTab(tabs[1]!)
      }
    }
  }, [props.story, props.isAddingWorklog, tabs])

  return (
    <div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
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
      <div className="overflow-y-scroll">
        <div className={classNames(selectedTab.name === "Details" ? "" : "hidden")}>
          <StoryDetails
            story={props.story}
            onCreateOrUpdateSuccess={props.onCreateOrUpdateStorySuccess}
            onCreateOrUpdateError={props.onCreateOrUpdateStoryError}
            onDeleteSuccess={props.onDeleteSuccess}
            onDeleteError={props.onDeleteError}
          />
        </div>
        <div className={classNames(selectedTab.name === "Worklogs" ? "" : "hidden")}>
          <StoryWorklogs
            story={props.story}
            isAddingWorklog={props.isAddingWorklog}
            worklogDay={props.worklogDay}
            onCreateOrUpdateWorklogSuccess={props.onCreateOrUpdateWorklogSuccess}
            onCreateOrUpdateWorklogError={props.onCreateOrUpdateWorklogError}
          />
        </div>
      </div>
    </div>
  )
}

const StoryDetails: React.FC<{
  story?: StoryInput
  onCreateOrUpdateSuccess: () => void
  onCreateOrUpdateError: () => void
  onDeleteSuccess: () => void
  onDeleteError: () => void
}> = ({ story, onCreateOrUpdateSuccess, onCreateOrUpdateError, onDeleteSuccess, onDeleteError }) => {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const isCreateMode = typeof story === "undefined"
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const users = trpc.useQuery(["user.getByProjectId", { projectId: projectId as string }], {})
  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }], {})

  const [selectedUser, setSelectedUser] = useState<ArrElement<UserGetByProjectIdOutput>>(
    story && story.assignee ? story.assignee : NoUser
  )
  const [selectedType, setSelectedType] = useState<StoryType>(
    story ? { id: story.type, text: StoryTypes.get(story.type) as string, icon: undefined } : StoryTypesArray[0]!
  )
  const [selectedState, setSelectedState] = useState<{ id: string; text: string }>(
    story ? { id: story.state, text: StoryStates.get(story.state) as string } : StoryStatesArray[0]!
  )
  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>(
    story && story.sprint ? story.sprint : NoSprint
  )

  const { handleSubmit, register, formState } = useForm<StoryInput>({})

  const createStoryMutation = trpc.useMutation(["story.create"], {
    onSuccess: onCreateOrUpdateSuccess,
    onError: onCreateOrUpdateError,
  })

  const updateStoryMutation = trpc.useMutation(["story.update"], {
    onSuccess: onCreateOrUpdateSuccess,
    onError: onCreateOrUpdateError,
  })

  const deleteStoryMutation = trpc.useMutation(["story.deleteById"], {
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  })

  const handleCreateStory = (values: StoryInput) => {
    values.type = selectedType.id
    values.state = selectedState.id
    if (selectedUser.id !== NoUser.id) values.assigneeId = selectedUser.id
    if (selectedSprint.id !== NoSprint.id) values.sprintId = selectedSprint.id

    if (isCreateMode) {
      values.creatorId = session?.data?.userid as string
      values.projectId = projectId

      createStoryMutation.mutate(values)
    } else {
      values.id = story.id

      updateStoryMutation.mutate(values)
    }
  }

  if (users.isLoading || sprints.isLoading) return null

  return (
    <form onSubmit={handleSubmit(handleCreateStory)}>
      <div className="p-2">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create Story</h3>
        </div>
        {/* <div className="mt-6 max-h-[560px] px-2 overflow-y-scroll grid grid-cols-6 gap-y-6 gap-x-4"> */}
        <div className="mt-6 grid grid-cols-6 gap-y-6 gap-x-4 overflow-y-scroll px-2 pb-20">
          <div className="col-span-5">
            <Input value={story ? story.title : ""} label="Title" register={register("title")} />
          </div>
          <div className="sm:col-span-1">
            <Input
              label="Estimate"
              value={story ? story.estimate : ""}
              inputType="number"
              register={register("estimate", { valueAsNumber: true })}
            />
          </div>
          <div className="col-span-6">
            <Textarea
              label="Description"
              value={story ? story.description : ""}
              register={register("description")}
              note="(Markdown will be supported in the future)"
              nRows={10}
            />
          </div>
          <div className="col-span-2">
            <Select
              label="Assigned to"
              entries={users.data!}
              getId={(t) => t.id}
              getText={(t) => t.name}
              getImage={(t) => t.image}
              selectedState={[selectedUser, setSelectedUser]}
            />
          </div>
          <div className="col-span-2">
            <Select
              label="Type"
              entries={StoryTypesArray}
              getId={(t) => t.id}
              getText={(t) => t.text}
              // getIcon={(t) => t.icon}
              selectedState={[selectedType, setSelectedType]}
            />
          </div>
          <div className="col-span-2">
            <Select
              label="State"
              entries={StoryStatesArray}
              getId={(t) => t.id}
              getText={(t) => t.text}
              selectedState={[selectedState, setSelectedState]}
            />
          </div>
          <div className="col-span-2">
            <Select
              label="Sprint"
              note="(Optional)"
              entries={sprints.data!}
              getId={(t) => t.id}
              getText={(t) => t.title}
              selectedState={[selectedSprint, setSelectedSprint]}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="GitHub Issue Number"
              value={story ? story.githubId : ""}
              note="(Optional)"
              register={register("githubId")}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Jira Ticket ID"
              value={story ? story.jiraId : ""}
              note="(Optional)"
              register={register("jiraId")}
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-6 gap-y-6 gap-x-4">
          <div className="col-span-6 inline-flex items-center justify-center">
            <button disabled={!isCreateMode} className={classNames(isCreateMode ? "" : "hidden", ButtonDefaultCSS)}>
              Create story
            </button>
            <div className="px-2" />
            <button
              disabled={isCreateMode || !formState.isDirty}
              className={classNames(
                isCreateMode ? "hidden" : "",
                formState.isDirty ? ButtonDefaultCSS : ButtonDisabledCSS
              )}
            >
              Update story
            </button>
            <div className="px-2" />
            <button
              disabled={isCreateMode || isDeleting}
              className={classNames(isCreateMode || isDeleting ? "hidden" : "", ButtonDefaultRedCSS)}
              onClick={(e) => {
                e.preventDefault()
                setIsDeleting(true)
              }}
            >
              Delete story
            </button>
            <button
              disabled={isCreateMode || !isDeleting}
              className={classNames(isCreateMode || !isDeleting ? "hidden" : "", ButtonDefaultRedCSS)}
              onClick={(e) => {
                e.preventDefault()
                deleteStoryMutation.mutate({ id: story!.id })
              }}
            >
              Confirm delete?
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

const StoryWorklogs: React.FC<{
  story?: StoryInput
  isAddingWorklog?: boolean
  worklogDay?: Date
  onCreateOrUpdateWorklogSuccess: () => void
  onCreateOrUpdateWorklogError: () => void
}> = ({ story, isAddingWorklog, worklogDay, onCreateOrUpdateWorklogSuccess, onCreateOrUpdateWorklogError }) => {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const { handleSubmit, register } = useForm<WorklogInput>()
  const [selectedDate, setSelectedDate] = useState(worklogDay ? worklogDay : new Date())

  const [isWrittingWorklog, setIsWrittingWorklog] = useState<boolean>(isAddingWorklog ? isAddingWorklog : false)

  useEffect(() => {}, [story])

  const createWorklogMutation = trpc.useMutation(["worklog.create"], {
    onSuccess: () => {
      onCreateOrUpdateWorklogSuccess()
    },
    onError: () => {
      onCreateOrUpdateWorklogError()
    },
  })

  const handleCreateWorklog = (values: WorklogInput) => {
    const now = new Date()
    const dateWithHour: Date = setHours(
      setMinutes(setSeconds(selectedDate, now.getSeconds()), now.getMinutes()),
      now.getHours()
    )

    values.creatorId = session?.data?.userid as string
    values.projectId = projectId
    values.date = dateWithHour
    values.storyId = story!.id

    createWorklogMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(handleCreateWorklog)}>
      <div className="p-2">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Worklogs</h3>
        </div>
        <div className={classNames(isWrittingWorklog ? "" : "hidden", "col-span-6 grid grid-cols-6 gap-y-6 gap-x-4")}>
          <div className="col-span-2">
            <DatePicker
              selectedDateState={[
                selectedDate,
                (d: Date) => {
                  setSelectedDate(d)
                },
              ]}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Worklog effort"
              register={register("effort", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Remaining effort"
              register={register("remainingEffort", {
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="col-span-6">
            <Textarea
              label="What did you do?"
              register={register("description")}
              note="(Markdown will be supported in the future)"
              nRows={10}
            />
          </div>
          <div className="col-span-1 col-start-3 inline-flex items-center justify-center">
            <button
              className={ButtonDefaultCSS}
              onClick={(e) => {
                e.preventDefault()
                setIsWrittingWorklog(false)
                // setTimeout(function () {
                //   setIsWrittingWorklog(false)
                // }, 250)
                // scrollToWorklogs()
              }}
            >
              Cancel
            </button>
          </div>
          <div className="col-span-1 inline-flex items-center justify-center">
            <button
              className={ButtonDefaultCSS}
              onClick={() => {
                setIsWrittingWorklog(false)
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div className={classNames((story && story.worklogs.length > 0) || isWrittingWorklog ? "hidden" : "")}>
          <EmptyResources message="You have no worklogs in your backlog. Get started by creating one." />
        </div>
        <div
          className={classNames(
            story && story.worklogs.length === 0 ? "hidden" : "",
            "mt-6 grid max-h-[560px] grid-cols-6 gap-y-6 gap-x-4 overflow-y-scroll px-2"
          )}
        >
          {story && story.worklogs.length > 0 ? (
            <div className="col-span-6 rounded-sm border-2 shadow-sm">
              <ul role="list" className="divide-y divide-gray-200">
                {story.worklogs.map((worklog: WorklogInput) => (
                  <li
                    key={worklog.id}
                    onClick={() => {
                      // TODO:
                    }}
                  >
                    <WorklogEntry worklog={worklog} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div
                className={classNames(
                  isWrittingWorklog ? "hidden" : "",
                  "text-md col-span-6 inline-flex items-center justify-center"
                )}
              >
                This story has no worklogs yet.
              </div>
            </>
          )}
        </div>
        <div className="mt-6 grid grid-cols-6 gap-y-6 gap-x-4">
          <div className="col-span-6 inline-flex items-center justify-center">
            <button
              className={classNames(isWrittingWorklog ? "hidden" : "", ButtonDefaultCSS)}
              onClick={(e) => {
                e.preventDefault()
                setIsWrittingWorklog(true)
              }}
            >
              New worklog
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
