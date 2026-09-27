import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HorarioRepository } from '../dominio/horario.repository';
import { Horario } from '../dominio/entidades';

@Injectable()
export class HorarioPrismaRepository implements HorarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: Partial<Horario>): Promise<Horario> {
    return this.prisma.horario.create({ data: datos as any });
  }

  async buscarTodos(): Promise<Horario[]> {
    return this.prisma.horario.findMany();
  }

  async buscarPorId(id: number): Promise<Horario | null> {
    return this.prisma.horario.findUnique({ where: { id } });
  }

  async actualizar(id: number, datos: Partial<Horario>): Promise<Horario | null> {
    return this.prisma.horario.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<boolean> {
    await this.prisma.horario.delete({ where: { id } });
    return true;
  }
}