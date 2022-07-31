import { ButtonDefaultCSS, ButtonDisabledCSS, classNames } from "../../utils/aux"
import { SVGProps, useEffect, useState } from "react"
import Select, { SelectEntry } from "../../components/select/select"
import { StoryState as StoryStateEnum, StoryType as StoryTypeEnum } from "@prisma/client"
import { StoryStates, StoryTypes } from "../../server/data/data"
import { StoryType, WorklogType } from "../../server/schemas/schemas"

import DatePicker from "../datepicker/datepicker"
import Input from "../input/input"
import Textarea from "../textarea/textarea"
import { UserIcon } from "@heroicons/react/solid"
import WorklogEntry from "../worklogEntry/worklogEntry"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

type Tab = {
  name: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

interface Props {
  story?: StoryType
  isAddingWorklog?: boolean
  onCreateOrUpdateSuccess: () => void
  onCreateOrUpdateError: () => void
}

export default function StoryForm(props: Props) {
  const [selectableTabs, setSelectableTabs] = useState<Tab[]>([{ name: "Details", icon: UserIcon }])
  const [selectedTab, setSelectedTab] = useState<Tab>(selectableTabs[0]!)

  useEffect(() => {
    if (props.story) {
      TABS.push({ name: "Worklogs", icon: UserIcon })
    }
  })

  return (
    <div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <div
                key={tab.name}
                className={classNames(
                  tab.name === selectedTab.name
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm hover:cursor-pointer"
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
        <StoryDetails
          story={props.story}
          onCreateOrUpdateSuccess={props.onCreateOrUpdateSuccess}
          onCreateOrUpdateError={props.onCreateOrUpdateError}
        />
      </div>
      <div className={classNames(selectedTab.name === "Worklogs" ? "" : "hidden")}>
        <StoryWorklogs story={props.story} isAddingWorklog={props.isAddingWorklog ? props.isAddingWorklog : false} />
      </div>
    </div>
  )
}

const StoryDetails: React.FC<{
  story?: StoryType
  onCreateOrUpdateSuccess: () => void
  onCreateOrUpdateError: () => void
}> = ({ story, onCreateOrUpdateSuccess, onCreateOrUpdateError }) => {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const { handleSubmit, register } = useForm<StoryType>()

  const [selectedUser, setSelectedUser] = useState<SelectEntry>(unassignedUser)
  const [selectableUsers, setSelectableUsers] = useState<SelectEntry[]>()

  const [selectedType, setSelectedType] = useState<SelectEntry>(developmentType)
  const [selectableTypes, setSelectableTypes] = useState<SelectEntry[]>()

  const [selectedState, setSelectedState] = useState<SelectEntry>(newState)
  const [selectableStates, setSelectableStates] = useState<SelectEntry[]>()

  const [selectedSprint, setSelectedSprint] = useState<SelectEntry>(noSprint)
  const [selectableSprints, setSelectableSprints] = useState<SelectEntry[]>()

  useEffect(() => {
    let statesTmp: SelectEntry[] = []
    let typesTmp: SelectEntry[] = []

    StoryStates.forEach((v, k) => {
      statesTmp.push({ id: k, text: v })
    })
    StoryTypes.forEach((v, k) => {
      typesTmp.push({ id: k, text: v })
    })

    setSelectableStates(statesTmp)
    setSelectableTypes(typesTmp)

    if (story) {
      setSelectedType({ id: story.type, text: StoryTypes.get(story.type) as string })
      setSelectedState({ id: story.state, text: StoryStates.get(story.state) as string })
    }
  }, [story])

  const createStoryMutation = trpc.useMutation(["story.create"], {
    onSuccess: () => {
      onCreateOrUpdateSuccess()
    },
    onError: () => {
      onCreateOrUpdateError()
    },
  })

  const handleCreateStory = (values: StoryType) => {
    values.estimate = 120
    values.creatorId = session?.data?.userid as string
    if (selectedUser.id !== unassignedUser.id) {
      values.assigneeId = selectedUser.id
    }
    values.type = selectedType.id
    values.state = selectedState.id
    values.sprintId = selectedSprint.id
    values.projectId = projectId

    createStoryMutation.mutate(values)
  }

  const users = trpc.useQuery(["user.getByProjectId", { projectId: projectId as string }], {
    onSuccess: (data) => {
      let tmp: SelectEntry[] = [unassignedUser]
      data.map((u) => {
        const curr = { id: u.id, text: u.name, image: u.image }
        tmp.push(curr)
        if (story && story.assigneeId === u.id) setSelectedUser(curr)
      })
      setSelectableUsers(tmp)
    },
  })

  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }], {
    onSuccess: (data) => {
      let tmp: SelectEntry[] = []
      data.map((s) => {
        const curr = { id: s.id, text: s.title }
        tmp.push(curr)
        if (story && story.sprintId === s.id) setSelectedSprint(curr)
      })
      setSelectableSprints(tmp)
    },
  })

  if (users.isLoading || sprints.isLoading) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(handleCreateStory)}>
      <div className="p-2">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create Story</h3>
        </div>
        {/* <div className="mt-6 max-h-[560px] px-2 overflow-y-scroll grid grid-cols-6 gap-y-6 gap-x-4"> */}
        <div className="mt-6 px-2 overflow-y-scroll grid grid-cols-6 gap-y-6 gap-x-4">
          <div className="col-span-5">
            <Input value={story ? story.title : ""} label="Title" register={register("title")} />
          </div>
          <div className="sm:col-span-1">
            <Input
              label="Estimate"
              value={story ? story.estimate : ""}
              inputType="number"
              register={register("estimate")}
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
            {selectedUser && selectableUsers && (
              <Select label="Assigned to" entries={selectableUsers} selectedState={[selectedUser, setSelectedUser]} />
            )}
          </div>
          <div className="col-span-2">
            {selectedType && selectableTypes && (
              <Select label="Type" entries={selectableTypes} selectedState={[selectedType, setSelectedType]} />
            )}
          </div>
          <div className="col-span-2">
            {selectedState && selectableStates && (
              <Select label="State" entries={selectableStates} selectedState={[selectedState, setSelectedState]} />
            )}
          </div>
          <div className="col-span-2">
            {selectedSprint && selectableSprints && (
              <Select label="Sprint" entries={selectableSprints} selectedState={[selectedSprint, setSelectedSprint]} />
            )}
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
        <div className="mt-6 grid gap-y-6 gap-x-4 grid-cols-6">
          {story ? (
            <>
              <div className="col-span-2 col-start-2 inline-flex items-center justify-center">
                <button className={ButtonDisabledCSS} disabled={true}>
                  Save changes
                </button>
              </div>
            </>
          ) : (
            <div className="col-span-6 inline-flex items-center justify-center">
              <button className={ButtonDefaultCSS}>Create story</button>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}

type WorklogTypeTS = {
  creatorId: string
  projectId: string
  date: Date
}

const StoryWorklogs: React.FC<{ story: StoryType; isAddingWorklog: boolean }> = ({ story, isAddingWorklog }) => {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const { handleSubmit, register } = useForm<WorklogType>()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [isWrittingWorklog, setIsWrittingWorklog] = useState<boolean>(isAddingWorklog)

  useEffect(() => {}, [story])

  const createWorklogMutation = trpc.useMutation(["worklog.create"], {
    onSuccess: () => {
      // TODO(SP):
      // onCreateOrUpdateSuccess()
    },
    onError: () => {
      // TODO(SP):
      // onCreateOrUpdateError()
    },
  })

  const handleCreateWorklog = (values: WorklogType) => {
    // TODO(SP):

    console.log("create worklog")

    values.creatorId = session?.data?.userid as string
    values.projectId = projectId
    values.date = selectedDate
    values.storyId = story.id

    createWorklogMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(handleCreateWorklog)}>
      <div className="p-2">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Worklogs</h3>
        </div>
        <div className="mt-6 max-h-[560px] px-2 overflow-y-scroll grid grid-cols-6 gap-y-6 gap-x-4">
          {story && story.worklogs.length > 0 ? (
            <div className="col-span-6 border-2 rounded-sm shadow-sm">
              <ul role="list" className="divide-y divide-gray-200">
                {story.worklogs.map((worklog: WorklogType) => (
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
                  "col-span-6 inline-flex items-center justify-center text-md"
                )}
              >
                This story has no worklogs yet.
              </div>
            </>
          )}
        </div>
        <div className={classNames(isWrittingWorklog ? "" : "hidden", "col-span-6 grid grid-cols-6 gap-y-6 gap-x-4")}>
          <div className="col-span-2">
            <DatePicker
              selectedDateState={[
                selectedDate,
                (d: Date) => {
                  setSelectedDate(d)
                  console.log(d)
                },
              ]}
            />
          </div>
          <div className="col-span-2">
            <Input label="Worklog effort" />
          </div>
          <div className="col-span-2">
            <Input label="Remaining effort" />
          </div>
          <div className="col-span-6">
            <Textarea
              value={story ? story.description : ""}
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
              onClick={(e) => {
                setIsWrittingWorklog(false)
                // e.preventDefault()
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-y-6 gap-x-4 grid-cols-6">
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

const unassignedUser: SelectEntry = {
  id: "unassigned",
  text: "Unassigned",
  image: "https://static.thenounproject.com/png/55168-200.png",
}

const newState: SelectEntry = {
  id: StoryStateEnum.NEW,
  text: StoryStates.get(StoryStateEnum.NEW)!,
}

const developmentType: SelectEntry = {
  id: StoryTypeEnum.DEVELOPMENT,
  text: StoryTypes.get(StoryTypeEnum.DEVELOPMENT)!,
}

const noSprint: SelectEntry = {
  id: "noSprint",
  text: "<No sprint>",
}
