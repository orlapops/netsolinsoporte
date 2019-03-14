import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Moneda'
})
//utilizado para mostrar un valor de moneda adicionando espacios a la izquierda hasta completar logitud dada
//de forma que se vean alineados al mostrar por ejemplo totales
export class MonedaPipe implements PipeTransform {
    transform(value: string, simbol: string, plongitud:number): any{
        let cadretorna: string = "";
        //si no vienen parametros retorna el valor igual
        if (value && !simbol) 
            return value;
        //si solo viene el simbolo se lo antepone y retorna
        if (simbol && !plongitud) 
            return simbol+value;
        //si viene simbolo y longitud completa con espacios
        let llong : number;
        let cespa = ' ';
        llong = plongitud;
        cadretorna = simbol+value;
        cadretorna = cespa.repeat(llong-cadretorna.length)+cadretorna;
        return cadretorna;
    }
}