/*
  Warnings:

  - A unique constraint covering the columns `[projectId,userId,date]` on the table `UserProjectCapacity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_Id_User_Id_Capacity_unique_constraint" ON "UserProjectCapacity"("projectId", "userId", "date");
