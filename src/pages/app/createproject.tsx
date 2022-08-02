import { SubmitHandler, useForm } from "react-hook-form"

import { ButtonDefaultCSS } from "../../utils/aux"
import Input from "../../components/input/input"
import Textarea from "../../components/textarea/textarea"

type ProjectInformation = {
  name: string
  githubUrl: string
  description: string
}

export default function CreateProject() {
  const { register, handleSubmit } = useForm<ProjectInformation>()

  const handleCreateProject: SubmitHandler<ProjectInformation> = (data) => {
    console.log(data)
    // TODO:
    //  1. send request to backend
    //  2. onSuccess -> redirect to /app/<created project id>/timekeeper
    //  3. onFailure -> show error message and don't redirect
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
        </div>
      </form>
    </div>
  )
}
