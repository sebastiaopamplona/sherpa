import { ArrElement, classNames, pathWithParams, switchProject } from "../../utils/aux"
import { GiBackpack, GiEmptyHourglass, GiSprint } from "react-icons/gi"

import { ImLab } from "react-icons/im"
import Link from "next/link"
import { ProjectGetByUserIdOutput } from "../../server/router/project"
import Select from "../select/select"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function Sidebar() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { projectId, sprintId } = router.query

  const [selectedProject, setSelectedProject] = useState<ArrElement<ProjectGetByUserIdOutput>>({ id: "", name: "" })

  const projects = trpc.useQuery(["project.getByUserId", { userId: session?.userid as string }], {
    onSuccess: (data) => {
      data.forEach((p) => {
        if (p.id === projectId) {
          setSelectedProject(p)
          return
        }
      })
    },
  })

  const navigation = [
    {
      name: "Time Keeper",
      icon: GiEmptyHourglass,
      href: pathWithParams(
        "/app/timekeeper",
        new Map([
          ["projectId", projectId],
          ["sprintId", sprintId],
        ])
      ),
    },
    {
      name: "Sprints",
      icon: GiSprint,
      href: pathWithParams(
        "/app/sprints",
        new Map([
          ["projectId", projectId],
          ["sprintId", sprintId],
        ])
      ),
    },
    {
      name: "Backlog",
      icon: GiBackpack,
      href: pathWithParams(
        "/app/backlog",
        new Map([
          ["projectId", projectId],
          ["sprintId", sprintId],
        ])
      ),
    },
    {
      name: "Testing (dev only)",
      icon: ImLab,
      href: pathWithParams(
        "/app/testing",
        new Map([
          ["projectId", projectId],
          ["sprintId", sprintId],
        ])
      ),
    },
  ]

  if (projects.isLoading) return null

  return (
    <div className="flex min-h-0 w-56 flex-col bg-gray-800">
      <div className="flex w-56 flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <img
            className="h-8 w-auto "
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
            alt="Workflow"
          />
        </div>
        <nav className="mt-5 flex-1 space-y-1 bg-gray-800 px-2" aria-label="Sidebar">
          {navigation.map((item) => (
            <div
              key={item.name}
              className={classNames(
                router.asPath.includes(item.href)
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "group flex min-w-fit items-center rounded-md px-2 py-2 text-sm font-medium"
              )}
            >
              <item.icon
                className={classNames(
                  router.asPath.includes(item.href) ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
                  "mr-3 h-7 w-7 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              <Link href={item.href}>
                <a className="w-full">{item.name}</a>
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex flex-shrink-0 bg-gray-700 p-4">
        <div className="group block w-full flex-shrink-0">
          <div className="flex flex-shrink-0 items-center justify-center px-4">
            <Select
              entries={projects.data!}
              getId={(t) => t.id}
              getText={(t) => t.name}
              selectedState={[
                selectedProject,
                (p) => {
                  switchProject(p.id, router)
                },
              ]}
              upwards={true}
            />
          </div>
          <div className="p-2" />
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={session?.user?.image as string}
                alt="profile_pic"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <Link href={`/app/${projectId}/profile`}>
                <p className="cursor-pointer text-xs font-medium text-gray-300 group-hover:text-gray-200">
                  View profile
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type project = {
  id: string
  name: string
}
