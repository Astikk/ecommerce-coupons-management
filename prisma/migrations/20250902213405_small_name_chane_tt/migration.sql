/*
  Warnings:

  - You are about to drop the column `productId` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `coupon` table. All the data in the column will be lost.
  - Added the required column `productid` to the `cartitem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productid` to the `coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."coupon" DROP CONSTRAINT "coupon_productId_fkey";

-- AlterTable
ALTER TABLE "public"."cartitem" DROP COLUMN "productId",
ADD COLUMN     "productid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."coupon" DROP COLUMN "productId",
ADD COLUMN     "productid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."coupon" ADD CONSTRAINT "coupon_productid_fkey" FOREIGN KEY ("productid") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
