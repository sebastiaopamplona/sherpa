-- AlterEnum
ALTER TYPE "StoryState" ADD VALUE 'BLOCKED';

-- CreateTable
CREATE TABLE "SprintStateBreakdown" (
    "id" TEXT NOT NULL,
    "inProgress" INTEGER NOT NULL DEFAULT 0,
    "new" INTEGER NOT NULL DEFAULT 0,
    "ready" INTEGER NOT NULL DEFAULT 0,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "inReview" INTEGER NOT NULL DEFAULT 0,
    "done" INTEGER NOT NULL DEFAULT 0,
    "blocked" INTEGER NOT NULL DEFAULT 0,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "sprintId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SprintStateBreakdown_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SprintStateBreakdown" ADD CONSTRAINT "SprintStateBreakdown_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
