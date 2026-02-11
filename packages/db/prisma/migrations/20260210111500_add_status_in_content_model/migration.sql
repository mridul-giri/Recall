-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('resolved', 'rejected');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'rejected';
