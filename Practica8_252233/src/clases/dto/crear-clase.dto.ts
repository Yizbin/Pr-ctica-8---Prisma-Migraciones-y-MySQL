import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}