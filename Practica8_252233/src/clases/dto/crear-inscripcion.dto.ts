import { IsInt, IsNotEmpty } from 'class-validator';

export class CrearInscripcionDto {
  @IsInt()
  @IsNotEmpty()
  horarioId: number;

  @IsInt()
  @IsNotEmpty()
  miembroId: number;
}