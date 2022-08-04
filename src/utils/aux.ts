import { NextRouter } from "next/router"

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function switchProject(projectId: string, router: NextRouter) {
  const split = router.asPath.split("/")
  router.push(`/app/${projectId}/${split[split.length - 1]}`)
}

export function extractBasePathWithProjectId(router: NextRouter): string {
  const split = router.pathname.split("/")
  return `/${split[1]}/${split[2]}`
}

// TODO: move this to a module.css file
export const ButtonDefaultCSS =
  "inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

export const ButtonDisabledCSS =
  "inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-gray-400 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"

// Returns the type of the elements of an array
export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never
