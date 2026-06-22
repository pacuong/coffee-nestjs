-- CreateTable
CREATE TABLE `CartItemTopping` (
    `id` VARCHAR(191) NOT NULL,
    `cartItemId` VARCHAR(191) NOT NULL,
    `toppingId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartItemTopping` ADD CONSTRAINT `CartItemTopping_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemTopping` ADD CONSTRAINT `CartItemTopping_toppingId_fkey` FOREIGN KEY (`toppingId`) REFERENCES `Topping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
