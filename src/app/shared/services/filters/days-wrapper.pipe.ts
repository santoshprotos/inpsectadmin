import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysWrapper'
})
export class DaysWrapperPipe implements PipeTransform {
  transform(value: string, charValue: number): string {
    if (!value) return value;
    console.log(value)
    value = value.toString()
    console.log(value)
    if (value.length > charValue) {
      value = value.substring(0, charValue) + '...'
    }
    return value;
  }

}
