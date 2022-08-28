/*
  Warnings:

  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "RoleToPermissions" DROP CONSTRAINT "RoleToPermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RoleToPermissions" DROP CONSTRAINT "RoleToPermissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserRolesInProjects" DROP CONSTRAINT "UserRolesInProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserRolesInProjects" DROP CONSTRAINT "UserRolesInProjects_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRolesInProjects" DROP CONSTRAINT "UserRolesInProjects_userId_fkey";

-- DropForeignKey
ALTER TABLE "Worklog" DROP CONSTRAINT "Worklog_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Worklog" DROP CONSTRAINT "Worklog_storyId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RoleToPermissions" ADD CONSTRAINT "RoleToPermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleToPermissions" ADD CONSTRAINT "RoleToPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRolesInProjects" ADD CONSTRAINT "UserRolesInProjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRolesInProjects" ADD CONSTRAINT "UserRolesInProjects_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRolesInProjects" ADD CONSTRAINT "UserRolesInProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worklog" ADD CONSTRAINT "Worklog_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worklog" ADD CONSTRAINT "Worklog_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
