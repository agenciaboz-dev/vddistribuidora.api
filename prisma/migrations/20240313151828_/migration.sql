/*
  Warnings:

  - You are about to drop the column `neighborhood` on the `StockLocation` table. All the data in the column will be lost.
  - Added the required column `district` to the `StockLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StockLocation` DROP COLUMN `neighborhood`,
    ADD COLUMN `district` VARCHAR(191) NOT NULL;
