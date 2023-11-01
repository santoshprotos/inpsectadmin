import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textWrap'
})
export class TextWrapPipe implements PipeTransform {

  transform(value: string, charValue: number): string {
    if(!value) return value;
    if (value.length > charValue) {
      value = value.substring(0, charValue) + '...'
    }
    return value;
  }

}
