/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `contentType` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('Link', 'Image', 'Video', 'Document');

-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "contentType",
ADD COLUMN     "contentType" "ContentType" NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "contentType";

-- CreateIndex
CREATE INDEX "Content_userId_contentType_idx" ON "Content"("userId", "contentType");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_name_key" ON "Tag"("userId", "name");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
