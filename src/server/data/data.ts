import { StoryState as StoryStateEnum, StoryType as StoryTypeEnum } from "@prisma/client"

import { PencilAltIcon } from "@heroicons/react/outline"

export type StoryType = {
  id: string
  text: string
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element
}

// NOTE(SP): keep this in sync with the enums from db
export const StoryTypes: Map<string, string> = new Map([
  [StoryTypeEnum.BUG_FIXING, "Bug Fixing"],
  [StoryTypeEnum.DEVELOPMENT, "Development"],
  [StoryTypeEnum.DOCUMENTATION, "Documentation"],
  [StoryTypeEnum.MAINTENANCE, "Maintenance"],
  [StoryTypeEnum.SUPPORT, "Support"],
])

export const StoryTypesArray: StoryType[] = [
  { id: StoryTypeEnum.BUG_FIXING, text: "Bug Fixing", icon: PencilAltIcon },
  { id: StoryTypeEnum.DEVELOPMENT, text: "Development", icon: PencilAltIcon },
  { id: StoryTypeEnum.DOCUMENTATION, text: "Documentation", icon: PencilAltIcon },
  { id: StoryTypeEnum.MAINTENANCE, text: "Maintenance", icon: PencilAltIcon },
  { id: StoryTypeEnum.SUPPORT, text: "Support", icon: PencilAltIcon },
]

export type StoryState = {
  id: string
  text: string
}

export const StoryStates: Map<string, string> = new Map([
  [StoryStateEnum.NEW, "NEW"],
  [StoryStateEnum.READY, "READY"],
  [StoryStateEnum.IN_PROGRESS, "IN PROGRESS"],
  [StoryStateEnum.IN_REVIEW, "IN REVIEW"],
  [StoryStateEnum.DELIVERED, "DELIVERED"],
  [StoryStateEnum.DONE, "DONE"],
  [StoryStateEnum.BLOCKED, "BLOCKED"],
  [StoryStateEnum.DELETED, "DELETED"],
])

export const StoryStatesColors: Map<string, string> = new Map([
  [StoryStateEnum.NEW, "#a78bfa"],
  [StoryStateEnum.READY, "#e9d5ff"],
  [StoryStateEnum.IN_PROGRESS, "#fbbf24"],
  [StoryStateEnum.IN_REVIEW, "#2dd4bf"],
  [StoryStateEnum.DELIVERED, "#22d3ee"],
  [StoryStateEnum.DONE, "#4ade80"],
  [StoryStateEnum.BLOCKED, "#fb7185"],
  [StoryStateEnum.DELETED, "#fb7105"],
])

export const StoryStatesArray: StoryState[] = [
  { id: StoryStateEnum.NEW, text: "NEW" },
  { id: StoryStateEnum.READY, text: "READY" },
  { id: StoryStateEnum.IN_PROGRESS, text: "IN PROGRESS" },
  { id: StoryStateEnum.IN_REVIEW, text: "IN REVIEW" },
  { id: StoryStateEnum.DELIVERED, text: "DELIVERED" },
  { id: StoryStateEnum.DONE, text: "DONE" },
  { id: StoryStateEnum.BLOCKED, text: "BLOCKED" },
  { id: StoryStateEnum.DELETED, text: "DELETED" },
]

export const StoryStatesSorterDoneToBlocked: Map<string, number> = new Map([
  [StoryStateEnum.DONE, 0],
  [StoryStateEnum.DELIVERED, 1],
  [StoryStateEnum.IN_REVIEW, 2],
  [StoryStateEnum.IN_PROGRESS, 3],
  [StoryStateEnum.READY, 4],
  [StoryStateEnum.NEW, 5],
  [StoryStateEnum.BLOCKED, 6],
  [StoryStateEnum.DELETED, 7],
])

export const NoUser = {
  id: "no_user",
  name: "Unassigned",
  image: "https://static.thenounproject.com/png/55168-200.png",
}

export const NoSprint = {
  id: "no_sprint",
  title: "No sprint",
}
