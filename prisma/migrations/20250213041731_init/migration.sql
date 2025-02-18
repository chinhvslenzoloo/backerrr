/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `imageUrl`,
    ADD COLUMN `imageBase64` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `Name`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
