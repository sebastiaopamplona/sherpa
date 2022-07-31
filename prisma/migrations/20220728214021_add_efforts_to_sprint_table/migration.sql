/*
  Warnings:

  - You are about to drop the column `duration` on the `Worklog` table. All the data in the column will be lost.
  - Added the required column `effort` to the `Worklog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingEffort` to the `Worklog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sprint" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Worklog" DROP COLUMN "duration",
ADD COLUMN     "effort" INTEGER NOT NULL,
ADD COLUMN     "remainingEffort" INTEGER NOT NULL;
