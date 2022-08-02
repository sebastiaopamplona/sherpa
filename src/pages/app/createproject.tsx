import { ButtonDefaultCSS, classNames } from "../../utils/aux"
import { SubmitHandler, useForm } from "react-hook-form"

import Input from "../../components/input/input"
import Textarea from "../../components/textarea/textarea"
import { XCircleIcon } from "@heroicons/react/solid"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"
import { useState } from "react"

type ProjectInformation = {
  creatorId: string
  name: string
  githubUrl: string
  description: string
}

export default function CreateProject() {
  const { register, handleSubmit } = useForm<ProjectInformation>()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()

  const mutation = trpc.useMutation(["project.create"], {
    onSuccess: (data) => {
      console.log("project.create succeeded! response: ", data)
      router.push(`/app/${data.id}/timekeeper`)
    },
    onError: (error) => {
      setErrorMessage(error.message)
    },
  })

  const handleCreateProject: SubmitHandler<ProjectInformation> = (data) => {
    // FIXME: fetch userid from session
    data.creatorId = "cl6c6xeuc0002b5t3d3olc53d"

    mutation.mutate(data)
  }

  return (
    <div className="grid grid-cols-5 content-start ">
      <form className="col-span-3 col-start-2" onSubmit={handleSubmit(handleCreateProject)}>
        <div className="col-span-3 col-start-2 grid grid-cols-2 gap-4 p-4">
          <h1 className="col-span-2 flex items-center justify-center font-bold text-2xl underline">Create a project</h1>
          <div className="col-span-1">
            <Input label="Project name" register={register("name")} />
          </div>
          <div className="col-span-1">
            <Input label="GitHub URL" register={register("githubUrl")} />
          </div>
          <div className="col-span-2">
            <Textarea label="Description" register={register("description")} />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button className={ButtonDefaultCSS}>Create project</button>
          </div>
          <div
            className={classNames(errorMessage === "" ? "hidden" : "flex", "col-span-2 items-center justify-center")}
          >
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
    </div>
  )
}
