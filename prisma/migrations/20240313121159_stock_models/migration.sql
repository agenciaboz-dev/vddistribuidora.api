-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidades` VARCHAR(191) NOT NULL,
    `weightCcm3` VARCHAR(191) NOT NULL,
    `massGrams` VARCHAR(191) NOT NULL,
    `volumeCm3` VARCHAR(191) NOT NULL,
    `productionToleranceType` VARCHAR(191) NOT NULL,
    `percentageProductTolerance` VARCHAR(191) NOT NULL,
    `stockConfig` VARCHAR(191) NOT NULL,
    `minQuantity` VARCHAR(191) NOT NULL,
    `baseCostValue` VARCHAR(191) NOT NULL,
    `estimatedCost` VARCHAR(191) NOT NULL,
    `suggestedCost` VARCHAR(191) NOT NULL,
    `productId` INTEGER NOT NULL,
    `stockLocationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `neighborhood` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductStock` ADD CONSTRAINT `ProductStock_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductStock` ADD CONSTRAINT `ProductStock_stockLocationId_fkey` FOREIGN KEY (`stockLocationId`) REFERENCES `StockLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
