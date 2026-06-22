-- AlterTable
ALTER TABLE `ingredient` ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `imagePublicId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `topping` ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `imagePublicId` VARCHAR(191) NULL;
