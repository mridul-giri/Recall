/*
  Warnings:

  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "description";
