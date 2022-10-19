-- CreateEnum
CREATE TYPE "SprintActionLogType" AS ENUM ('STORY', 'WORKLOG', 'SPRINT');

-- CreateTable
CREATE TABLE "SprintActionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "storyAssigneeId" TEXT,
    "storyState" "StoryState",
    "type" "SprintActionLogType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SprintActionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
