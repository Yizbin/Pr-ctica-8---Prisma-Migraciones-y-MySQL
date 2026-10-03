import { IsEmail, IsEnum, IsInt, IsOptional, MinLength } from 'class-validator';
import { Rol } from '../dominio/usuario';

export class RegistroDto {
  @IsEmail({}, { message: 'el correo no tiene un formato valido' })
  correo!: string;

  @MinLength(8, { message: 'la contrasena debe tener al menos 8 caracteres' })
  password!: string;

  @IsOptional()
  @IsEnum(Rol, { message: 'rol debe ser miembro, entrenador o admin' })
  rol?: Rol;

  @IsOptional()
  @IsInt()
  miembroId?: number;
}

export class LoginDto {
  @IsEmail({}, { message: 'el correo no tiene un formato valido' })
  correo!: string;

  @MinLength(1, { message: 'la contrasena es obligatoria' })
  password!: string;
}

export class TokenDto {
  access_token!: string;
  token_type!: string;
  expires_in!: number;
}