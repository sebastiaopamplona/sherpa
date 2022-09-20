import {
  ArrElement,
  classNames,
  pathWithParams,
  pathWithProjSprint,
  switchProject,
  switchSprint,
} from "../../utils/aux"
import { Fragment, useState } from "react"
import { GiEmptyHourglass, GiFullFolder, GiNotebook, GiSpottedBug, GiSprint } from "react-icons/gi"
import { Menu, Transition } from "@headlessui/react"

import Link from "next/link"
import { ProjectGetByUserIdOutput } from "../../server/router/project"
import Select from "../Select/Select"
import { SprintGetByProjectIdOutput } from "../../server/router/sprint"
import { trpc } from "../../utils/trpc"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

interface Props {
  children: React.ReactNode
}

const userNavigation = [
  { name: "Your Profile", href: "/app/profile" },
  { name: "Sign out", href: "/api/auth/signout" },
]

export default function Layout({ children }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { projectId, sprintId } = router.query

  const [selectedProject, setSelectedProject] = useState<ArrElement<ProjectGetByUserIdOutput>>()
  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>()

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

  const sprints = trpc.useQuery(["sprint.getByProjectId", { projectId: selectedProject?.id as string }], {
    onSuccess: (data) => {
      data.forEach((s) => {
        if (s.id === sprintId) {
          setSelectedSprint(s)
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
      icon: GiNotebook,
      href: pathWithParams(
        "/app/backlog",
        new Map([
          ["projectId", projectId],
          ["sprintId", sprintId],
        ])
      ),
    },
    {
      name: "Projects",
      icon: GiFullFolder,
      href: pathWithParams(
        "/app/projects",
        new Map([
          ["projectId", projectId],
          ["sprintId", sprintId],
        ])
      ),
    },
  ]

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // FIXME(SP): this might lead to super awkward blinking of the layout
  if (projects.isLoading || sprints.isLoading) return null

  return (
    <div>
      <div className="hidden bg-gray-800 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-8 w-auto "
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              alt="Workflow"
            />
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
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
                    {/* FIXME(SP): anchor inside Link? o.O */}
                    <a className="w-full">{item.name}</a>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 bg-gray-700 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center justify-center">
                <p className="text-md cursor-pointer font-medium text-gray-300 group-hover:text-gray-200">
                  Version: {process.env.SHERPA_VERSION ? process.env.SHERPA_VERSION : "not sure"}
                </p>
              </div>
              <div className="py-2" />
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="inline-flex animate-bounce items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  onClick={() => {
                    window.open(
                      "https://github.com/sebastiaopamplona/sherpa/issues/new",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }}
                >
                  <GiSpottedBug className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Report bug!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 shadow">
          <div className="flex w-full bg-gray-700 px-4">
            {selectedProject ? (
              <>
                <div className="flex flex-shrink-0 items-center justify-center text-gray-200">Project:</div>
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
                  />
                </div>
                <div className="p-2" />
              </>
            ) : (
              <></>
            )}
            {selectedSprint ? (
              <>
                <div className="flex flex-shrink-0 items-center justify-center text-gray-200">Sprint:</div>
                <div className="flex flex-shrink-0 items-center justify-center px-4">
                  <Select
                    entries={sprints.data!}
                    getId={(t) => t.id}
                    getText={(t) => t.title}
                    selectedState={[
                      selectedSprint,
                      (s) => {
                        switchSprint(s.id, router)
                      },
                    ]}
                  />
                </div>
                <div className="p-2" />
              </>
            ) : (
              <></>
            )}
            <div className="absolute right-[14px] top-[12px] items-center md:ml-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <img className="h-10 w-10 rounded-full" src={session?.user?.image as string} alt="" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link href={pathWithProjSprint(item.href, projectId as string, sprintId as string)}>
                            <p
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                              )}
                            >
                              {item.name}
                            </p>
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
