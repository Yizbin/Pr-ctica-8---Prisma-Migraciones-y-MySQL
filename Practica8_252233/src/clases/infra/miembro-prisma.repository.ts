import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MiembroRepository } from '../dominio/miembro.repository';
import { Miembro } from '../dominio/entidades';

@Injectable()
export class MiembroPrismaRepository implements MiembroRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: Partial<Miembro>): Promise<Miembro> {
    return this.prisma.miembro.create({ data: datos as any });
  }

  async buscarTodos(): Promise<Miembro[]> {
    return this.prisma.miembro.findMany();
  }

  async buscarPorId(id: number): Promise<Miembro | null> {
    return this.prisma.miembro.findUnique({ where: { id } });
  }

  async actualizar(id: number, datos: Partial<Miembro>): Promise<Miembro | null> {
    return this.prisma.miembro.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<boolean> {
    await this.prisma.miembro.delete({ where: { id } });
    return true;
  }
}