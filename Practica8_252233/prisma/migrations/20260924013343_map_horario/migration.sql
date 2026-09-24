-- CreateTable
CREATE TABLE `horario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia_semana` VARCHAR(191) NOT NULL,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `hora_fin` VARCHAR(191) NOT NULL,
    `capacidad` INTEGER NOT NULL,
    `clase_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `horario` ADD CONSTRAINT `horario_clase_id_fkey` FOREIGN KEY (`clase_id`) REFERENCES `clase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
