/*
  Warnings:

  - You are about to drop the column `title` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "title";
