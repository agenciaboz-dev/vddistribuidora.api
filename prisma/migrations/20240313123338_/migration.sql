/*
  Warnings:

  - Added the required column `SKU` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawingModel` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `features` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grossWeight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liqWeight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mass` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategory` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitMeasure` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `SKU` VARCHAR(191) NOT NULL,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `drawingModel` VARCHAR(191) NOT NULL,
    ADD COLUMN `features` VARCHAR(191) NOT NULL,
    ADD COLUMN `grossWeight` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `liqWeight` VARCHAR(191) NOT NULL,
    ADD COLUMN `mass` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `subcategory` VARCHAR(191) NOT NULL,
    ADD COLUMN `unit` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitMeasure` VARCHAR(191) NOT NULL,
    ADD COLUMN `validity` VARCHAR(191) NOT NULL,
    ADD COLUMN `volume` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ProductReceipt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `receiptDescription` VARCHAR(191) NOT NULL,
    `cfop` VARCHAR(191) NOT NULL,
    `ncm` VARCHAR(191) NOT NULL,
    `commercialUnit` VARCHAR(191) NOT NULL,
    `tributaryUnit` VARCHAR(191) NOT NULL,
    `commercialQuantity` VARCHAR(191) NOT NULL,
    `tributaryQuantity` VARCHAR(191) NOT NULL,
    `commercialUnitValue` VARCHAR(191) NOT NULL,
    `tributaryUnitValue` VARCHAR(191) NOT NULL,
    `grossValue` VARCHAR(191) NOT NULL,
    `icmsOrigin` VARCHAR(191) NOT NULL,
    `additionalInfo` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductReceipt` ADD CONSTRAINT `ProductReceipt_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
