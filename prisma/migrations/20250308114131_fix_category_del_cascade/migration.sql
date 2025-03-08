-- DropForeignKey
ALTER TABLE "ads" DROP CONSTRAINT "ads_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ads" DROP CONSTRAINT "ads_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "ads" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
