-- CreateTable
CREATE TABLE "UserProjectCapacity" (
    "id" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProjectCapacity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProjectCapacity" ADD CONSTRAINT "UserProjectCapacity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectCapacity" ADD CONSTRAINT "UserProjectCapacity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
