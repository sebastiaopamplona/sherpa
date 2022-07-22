import { CreateProjectInput } from "../../schemas/project"
import Layout from "../../components/layout"
import Sidebar from "../../components/sidebar"
import { trpc } from "../../utils/trpc"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"

export default function Backlog() {
  const session = useSession()

  const getStoryById = trpc.useQuery([
    "story.getById",
    { id: "cl5vl6kgo0047trt3unlp98st" },
  ])

  const createStoryMutation = trpc.useMutation(["story.create"], {
    onSuccess: () => {
      console.log("story created successfully")
    },
    onError: (data) => {
      console.log("failed to create story, ", data.message)
    },
  })

  const handlecreateStoryMutation = async () => {
    createStoryMutation.mutate({
      title: "dummy title",
      description: "input.description",
      estimate: 120,

      projectId: "cl5vl3nij0036trt3iarsxcs3",
      creatorId: session?.data?.userid as string,
      // sprintId: "input.sprintId",

      githubId: "input.githubId",
      jiraId: "input.jiraId",

      state: "NEW",
      type: "DEVELOPMENT",
    })
  }

  const { handleSubmit, register } = useForm<CreateProjectInput>()

  const { mutate, error } = trpc.useMutation(["project.create"], {
    onSuccess: (data) => {
      console.log("project created, data: ", data)
    },
    onError: (error) => {
      console.log("project creation failed, error: ", error)
    },
  })

  const handleCreateProject = (values: CreateProjectInput) => {
    console.log("handleCreateProject")
    values.creatorId = session?.data?.userid as string
    mutate(values)
  }

  return (
    <section>
      <h2>Backlog</h2>
      <button
        onClick={handlecreateStoryMutation}
        disabled={createStoryMutation.isLoading}
      >
        Create Dummy Story
      </button>

      {createStoryMutation.error && (
        <p>Something went wrong! {createStoryMutation.error.message}</p>
      )}
      <div>
        getStoryById ({getStoryById.status}):{" "}
        <pre>{JSON.stringify(getStoryById.data, null, 2)}</pre>
      </div>

      <div className="px-[500px]">
        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Create Story
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              (Extra info can go here)
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-5">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                Estimate
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  defaultValue={""}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Write a few sentences about yourself.
                </p>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium text-gray-700"
              >
                Street address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP / Postal code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleCreateProject)}>
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create Project
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                (Extra info can go here)
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register("name")}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    defaultValue={""}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Write a few sentences about yourself.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  GitHub URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    {...register("githubUrl")}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">(Optional)</p>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jira URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    {...register("jiraUrl")}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">(Optional)</p>
              </div>
              <div className="sm:col-span-6">
                <button className="w-full inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create project
                </button>
                <p> {error && error.message}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
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
