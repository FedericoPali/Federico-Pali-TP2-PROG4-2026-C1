import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginUsuarioDto {
    @IsString()
    identificador: string

    @IsString()
    contraseña: string;
}
