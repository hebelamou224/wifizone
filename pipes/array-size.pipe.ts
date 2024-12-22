import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraySize',
  standalone: true
})
export class ArraySizePipe implements PipeTransform {

  transform(value: any[]): number {
    if (Array.isArray(value)) {
      return value.length; 
    }
    return 0;
  }
}
