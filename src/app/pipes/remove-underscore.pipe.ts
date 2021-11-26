import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeUnderscore'
})
export class RemoveUnderscorePipe implements PipeTransform {

  transform(value: string): string {
    value = value.replace(/_/g, ' ');
    value = value.replace(/([0-9])/g, ' $1 años');
    return value;
  }

}
