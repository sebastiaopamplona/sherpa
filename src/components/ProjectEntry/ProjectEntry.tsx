import { ArrElement, classNames } from "../../utils/aux"
import { GiNotebook, GiPerson, GiSprint } from "react-icons/gi"

import { ProjectGetByUserIdOutput } from "../../server/router/project"
import { useRouter } from "next/router"

interface Props {
  project: ArrElement<ProjectGetByUserIdOutput>
}

export default function ProjectEntry({ project }: Props) {
  const router = useRouter()
  const { projectId } = router.query

  return (
    <div className="px-4 pt-4 pb-3 hover:cursor-pointer hover:bg-slate-100 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-md truncate font-semibold text-gray-600 hover:cursor-pointer hover:text-gray-500">
          {project.name}
        </p>
        <div className={classNames(project.id === (projectId as string) ? "flex flex-shrink-0" : "hidden")}>
          <p className="inline-flex rounded-sm bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
            Current
          </p>
        </div>
      </div>
      <div className="py-1" />
      <div className="flex justify-between text-xs">
        <div className="flex">
          <p className="flex items-center text-gray-500">
            <GiSprint className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {project._count.sprints}
          </p>
          <div className="pr-3" />
          <p className="flex items-center text-gray-500">
            <GiNotebook className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {project._count.stories}
          </p>
          <div className="pr-3" />
          <p className="flex items-center text-gray-500">
            <GiPerson className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            {project._count.users}
          </p>
        </div>
      </div>
    </div>
  )
}
