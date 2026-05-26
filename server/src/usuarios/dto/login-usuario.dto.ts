import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginUsuarioDto {
    @IsString()
    @IsOptional()
    nombre_usuario: string;

    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    @IsOptional()
    email: string;

    @IsString()
    contraseña: string;
}
