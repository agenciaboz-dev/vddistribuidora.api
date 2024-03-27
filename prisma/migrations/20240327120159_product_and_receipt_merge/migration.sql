/*
  Warnings:

  - You are about to drop the `ProductReceipt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductReceipt` DROP FOREIGN KEY `ProductReceipt_productId_fkey`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `additionalInfo` VARCHAR(191) NULL,
    ADD COLUMN `cfop` VARCHAR(191) NULL,
    ADD COLUMN `commercialQuantity` VARCHAR(191) NULL,
    ADD COLUMN `commercialUnit` VARCHAR(191) NULL,
    ADD COLUMN `commercialUnitValue` VARCHAR(191) NULL,
    ADD COLUMN `grossValue` VARCHAR(191) NULL,
    ADD COLUMN `icmsOrigin` VARCHAR(191) NULL,
    ADD COLUMN `ncm` VARCHAR(191) NULL,
    ADD COLUMN `number` VARCHAR(191) NULL,
    ADD COLUMN `productCode` VARCHAR(191) NULL,
    ADD COLUMN `receiptDescription` VARCHAR(191) NULL,
    ADD COLUMN `tributaryQuantity` VARCHAR(191) NULL,
    ADD COLUMN `tributaryUnit` VARCHAR(191) NULL,
    ADD COLUMN `tributaryUnitValue` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ProductReceipt`;
