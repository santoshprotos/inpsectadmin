import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    let newItem=items.slice(1)
     newItem = newItem.sort((x, y) => x.name.localeCompare(y.name));
    
    return newItem.filter(it => {
      
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }

}
