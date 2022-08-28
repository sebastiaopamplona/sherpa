import { NextRouter } from "next/router"

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function switchProject(projectId: string, router: NextRouter) {
  window.location.href = pathWithParams(router.pathname, new Map([["projectId", projectId]]))
}

export function switchSprint(sprintId: string, router: NextRouter) {
  const { projectId } = router.query

  window.location.href = pathWithParams(
    router.pathname,
    new Map([
      ["projectId", projectId],
      ["sprintId", sprintId],
    ])
  )
}

export function extractBasePathWithProjectId(router: NextRouter): string {
  const split = router.pathname.split("/")
  return `/${split[1]}/${split[2]}`
}

export function pathWithParams(path: string, params: Map<string, string | string[] | undefined>): string {
  let newPath: string = path

  params.forEach((value: string | string[] | undefined, key: string) => {
    // TODO(SP): handle arrays
    if (typeof value === "undefined" || Array.isArray(value) || value.length === 0) return

    let prefix: string = "?"
    if (newPath.includes("?")) prefix = "&"

    newPath += `${prefix}${key}=${value}`
  })

  return newPath
}

// TODO: move this to a module.css file
export const ButtonDefaultCSS =
  "inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

export const ButtonDisabledCSS =
  "inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-gray-400 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"

export const ButtonDefaultRedCSS =
  "inline-flex items-center justify-center px-2.5 py-1.5 border border-transparent text-md font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"

// Returns the type of the elements of an array
export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never

export const FgBlack = "\x1b[30m"
export const FgRed = "\x1b[31m"
export const FgGreen = "\x1b[32m"
export const FgYellow = "\x1b[33m"
export const FgBlue = "\x1b[34m"
export const FgMagenta = "\x1b[35m"
export const FgCyan = "\x1b[36m"
export const FgWhite = "\x1b[37m"
