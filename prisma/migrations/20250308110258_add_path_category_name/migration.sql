/*
  Warnings:

  - You are about to drop the column `path` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "path",
ADD COLUMN     "idPath" JSONB,
ADD COLUMN     "namePath" JSONB;
