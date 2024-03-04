/*
  Warnings:

  - Added the required column `cnpj` to the `JudiciaryEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registerDate` to the `JudiciaryEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registerDate` to the `PhysicalEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `JudiciaryEntity` ADD COLUMN `cnpj` VARCHAR(191) NOT NULL,
    ADD COLUMN `registerDate` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PhysicalEntity` ADD COLUMN `registerDate` VARCHAR(191) NOT NULL;
