import { ArrElement, ButtonDefaultCSS, classNames } from "../../utils/aux"
import { SubmitHandler, useForm } from "react-hook-form"

import Input from "../input/input"
import { ProjectGetByUserIdOutput } from "../../server/router/project"
import Textarea from "../textarea/textarea"
import { XCircleIcon } from "@heroicons/react/solid"
import { trpc } from "../../utils/trpc"
import { useSession } from "next-auth/react"
import { useState } from "react"

type ProjectInformation = {
  creatorId: string
  name: string
  githubUrl: string
  description: string
}

interface Props {
  project?: ArrElement<ProjectGetByUserIdOutput>
  onCreateOrUpdateSuccess: (projectId: string) => void
  onCreateOrUpdateError: () => void
}

export default function ProjectForm({ project, onCreateOrUpdateSuccess, onCreateOrUpdateError }: Props) {
  const session = useSession()

  const { register, handleSubmit } = useForm<ProjectInformation>()
  const [errorMessage, setErrorMessage] = useState<string>("")

  const mutation = trpc.useMutation(["project.create"], {
    onSuccess: (data) => {
      onCreateOrUpdateSuccess(data.id)
    },
    onError: (error) => {
      onCreateOrUpdateError()
      // setErrorMessage(error.message)
    },
  })

  const handleCreateProject: SubmitHandler<ProjectInformation> = (data) => {
    data.creatorId = session.data!.userid as string
    mutation.mutate(data)
  }

  return (
    <form className="col-span-3 col-start-2" onSubmit={handleSubmit(handleCreateProject)}>
      <div className="col-span-3 col-start-2 grid grid-cols-2 gap-4 p-4">
        <div className="col-span-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create Story</h3>
        </div>
        <div className="col-span-1">
          <Input value={project ? project.name : ""} label="Project name" register={register("name")} />
        </div>
        <div className="col-span-1">
          <Input
            value={project && project.githubUrl ? project.githubUrl : ""}
            label="GitHub URL"
            register={register("githubUrl")}
          />
        </div>
        <div className="col-span-2">
          <Textarea
            value={project && project.description ? project.description : ""}
            label="Description"
            register={register("description")}
          />
        </div>
        <div className="col-span-2 flex items-center justify-center">
          <button className={ButtonDefaultCSS}>Create project</button>
        </div>
        <div className={classNames(errorMessage === "" ? "hidden" : "flex", "col-span-2 items-center justify-center")}>
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
