import { ArrElement, CrudEventWrapper } from "../../utils/aux"
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
import { useEffect, useState } from "react"
import remarkGfm from "remark-gfm"

import Input from "../Input/Input"
import Select from "../Select/Select"
import { SprintGetByProjectIdOutput } from "../../server/trpc/router/sprint"
import { StoryInput } from "../../server/schemas/schemas"
import Textarea from "../Textarea/Textarea"
import { UserGetByProjectIdOutput } from "../../server/trpc/router/user"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import ReactMarkdown from "react-markdown"
import SegmentedButton from "../Buttons/SegmentedButton"

interface Props {
  story?: StoryInput
  crudEventWrapper?: CrudEventWrapper
  preview?: boolean
  onCancel: () => void
}

export default function StoryForm({ story, crudEventWrapper, onCancel, preview }: Props) {
  const session = useSession()
  const router = useRouter()
  const { projectId } = router.query
  const isCreateMode = typeof story === "undefined"

  const [selectedUser, setSelectedUser] = useState<ArrElement<UserGetByProjectIdOutput>>(storyUser(story))
  const [selectedType, setSelectedType] = useState<StoryType>(storyType(story))
  const [selectedState, setSelectedState] = useState<StoryState>(storyState(story))
  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>(storySprint(story))

  const [showPreview, setShowPreview] = useState<boolean>(preview ?? false)

  const users = trpc.user.getByProjectId.useQuery({ projectId: projectId as string }, {})
  const sprints = trpc.sprint.getByProjectId.useQuery({ projectId: projectId as string }, {})
  const createStoryM = trpc.story.create.useMutation({
    onSuccess: crudEventWrapper?.onCreate?.onSuccess,
    onError: crudEventWrapper?.onCreate?.onError,
  })
  const updateStoryM = trpc.story.update.useMutation({
    onSuccess: crudEventWrapper?.onUpdate?.onSuccess,
    onError: crudEventWrapper?.onUpdate?.onError,
  })
  const deleteStoryM = trpc.story.deleteById.useMutation({
    onSuccess: crudEventWrapper?.onDelete?.onSuccess,
    onError: crudEventWrapper?.onDelete?.onError,
  })

  const { register, getValues, setValue } = useForm<StoryInput>({
    defaultValues: {
      estimate: isCreateMode ? 0 : story.estimate,
    },
  })

  const handleCreateStory = () => {
    let values = getValues()
    values.creatorId = session?.data?.userid as string
    values.projectId = projectId

    createStoryM.mutate(values)
  }
  const handleUpdateStory = () => {
    let values = getValues()
    values.id = story!.id

    let updatedFields: StoryInput = {
      id: story!.id,
      title: values.title != story!.title ? values.title : null,
      description: values.description != story!.description ? values.description : null,
      estimate: values.estimate != story!.estimate ? values.estimate : null,
      state: values.state != story!.state ? values.state : null,
      type: values.type != story!.type ? values.type : null,
      githubId: values.githubId != story!.githubId ? values.githubId : null,
      jiraId: values.jiraId != story!.jiraId ? values.jiraId : null,
      assigneeId: values.assigneeId != story!.assigneeId ? values.assigneeId : null,
      sprintId: values.sprintId != story!.sprintId ? values.sprintId : null,
    }

    updateStoryM.mutate(updatedFields)
  }
  const handleDeleteStory = () => {
    deleteStoryM.mutate({ id: story!.id })
  }

  useEffect(() => {
    // NOTE(SP): This is a bit ugly...
    // Got the idea from here https://github.com/react-hook-form/react-hook-form/issues/456
    // Find a cleaner way to do it

    setValue("id", story?.id)
    setValue("title", story?.title)
    setValue("description", story?.description)
    setValue("estimate", story?.estimate)
    setValue("state", story?.state)
    setValue("type", story?.type)
    setValue("githubId", story?.githubId)
    setValue("jiraId", story?.jiraId)
    setValue("assigneeId", story?.assigneeId)
    setValue("sprintId", story?.sprintId)
  }, [story])

  if (users.isLoading || sprints.isLoading) return null

  return (
    <>
      {/* content */}
      <div className="grid grid-cols-6 gap-3 overflow-y-auto p-6">
        <div className="col-span-6">
          <Input label="Title" register={register("title")} />
        </div>
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <SegmentedButton
            key={"segmented-button"}
            options={["Preview", "Editor"]}
            selected={preview ? 0 : 1}
            onClick={(btnIndex) => setShowPreview(btnIndex == 0)}
          />
          {showPreview ? (
            <ReactMarkdown className={"markdown story-description-area px-3"} remarkPlugins={[remarkGfm]}>
              {getValues("description")}
            </ReactMarkdown>
          ) : (
            <Textarea register={register("description")} nRows={10} />
          )}
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
            entries={[NoUser, ...users.data!]}
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
            entries={[NoSprint, ...sprints.data!]}
            register={(value: string) => setValue("sprintId", value)}
            getId={(t) => t.id}
            getText={(t) => t.title}
            selectedState={[selectedSprint, setSelectedSprint]}
          />
        </div>
        <div className="col-span-2">
          <Input inputType="number" label="Estimate" register={register("estimate", { valueAsNumber: true })} />
        </div>
        <div className="col-span-2">
          <Input label="GitHub Issue Number" note="(Optional)" register={register("githubId")} />
        </div>
        <div className="col-span-2">
          <Input label="Jira Ticket ID" note="(Optional)" register={register("jiraId")} />
        </div>
      </div>

      {/* footer */}
      <div className="absolute inset-x-0 bottom-0 w-full justify-end border-t-[1px] border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            onCancel()
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
        {!isCreateMode && (
          <button
            type="button"
            className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => {
              handleDeleteStory()
            }}
          >
            Delete
          </button>
        )}
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
