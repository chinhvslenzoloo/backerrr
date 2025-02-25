/*
  Warnings:

  - You are about to drop the column `imageBase64` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `imageBase64`,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL;
