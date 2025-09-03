/*
  Warnings:

  - You are about to drop the `cartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."cartItem";

-- CreateTable
CREATE TABLE "public"."cartitem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cartitem_pkey" PRIMARY KEY ("id")
);
