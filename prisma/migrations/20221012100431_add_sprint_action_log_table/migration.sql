/*
  Warnings:

  - A unique constraint covering the columns `[sprintId]` on the table `SprintStateBreakdown` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SprintActionlogType" AS ENUM ('STORY', 'WORKLOG', 'SPRINT');

-- CreateTable
CREATE TABLE "SprintActionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "type" "SprintActionlogType" NOT NULL,

    CONSTRAINT "SprintActionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SprintStateBreakdown_sprintId_key" ON "SprintStateBreakdown"("sprintId");

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
