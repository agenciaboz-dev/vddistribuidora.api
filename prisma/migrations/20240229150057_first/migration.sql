-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'SALES', 'MANAGER', 'ACCOUNTANT', 'CLIENT') NOT NULL DEFAULT 'CLIENT',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registerDate` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `classification` VARCHAR(191) NULL,
    `creditLimit` DOUBLE NULL,
    `commission` DOUBLE NULL,
    `antt` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `accountingCategory` VARCHAR(191) NULL,
    `municipalInscription` VARCHAR(191) NULL,
    `range` VARCHAR(191) NULL,
    `suframaInscription` VARCHAR(191) NULL,
    `route` VARCHAR(191) NULL,
    `cnae` VARCHAR(191) NULL,
    `finalConsumer` BOOLEAN NULL DEFAULT false,
    `client` BOOLEAN NULL DEFAULT false,
    `transportCompany` BOOLEAN NULL DEFAULT false,
    `supplier` BOOLEAN NULL DEFAULT false,
    `employee` BOOLEAN NULL DEFAULT false,
    `salesman` BOOLEAN NULL DEFAULT false,
    `icmsExemption` BOOLEAN NULL DEFAULT false,
    `icmsContributor` BOOLEAN NULL DEFAULT false,
    `simpleFederalOptant` BOOLEAN NULL DEFAULT false,
    `nfeb2b` BOOLEAN NULL DEFAULT false,
    `physicalPersonId` INTEGER NULL,
    `judiciaryPersonId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhysicalPerson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `rg` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birthCity` VARCHAR(191) NOT NULL,
    `birthDate` VARCHAR(191) NOT NULL,
    `personId` INTEGER NOT NULL,

    UNIQUE INDEX `PhysicalPerson_personId_key`(`personId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JudiciaryPerson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `socialReason` VARCHAR(191) NOT NULL,
    `fantasyName` VARCHAR(191) NOT NULL,
    `headquarters` VARCHAR(191) NOT NULL,
    `foundingDate` VARCHAR(191) NOT NULL,
    `personId` INTEGER NOT NULL,

    UNIQUE INDEX `JudiciaryPerson_personId_key`(`personId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cep` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `personId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PhysicalPerson` ADD CONSTRAINT `PhysicalPerson_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JudiciaryPerson` ADD CONSTRAINT `JudiciaryPerson_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
