import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClaseRepository } from '../dominio/clase.repository';
import { Clase } from '../dominio/entidades';

@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: Partial<Clase>): Promise<Clase> {
    return this.prisma.clase.create({ data: datos as any });
  }

  async buscarTodos(): Promise<Clase[]> {
    return this.prisma.clase.findMany();
  }

  async buscarPorId(id: number): Promise<Clase | null> {
    return this.prisma.clase.findUnique({ where: { id } });
  }

  async actualizar(id: number, datos: Partial<Clase>): Promise<Clase | null> {
    return this.prisma.clase.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<boolean> {
    await this.prisma.clase.delete({ where: { id } });
    return true;
  }
}
