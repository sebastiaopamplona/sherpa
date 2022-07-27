import Select, { SelectEntry } from "../../components/select/select"
import { StoryState as StoryStateEnum, StoryType as StoryTypeEnum } from "@prisma/client"
import { StoryStates, StoryTypes } from "../../server/data/data"
import { useEffect, useState } from "react"

import Button from "../../components/button/button"
import Input from "../../components/input/input"
import { StoryType } from "../../server/schemas/schemas"
import Textarea from "../../components/textarea/textarea"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

interface Props {
  story?: StoryType
  onCreateOrUpdateSuccess: () => void
  onCreateOrUpdateError: () => void
}

export default function StoryForm(props: Props) {
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
      statesTmp.push({
        id: k,
        text: v,
      })
    })
    StoryTypes.forEach((v, k) => {
      typesTmp.push({
        id: k,
        text: v,
      })
    })

    setSelectableStates(statesTmp)
    setSelectableTypes(typesTmp)
  }, [])

  const createStoryMutation = trpc.useMutation(["story.create"], {
    onSuccess: (data) => {
      props.onCreateOrUpdateSuccess()
    },
    onError: (error) => {
      props.onCreateOrUpdateError()
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

  const users = trpc.useQuery(
    [
      "user.getByProjectId",
      {
        projectId: projectId as string,
      },
    ],
    {
      onSuccess: (data) => {
        let tmp: SelectEntry[] = [unassignedUser]
        data.map((u) => {
          tmp.push({
            id: u.id,
            text: u.name,
            image: u.image,
          })
        })
        setSelectableUsers(tmp)
      },
    }
  )

  const sprints = trpc.useQuery(
    [
      "sprint.getByProjectId",
      {
        projectId: projectId as string,
      },
    ],
    {
      onSuccess: (data) => {
        let tmp: SelectEntry[] = []
        data.map((s) => {
          tmp.push({
            id: s.id,
            text: s.title,
          })
        })
        setSelectableSprints(tmp)
      },
    }
  )

  if (users.isLoading || sprints.isLoading) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(handleCreateStory)}>
      <div className="p-2">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create Story</h3>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-5">
            <Input label="Title" register={register("title")} />
          </div>
          <div className="sm:col-span-1">
            <Input label="Estimate" inputType="number" register={register("estimate")} />
          </div>
          <div className="sm:col-span-6">
            <Textarea
              label="Description"
              register={register("description")}
              note="(Markdown will be supported in the future)"
              nRows={10}
            />
          </div>
          <div className="sm:col-span-2">
            {selectedUser && selectableUsers && (
              <Select label="Assigned to" entries={selectableUsers} selectedState={[selectedUser, setSelectedUser]} />
            )}
          </div>
          <div className="sm:col-span-2">
            {selectedType && selectableTypes && (
              <Select label="Type" entries={selectableTypes} selectedState={[selectedType, setSelectedType]} />
            )}
          </div>
          <div className="sm:col-span-2">
            {selectedState && selectableStates && (
              <Select label="State" entries={selectableStates} selectedState={[selectedState, setSelectedState]} />
            )}
          </div>
          <div className="sm:col-span-2">
            {selectedSprint && selectableSprints && (
              <Select label="Sprint" entries={selectableSprints} selectedState={[selectedSprint, setSelectedSprint]} />
            )}
          </div>
          <div className="sm:col-span-2">
            <Input label="GitHub Issue Number" note="(Optional)" register={register("githubId")} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Jira Ticket ID" note="(Optional)" register={register("jiraId")} />
          </div>
          {/* <div className="py-2" /> */}
          <div className="sm:col-span-6">
            <Button label={props.story ? "Update story" : "Create story"} onClick={() => {}} />
            <p> {createStoryMutation.error && createStoryMutation.error.message}</p>
          </div>
          {/* <div className="py-1" /> */}
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
