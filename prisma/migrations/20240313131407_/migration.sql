/*
  Warnings:

  - You are about to drop the column `SKU` on the `Product` table. All the data in the column will be lost.
  - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `SKU`,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL;
