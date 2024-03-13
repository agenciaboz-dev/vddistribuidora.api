/*
  Warnings:

  - You are about to drop the column `unidades` on the `ProductStock` table. All the data in the column will be lost.
  - Added the required column `units` to the `ProductStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `brand` VARCHAR(191) NULL,
    MODIFY `category` VARCHAR(191) NULL,
    MODIFY `grossWeight` VARCHAR(191) NULL,
    MODIFY `liqWeight` VARCHAR(191) NULL,
    MODIFY `mass` VARCHAR(191) NULL,
    MODIFY `subcategory` VARCHAR(191) NULL,
    MODIFY `unitMeasure` VARCHAR(191) NULL,
    MODIFY `validity` VARCHAR(191) NULL,
    MODIFY `volume` VARCHAR(191) NULL,
    MODIFY `sku` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductStock` DROP COLUMN `unidades`,
    ADD COLUMN `units` VARCHAR(191) NOT NULL;
