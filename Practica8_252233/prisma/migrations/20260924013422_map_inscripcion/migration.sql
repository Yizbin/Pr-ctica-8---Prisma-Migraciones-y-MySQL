-- CreateTable
CREATE TABLE `inscripcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('CONFIRMADA', 'CANCELADA') NOT NULL DEFAULT 'CONFIRMADA',
    `horario_id` INTEGER NOT NULL,
    `miembro_id` INTEGER NOT NULL,

    UNIQUE INDEX `inscripcion_horario_id_miembro_id_key`(`horario_id`, `miembro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_horario_id_fkey` FOREIGN KEY (`horario_id`) REFERENCES `horario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_miembro_id_fkey` FOREIGN KEY (`miembro_id`) REFERENCES `miembro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
