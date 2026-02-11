/*
  Warnings:

  - You are about to drop the column `status` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the `idempotencyKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "idempotencyKey" DROP CONSTRAINT "idempotencyKey_userId_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "status";

-- DropTable
DROP TABLE "idempotencyKey";

-- DropEnum
DROP TYPE "ContentStatus";

-- DropEnum
DROP TYPE "IdempotencyStatus";
