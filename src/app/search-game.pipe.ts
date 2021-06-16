import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchGame'
})
export class SearchGamePipe implements PipeTransform {

  transform(list: any[], gName: string): any {
    // console.log('searchGame', list, gName);

    if (gName) {
      return list
        .filter(g => !g.maintain && g.name.indexOf(gName) !== -1);
    }

    return list;
  }

}
