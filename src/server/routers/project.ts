import { addBusinessDays, differenceInCalendarDays, isSameDay } from "date-fns"
import { protectedProcedure, router } from "../trpc"

import { Project } from "../schemas/schemas"
import { TRPCError } from "@trpc/server"
import { prisma } from "../db/client"
import { z } from "zod"

export const projectRouter = t.router({})
