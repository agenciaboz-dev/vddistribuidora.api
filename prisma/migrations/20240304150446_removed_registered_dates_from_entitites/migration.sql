/*
  Warnings:

  - You are about to drop the column `registerDate` on the `JudiciaryEntity` table. All the data in the column will be lost.
  - You are about to drop the column `registerDate` on the `PhysicalEntity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `JudiciaryEntity` DROP COLUMN `registerDate`;

-- AlterTable
ALTER TABLE `PhysicalEntity` DROP COLUMN `registerDate`;
