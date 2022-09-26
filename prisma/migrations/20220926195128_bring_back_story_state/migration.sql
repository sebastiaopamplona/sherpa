/*
  Warnings:

  - The `state` column on the `Story` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StoryState" AS ENUM ('IN_PROGRESS', 'NEW', 'READY', 'DELIVERED', 'IN_REVIEW', 'DONE', 'DELETED');

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "state",
ADD COLUMN     "state" "StoryState" NOT NULL DEFAULT 'NEW';

-- DropEnum
DROP TYPE "StoryState2";
