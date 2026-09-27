import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InscripcionRepository } from '../dominio/inscripcion.repository';
import { Inscripcion } from '../dominio/entidades';

@Injectable()
export class InscripcionPrismaRepository implements InscripcionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: { horarioId: number; miembroId: number }): Promise<Inscripcion> {
    return this.prisma.inscripcion.create({
      data: {
        horarioId: datos.horarioId,
        miembroId: datos.miembroId,
      },
    });
  }

  async buscarTodos(): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany();
  }

  async buscarPorId(id: number): Promise<Inscripcion | null> {
    return this.prisma.inscripcion.findUnique({ where: { id } });
  }

  async buscarPorHorario(horarioId: number): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany({ where: { horarioId } });
  }

  async buscarHorario(horarioId: number) {
    return this.prisma.horario.findUnique({ where: { id: horarioId } });
  }

  async buscarMiembro(miembroId: number) {
    return this.prisma.miembro.findUnique({ where: { id: miembroId } });
  }

  async eliminar(id: number): Promise<boolean> {
    await this.prisma.inscripcion.delete({ where: { id } });
    return true;
  }
}