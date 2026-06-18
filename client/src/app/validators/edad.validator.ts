import { AbstractControl } from "@angular/forms";

export function mayorDeEdadValidator(control: AbstractControl) {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaNacimiento.getTime()
    const años = diferencia / (1000 * 60 * 60 * 24 * 365)

    if(años < 18){
        return { menorDeEdad: true }
    } else {
        return null
    }
}