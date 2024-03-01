/*
  Warnings:

  - Added the required column `registerDate` to the `Entity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Entity` ADD COLUMN `accountingCategory` VARCHAR(191) NULL,
    ADD COLUMN `antt` VARCHAR(191) NULL,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `classification` VARCHAR(191) NULL,
    ADD COLUMN `client` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `cnae` VARCHAR(191) NULL,
    ADD COLUMN `commission` DOUBLE NULL,
    ADD COLUMN `creditLimit` DOUBLE NULL,
    ADD COLUMN `employee` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `finalConsumer` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `icmsContributor` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `icmsExemption` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `judiciaryEntityId` INTEGER NULL,
    ADD COLUMN `municipalInscription` VARCHAR(191) NULL,
    ADD COLUMN `nfeb2b` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `physicalEntitynId` INTEGER NULL,
    ADD COLUMN `range` VARCHAR(191) NULL,
    ADD COLUMN `registerDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `route` VARCHAR(191) NULL,
    ADD COLUMN `salesman` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `simpleFederalOptant` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `suframaInscription` VARCHAR(191) NULL,
    ADD COLUMN `supplier` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `transportCompany` BOOLEAN NULL DEFAULT false;

-- CreateTable
CREATE TABLE `PhysicalEntity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birthCity` VARCHAR(191) NOT NULL,
    `birthDate` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NOT NULL,

    UNIQUE INDEX `PhysicalEntity_entityId_key`(`entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JudiciaryEntity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `socialReason` VARCHAR(191) NOT NULL,
    `fantasyName` VARCHAR(191) NOT NULL,
    `headquarters` VARCHAR(191) NOT NULL,
    `foundingDate` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NOT NULL,

    UNIQUE INDEX `JudiciaryEntity_entityId_key`(`entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PhysicalEntity` ADD CONSTRAINT `PhysicalEntity_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JudiciaryEntity` ADD CONSTRAINT `JudiciaryEntity_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
