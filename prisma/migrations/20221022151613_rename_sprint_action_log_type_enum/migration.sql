/*
  Warnings:

  - Added the required column `type` to the `SprintActionLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `description` on the `SprintActionLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SprintActionLogType" AS ENUM ('STORY_CREATED', 'STORY_ASSIGNEE_CHANGED', 'STORY_STATE_CHANGED', 'STORY_DELETED');

-- AlterTable
ALTER TABLE "SprintActionLog" ADD COLUMN     "type" "SprintActionLogType" NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SprintActionLogDescription";
