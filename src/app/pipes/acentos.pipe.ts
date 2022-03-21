import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acentos'
})
export class AcentosPipe implements PipeTransform {

  transform(value: string): string {
    // Find if the word says 'cion' at the end of a word of a string, if so, replace with 'ción'
    value = value.replace(/cion/gi, 'ción');
    value = value.replace(/acutal/gi, 'Actual');
    value = value.replace(/practica/gi, 'Práctica');
    value = value.replace(/academica/gi, 'Académica');
    value = value.replace(/economico/gi, 'Económico');
    value = value.replace(/uacj/gi, 'UACJ');
    return value;
  }

}
