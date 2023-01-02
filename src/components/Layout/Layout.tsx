import {
  ArrElement,
  classNames,
  pathWithProjSprintUser,
  switchProject,
  switchSprint,
  switchUser,
} from "../../utils/aux"
import { Fragment, useState } from "react"
import { GiEmptyHourglass, GiFullFolder, GiNotebook, GiSpottedBug, GiSprint } from "react-icons/gi"
import { Menu, Transition } from "@headlessui/react"

import Image from "next/image"
import Link from "next/link"
import { ProjectGetByUserIdOutput } from "../../server/trpc/router/project"
import Select from "../Select/Select"
import { SprintGetByProjectIdOutput } from "../../server/trpc/router/sprint"
import { UserGetByProjectIdOutput } from "../../server/trpc/router/user"
import { env } from "../../env/client.mjs"
import { trpc } from "../../utils/trpc"
// import { ProjectGetByUserIdOutput } from "../../server/router/project"
import { useRouter } from "next/router"
// import { SprintGetByProjectIdOutput } from "../../server/router/sprint"
// import { UserGetByProjectIdOutput } from "../../server/router/user"
import { useSession } from "next-auth/react"

interface Props {
  children: React.ReactNode
}

const userNavigation = [
  { name: "Your Profile", href: "/app/profile" },
  { name: "Sign out", href: "/api/auth/signout" },
]

const navigation = [
  {
    name: "Time Keeper",
    icon: GiEmptyHourglass,
    href: "/app/timekeeper",
  },
  {
    name: "Sprints",
    icon: GiSprint,
    href: "/app/sprints",
  },
  {
    name: "Backlog",
    icon: GiNotebook,
    href: "/app/backlog",
  },
  {
    name: "Projects",
    icon: GiFullFolder,
    href: "/app/projects",
  },
]

export default function Layout({ children }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { projectId, sprintId, userId } = router.query

  const [selectedProject, setSelectedProject] = useState<ArrElement<ProjectGetByUserIdOutput>>()
  const [selectedSprint, setSelectedSprint] = useState<ArrElement<SprintGetByProjectIdOutput>>()
  const [selectedUser, setSelectedUser] = useState<ArrElement<UserGetByProjectIdOutput>>()

  const projects = trpc.project.getByUserId.useQuery(
    { userId: userId as string },
    {
      onSuccess: (data) => {
        data.forEach((p) => {
          if (p.id === projectId) {
            setSelectedProject(p)
            return
          }
        })
      },
    }
  )

  const sprints = trpc.sprint.getByProjectId.useQuery(
    { projectId: projectId as string },
    {
      onSuccess: (data) => {
        data.forEach((s) => {
          if (s.id === sprintId) {
            setSelectedSprint(s)
            return
          }
        })
      },
    }
  )

  const users = trpc.user.getByProjectId.useQuery(
    { projectId: projectId as string },
    {
      onSuccess: (data) => {
        data.forEach((u) => {
          if (u.id === userId) {
            setSelectedUser(u)
            return
          }
        })
      },
    }
  )

  // FIXME(SP): this might lead to super awkward blinking of the layout
  if (projects.isLoading || sprints.isLoading || users.isLoading) return null

  return (
    <div className="min-w-[1792px]">
      <div className="hidden bg-gray-800 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Image src="/logo-icon-left.svg" alt="me" width="215" height="50" />
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
                    "group flex min-w-fit items-center rounded-md text-sm font-medium"
                  )}
                >
                  <Link
                    className="flex w-full px-2 py-2"
                    href={pathWithProjSprintUser(item.href, projectId, sprintId, userId)}
                  >
                    <item.icon
                      className={classNames(
                        router.asPath.includes(item.href) ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
                        "mr-3 h-7 w-7 flex-shrink-0 "
                      )}
                      aria-hidden="true"
                    />
                    <span className="pt-1">{item.name}</span>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 bg-gray-700 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center justify-center">
                <p
                  className="text-md cursor-pointer font-medium text-gray-300 group-hover:text-gray-200"
                  onClick={() => {
                    window.open(
                      `https://github.com/sebastiaopamplona/sherpa/releases/tag/${env.NEXT_PUBLIC_APP_VERSION}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }}
                >
                  Version: {env.NEXT_PUBLIC_APP_VERSION ? env.NEXT_PUBLIC_APP_VERSION : "not sure"}
                </p>
              </div>
              <div className="py-2" />
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="s-btn-base s-btn-purple animate-bounce"
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
            {selectedUser ? (
              <>
                <div className="flex flex-shrink-0 items-center justify-center text-gray-200">User:</div>
                <div className="flex flex-shrink-0 items-center justify-center px-4">
                  <Select
                    entries={users.data!}
                    getId={(t) => t.id}
                    getText={(t) => t.name}
                    getImage={(t) => t.image}
                    selectedState={[
                      selectedUser,
                      (u) => {
                        switchUser(u.id, router)
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
                          <Link href={pathWithProjSprintUser(item.href, projectId, sprintId, userId)}>
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
