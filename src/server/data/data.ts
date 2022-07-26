import { StoryState, StoryType } from "@prisma/client"

// NOTE(SP): keep this in sync with the enums from db
export const StoryTypes: Map<string, string> = new Map([
  [StoryType.BUG_FIXING, "Bug Fixing"],
  [StoryType.DEVELOPMENT, "Development"],
  [StoryType.DOCUMENTATION, "Documenttion"],
  [StoryType.MAINTENANCE, "Maintenance"],
  [StoryType.SUPPORT, "Support"],
])

export const StoryStates: Map<string, string> = new Map([
  [StoryState.NEW, "NEW"],
  [StoryState.READY, "READY"],
  [StoryState.IN_PROGRESS, "IN PROGRESS"],
  [StoryState.IN_REVIEW, "IN REVIEW"],
  [StoryState.DELIVERED, "DELIVERED"],
  [StoryState.DELETED, "DELETED"],
])
