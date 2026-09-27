import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TipoMembresia {
  BASICA = 'BASICA',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP',
}

export class CrearMiembroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(TipoMembresia)
  membresia: TipoMembresia;
}