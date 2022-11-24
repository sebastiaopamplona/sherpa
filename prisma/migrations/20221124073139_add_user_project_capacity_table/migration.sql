/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId,date]` on the table `UserProjectCapacity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "StoryType" ADD VALUE 'MISC';

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "UserProjectCapacity" DROP CONSTRAINT "UserProjectCapacity_projectId_fkey";

-- AlterTable
ALTER TABLE "UserProjectCapacity" ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserId_ProjectId_Date_unique_constraint" ON "UserProjectCapacity"("userId", "projectId", "date");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectCapacity" ADD CONSTRAINT "UserProjectCapacity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
