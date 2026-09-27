import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  @IsNotEmpty()
  claseId!: number;

  @IsString()
  @IsNotEmpty()
  dia!: string;

  @IsString()
  @IsNotEmpty()
  hora!: string;

  @IsInt()
  @Min(1)
  cupoMaximo!: number;
}