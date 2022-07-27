import { NextRouter } from "next/router"

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function switchProject(projectId: string, router: NextRouter) {
  const split = router.pathname.split("/")
  router.push(`/app/${projectId}/timekeeper`)
}

export function extractBasePathWithProjectId(router: NextRouter): string {
  const split = router.pathname.split("/")
  return `/${split[1]}/${split[2]}`
}
