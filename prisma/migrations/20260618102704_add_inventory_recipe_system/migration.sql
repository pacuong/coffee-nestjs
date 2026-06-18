/*
  Warnings:

  - A unique constraint covering the columns `[variantId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Recipe_variantId_key` ON `Recipe`(`variantId`);
