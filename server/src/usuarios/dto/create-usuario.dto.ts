import { IsString, IsEmail, IsDateString, IsOptional, Matches, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUsuarioDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;

    @IsString()
    nombre_usuario: string;

    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    })
    contrasena: string;

    @IsDateString()
    fecha_nacimiento: string;

    @IsString()
    @IsOptional()
    descripcion_breve?: string;

    @IsString()
    @IsOptional() 
    imagen_perfil?: string;
    
    @Transform(({value}) => value === 'true' || value === 'false')
    @IsBoolean()
    @IsOptional()
    es_admin: boolean
    
  // el ! se utiliza al final de la variable para indicar que la variable es obligatoria y no va a llegar como undefined, esto es necesario para que class-validator pueda validar correctamente los campos obligatorios. En caso de llegar vacio, class-validator lanzará un error indicando que el campo es obligatorio.  

}