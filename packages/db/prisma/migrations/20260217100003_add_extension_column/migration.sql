/*
  Warnings:

  - Added the required column `extension` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extension` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Content_userId_contentType_idx";

-- DropIndex
DROP INDEX "Content_userId_isDeleted_idx";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "extension" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "extension" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Content_userId_contentType_createdAt_id_idx" ON "Content"("userId", "contentType", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Content_userId_isDeleted_createdAt_id_idx" ON "Content"("userId", "isDeleted", "createdAt" DESC, "id" DESC);
