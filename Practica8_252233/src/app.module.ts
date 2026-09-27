import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClasesModule } from './clases/clases.module';
import { HorariosModule } from './horarios/horarios.module';
import { MiembrosModule } from './miembros/miembros.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

@Module({
  imports: [
    PrismaModule,
    ClasesModule,
    HorariosModule,
    MiembrosModule,
    InscripcionesModule,
  ],
})
export class AppModule {}