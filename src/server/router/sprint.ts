import { Sprint, SprintStateBreakdown, SprintStateBreakdownOutput } from "../schemas/schemas"
import { addBusinessDays, differenceInBusinessDays, isAfter, isBefore, isSameDay } from "date-fns"
import { inferMutationOutput, inferQueryOutput } from "../../pages/_app"

import { TRPCError } from "@trpc/server"
import { createRouter } from "../context"
import { prisma } from "../db/client"
import { z } from "zod"

export const sprintRouter = createRouter()
  // CREATE
  .mutation("create", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const sprint = await prisma.sprint.create({
        data: {
          title: input.title,
          startAt: input.startAt,
          endAt: input.endAt,

          projectId: input.projectId,
          creatorId: input.creatorId,
        },
      })

      return {
        id: sprint.id,
      }
    },
  })

  // READ
  .query("getAll", {
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })
  .query("getByProjectId", {
    input: z.object({
      projectId: z.string(),
    }),
    output: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    ),
    async resolve({ ctx, input }) {
      const sprints = prisma.sprint.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          projectId: input.projectId,
        },
      })

      return sprints
    },
  })
  .query("getStateBreakdown", {
    input: z.object({
      sprintId: z.string(),
    }),
    output: z.array(SprintStateBreakdown),
    async resolve({ ctx, input }) {
      const sprint = await prisma.sprint.findUnique({
        where: {
          id: input.sprintId,
        },
      })

      if (!sprint) throw new TRPCError({ code: "NOT_FOUND" })

      const sprintStateBreakdown = await prisma.sprintStateBreakdown.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          sprintId: input.sprintId,
        },
      })

      const today = new Date("2022-10-04")
      const sprintDays = differenceInBusinessDays(sprint.endAt, sprint.startAt) + 1

      // 1. iterate sprintStateBreakdowns

      let curr = { i: 0, date: sprint.startAt }
      let out = new Array<SprintStateBreakdownOutput>(sprintDays)
      for (const s of sprintStateBreakdown) {
        if (isAfter(s.createdAt, curr.date)) {
          curr.i = Math.min(curr.i + 1, out.length - 1)
          curr.date = addBusinessDays(curr.date, 1)
        }

        out[curr.i] = {
          idx: curr.i,
          inProgress: s.inProgress,
          new: s.new,
          ready: s.ready,
          delivered: s.delivered,
          inReview: s.inReview,
          done: s.done,
          blocked: s.blocked,
          deleted: s.deleted,
        }
      }

      console.log("1 out:", out)

      const lastAdded = out[curr.i]

      // 2. iterate until today, cloning last breakdown

      for (let i = curr.i + 2; i < out.length && (isBefore(curr.date, today) || isSameDay(curr.date, today)); i++) {
        out[i] = lastAdded
        out[i].idx = 88 + i
        curr.i++
        curr.date = addBusinessDays(curr.date, 1)
      }

      // 3. iterate intil endAt, setting null

      for (let i = curr.i; i < out.length; i++) {
        out[i] = {
          idx: i,
          inProgress: null,
          new: null,
          ready: null,
          delivered: null,
          inReview: null,
          done: null,
          blocked: null,
          deleted: null,
        }
      }

      console.log("out:", out)

      return out
    },
  })

  // UPDATE
  .mutation("update", {
    input: Sprint,
    output: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

  // DELETE
  .mutation("deleteById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      // TODO:
      throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
    },
  })

export type SprintCreateOutput = inferMutationOutput<"sprint.create">
export type SprintGetAllOutput = inferQueryOutput<"sprint.getAll">
export type SprintGetByIdOutput = inferQueryOutput<"sprint.getById">
export type SprintGetByProjectIdOutput = inferQueryOutput<"sprint.getByProjectId">
export type SprintUpdateOutput = inferMutationOutput<"sprint.update">
export type SprintDeleteByIdOutput = inferMutationOutput<"sprint.deleteById">
