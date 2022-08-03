import { StoryState, StoryType } from "@prisma/client"

// NOTE(SP): keep this in sync with the enums from db
export const StoryTypes: Map<string, string> = new Map([
  [StoryType.BUG_FIXING, "Bug Fixing"],
  [StoryType.DEVELOPMENT, "Development"],
  [StoryType.DOCUMENTATION, "Documentation"],
  [StoryType.MAINTENANCE, "Maintenance"],
  [StoryType.SUPPORT, "Support"],
])

export const StoryTypesArray: { id: string; text: string }[] = [
  { id: StoryType.BUG_FIXING, text: "Bug Fixing" },
  { id: StoryType.DEVELOPMENT, text: "Development" },
  { id: StoryType.DOCUMENTATION, text: "Documentation" },
  { id: StoryType.MAINTENANCE, text: "Maintenance" },
  { id: StoryType.SUPPORT, text: "Support" },
]

export const StoryStates: Map<string, string> = new Map([
  [StoryState.NEW, "NEW"],
  [StoryState.READY, "READY"],
  [StoryState.IN_PROGRESS, "IN PROGRESS"],
  [StoryState.IN_REVIEW, "IN REVIEW"],
  [StoryState.DELIVERED, "DELIVERED"],
  [StoryState.DELETED, "DELETED"],
])

export const StoryStatesArray: { id: string; text: string }[] = [
  { id: StoryState.NEW, text: "NEW" },
  { id: StoryState.READY, text: "READY" },
  { id: StoryState.IN_PROGRESS, text: "IN PROGRESS" },
  { id: StoryState.IN_REVIEW, text: "IN REVIEW" },
  { id: StoryState.DELIVERED, text: "DELIVERED" },
  { id: StoryState.DELETED, text: "DELETED" },
]

export const NoUser = {
  id: "no_user",
  name: "Unassigned",
  image: "https://static.thenounproject.com/png/55168-200.png",
}

export const NoSprint = {
  id: "no_sprint",
  title: "No sprint",
}
