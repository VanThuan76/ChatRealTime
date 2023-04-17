/*
  Warnings:

  - You are about to drop the column `userId` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_userId_fkey`;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Room` DROP COLUMN `userId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE `Participants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,

    UNIQUE INDEX `Participants_userId_key`(`userId`),
    UNIQUE INDEX `Participants_roomId_key`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Message_userId_key` ON `Message`(`userId`);

-- AddForeignKey
ALTER TABLE `Participants` ADD CONSTRAINT `Participants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participants` ADD CONSTRAINT `Participants_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
