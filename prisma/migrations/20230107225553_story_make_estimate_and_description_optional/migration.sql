-- AlterTable
ALTER TABLE "Story" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "estimate" DROP NOT NULL,
ALTER COLUMN "estimate" SET DEFAULT 0;