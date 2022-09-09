import { ArrElement, EventWrapper } from "../../utils/aux"
import {
  NoSprint,
  NoUser,
  StoryState,
  StoryStates,
  StoryStatesArray,
  StoryType,
  StoryTypes,
  StoryTypesArray,
} from "../../server/data/data"
import { Story, StoryInput } from "../../server/schemas/schemas"

import Input from "../Input/Input"
import Select from "../Select/select"
import { SprintGetByProjectIdOutput } from "../../server/router/sprint"
import Textarea from "../Textarea/Textarea"
import { UserGetByProjectIdOutput } from "../../server/router/user"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface Props {
  story?: StoryInput
  isAddingWorklog?: boolean
  worklogDay?: Date

  onCreate?: EventWrapper
  onUpdate?: EventWrapper
  onDelete?: EventWrapper

  onCancel: () => void
}

export default function StoryDetails({ story, isAddingWorklog, worklogDay, onCreate, onUpdate, onDelete, onCancel }: Props) {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query

  const isCreateMode = typeof story === "undefined"

  const [selectedUser, setSelectedUser] = useState<ArrElement<UserGetByProjectIdOutput>>(storyUser(story))
  const [selectedType, setSelectedType] = useState<StoryType>(storyType(story))
  const [selectedState, setSelectedState] = useState<StoryState>(storyState(story))
  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>(storySprint(story))

  const users = trpc.useQuery(["user.getByProjectId", { projectId: projectId as string }], {})
  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: projectId as string }], {})
  const createStoryM = trpc.useMutation(["story.create"], { onSuccess: onCreate?.onSuccess, onError: onCreate?.onError })
  const updateStoryM = trpc.useMutation(["story.update"], { onSuccess: onUpdate?.onSuccess, onError: onUpdate?.onError })
  const deleteStoryM = trpc.useMutation(["story.deleteById"], { onSuccess: onDelete?.onSuccess, onError: onDelete?.onError })

  const { reset, register, getValues, setValue } = useForm<StoryInput>({})

  const handleCreateStory = () => {
    let values = getValues()
    values.creatorId = session?.data?.userid as string
    values.projectId = projectId

    createStoryM.mutate(values)
  }

  const handleUpdateStory = () => {
    let values = getValues()
    values.id = story!.id

    updateStoryM.mutate(values)
  }

  if (users.isLoading || sprints.isLoading) return null

  return (
    <>
      {/* content */}
      <div className="grid grid-cols-6 gap-3 overflow-y-auto p-6">
        <div className="col-span-6">
          <Input value={story ? story.title : ""} label="Title" register={register("title")} />
        </div>
        <div className="col-span-6">
          <Textarea
            label="Description"
            value={story ? story.description : ""}
            register={register("description")}
            note="(Markdown will be supported in the future)"
            nRows={15}
          />
        </div>
        <div className="col-span-3">
          <Select
            label="Type"
            entries={StoryTypesArray}
            register={(value: string) => setValue("type", value)}
            getId={(t) => t.id}
            getText={(t) => t.text}
            selectedState={[selectedType, setSelectedType]}
          />
        </div>
        <div className="col-span-3">
          <Select
            label="State"
            entries={StoryStatesArray}
            register={(value: string) => setValue("state", value)}
            getId={(t) => t.id}
            getText={(t) => t.text}
            selectedState={[selectedState, setSelectedState]}
          />
        </div>
        <div className="col-span-3">
          <Select
            label="Assigned to"
            entries={users.data!}
            register={(value: string) => setValue("assigneeId", value)}
            getId={(t) => t.id}
            getText={(t) => t.name}
            getImage={(t) => t.image}
            selectedState={[selectedUser, setSelectedUser]}
          />
        </div>
        <div className="col-span-3">
          <Select
            label="Sprint"
            note="(Optional)"
            register={(value: string) => setValue("sprintId", value)}
            entries={sprints.data!}
            getId={(t) => t.id}
            getText={(t) => t.title}
            selectedState={[selectedSprint, setSelectedSprint]}
          />
        </div>
        <div className="col-span-2">
          <Input
            value={story ? story.estimate : ""}
            inputType="number"
            label="Estimate"
            register={register("estimate", { valueAsNumber: true })}
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
          <Input label="Jira Ticket ID" value={story ? story.jiraId : ""} note="(Optional)" register={register("jiraId")} />
        </div>
      </div>

      {/* footer */}
      <div className="absolute inset-x-0 bottom-0 w-full justify-end border-t-[1px] border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            onCancel()
            reset(Story.default)
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            isCreateMode ? handleCreateStory() : handleUpdateStory()
          }}
        >
          {isCreateMode ? "Create" : "Save"}
        </button>
      </div>
    </>
  )
}

const storyUser: (story?: StoryInput) => ArrElement<UserGetByProjectIdOutput> = (story) => {
  if (story && story.assignee) {
    return story.assignee
  } else {
    return NoUser
  }
}

const storyType: (story?: StoryInput) => StoryType = (story) => {
  if (story) {
    return { id: story.type, text: StoryTypes.get(story.type) as string, icon: undefined }
  } else {
    return StoryTypesArray[0]!
  }
}

const storyState: (story?: StoryInput) => StoryState = (story) => {
  if (story) {
    return { id: story.state, text: StoryStates.get(story.state) as string }
  } else {
    return StoryStatesArray[0]!
  }
}

const storySprint: (story?: StoryInput) => ArrElement<SprintGetByProjectIdOutput> = (story) => {
  if (story && story.sprint) {
    return story.sprint
  } else {
    return NoSprint
  }
}
