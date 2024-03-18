-- DropForeignKey
ALTER TABLE `ProductReceipt` DROP FOREIGN KEY `ProductReceipt_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductStock` DROP FOREIGN KEY `ProductStock_productId_fkey`;

-- AddForeignKey
ALTER TABLE `ProductStock` ADD CONSTRAINT `ProductStock_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductReceipt` ADD CONSTRAINT `ProductReceipt_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
