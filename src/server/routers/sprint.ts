import { Sprint, SprintStateBreakdown, SprintStateBreakdownOutput } from "../schemas/schemas"
import {
  addBusinessDays,
  differenceInBusinessDays,
  format,
  isAfter,
  isSameDay,
  setHours,
  setMinutes,
  setSeconds,
  subDays,
} from "date-fns"

import { StoryState as StoryStateEnum } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { prisma } from "../db/client"
import { z } from "zod"
import { NoSprint, StoryStatesSorterDoneToBlocked } from "../data/data"
import { protectedProcedure, router } from "../trpc"

export const sprintRouter = t.router({})

const dateAsKey: (d: Date) => string = (d) => {
  return format(d, "dd/MM")
}

const datePretty: (d: Date) => string = (d) => {
  return `${format(d, "eeeeee")}, ${format(d, "d/M")}`
}

export const updateSprintStateBreakdown: (sprintId: string) => void = async (sprintId) => {
  type StoryStateCount = Array<{ state: string; count: bigint }>
  const count = await prisma.$queryRaw`
          SELECT
            "public"."Story"."state", COUNT("public"."Story"."id")
          FROM
            "public"."Story"
          WHERE
            "public"."Story"."sprintId" = ${sprintId}
          GROUP BY "public"."Story"."state"`

  let sbd: SprintStateBreakdownOutput = {
    sprintId: sprintId,
    createdAt: new Date(),
  }

  for (const c of count as StoryStateCount) {
    switch (c.state) {
      case StoryStateEnum.IN_PROGRESS:
        sbd.inProgress = Number(c.count)
        break
      case StoryStateEnum.NEW:
        sbd.new = Number(c.count)
        break
      case StoryStateEnum.READY:
        sbd.ready = Number(c.count)
        break
      case StoryStateEnum.DELIVERED:
        sbd.delivered = Number(c.count)
        break
      case StoryStateEnum.IN_REVIEW:
        sbd.inReview = Number(c.count)
        break
      case StoryStateEnum.DONE:
        sbd.done = Number(c.count)
        break
      case StoryStateEnum.BLOCKED:
        sbd.blocked = Number(c.count)
        break
    }
  }

  const sbdStored = await prisma.sprintStateBreakdown.create({ data: { ...sbd } })
  await prisma.sprintStateBreakdown.deleteMany({
    where: {
      id: {
        not: sbdStored.id,
      },
      createdAt: {
        gte: setHours(setMinutes(setSeconds(new Date(), 0), 0), 0),
      },
    },
  })
}

export type UserBreakdownStory = {
  id: string
  title: string
  estimate: number
  investedEffort: number
  remainingEffort: number
  totalEffort: number
  type: string
  state: string
}
