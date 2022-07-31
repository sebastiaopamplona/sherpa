import { ButtonDefaultCSS } from "../../../utils/aux"
import DatePicker from "../../../components/datepicker/datepicker"
import Input from "../../../components/input/input"
import Layout from "../../../components/layout/layout"
import Modal from "../../../components/modal/modal"
import { ProjectType } from "../../../server/schemas/schemas"
import Sidebar from "../../../components/sidebar/sidebar"
import Textarea from "../../../components/textarea/textarea"
import { trpc } from "../../../utils/trpc"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Backlog() {
  const session = useSession()

  const [open, setOpen] = useState<boolean>(false)
  const { handleSubmit, register } = useForm<ProjectType>()
  const { mutate, error } = trpc.useMutation(["project.create"], {
    onSuccess: (data) => {},
    onError: (error) => {},
  })

  const handleCreateProject = (values: ProjectType) => {
    values.creatorId = session?.data?.userid as string
    mutate(values)
  }

  return (
    <section>
      <h2>Testing</h2>
      <div className="px-[500px] grid-cols-6 gap-2">
        <div className="col-span-1">
          <button
            className="w-full inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setOpen(true)
            }}
          >
            Create project
          </button>
        </div>
        <div className="py-4" />
        <div className="col-span-1">
          <DatePicker />
        </div>
      </div>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <form onSubmit={handleSubmit(handleCreateProject)}>
          <div className="p-2">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create Project</h3>
              <p className="mt-1 text-sm text-gray-500">(Extra info can go here)</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Input label="Name" register={register("name")} />
              </div>
              <div className="sm:col-span-6">
                <Textarea label="Description" register={register("description")} />
              </div>
              <div className="sm:col-span-6">
                <Input label="GitHub Repo URL" register={register("githubUrl")} />
              </div>
              <div className="sm:col-span-6">
                <Input label="Jira Project URL" register={register("jiraUrl")} />
              </div>
              <div className="sm:col-span-6">
                <button className={ButtonDefaultCSS}>Create project</button>
                <p> {error && error.message}</p>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <div className="py-2" />
    </section>
  )
}

Backlog.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Sidebar />
      {page}
    </Layout>
  )
}
