-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "subcategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
