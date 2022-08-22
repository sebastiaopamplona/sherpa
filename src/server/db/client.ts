import { FgRed, FgWhite, FgYellow } from "../../utils/aux"

// src/server/db/client.ts
import { PrismaClient } from "@prisma/client"
import { PrismaClientOptions } from "@prisma/client/runtime"

export function DefaultPrismaClient(): PrismaClient {
  let prismaClient: PrismaClient<PrismaClientOptions, "info" | "warn" | "error" | "query"> = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  })

  prismaClient.$on("query", (e) => {
    let logColor: string = FgWhite
    if (e.duration > 200 && e.duration < 300) {
      logColor = FgYellow
    } else if (e.duration > 300) {
      logColor = FgRed
    }

    console.log(`${logColor}{"query": "${e.query}", "params": "${e.params}", "duration": "${e.duration}ms"}\x1b[0m`)
  })

  return prismaClient
}

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || DefaultPrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}
