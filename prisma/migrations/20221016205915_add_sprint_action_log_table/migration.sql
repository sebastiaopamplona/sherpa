-- CreateEnum
CREATE TYPE "SprintActionLogDescription" AS ENUM ('STORY_CREATED', 'STORY_ASSIGNEE_CHANGED', 'STORY_STATE_CHANGED', 'STORY_DELETED');

-- CreateTable
CREATE TABLE "SprintActionLog" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "description" "SprintActionLogDescription" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SprintActionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintActionLog" ADD CONSTRAINT "SprintActionLog_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
