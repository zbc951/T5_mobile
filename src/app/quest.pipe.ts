import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quest',
})
export class QuestPipe implements PipeTransform {
  constructor() {}

  transform(list: any, method): any {
    // console.log('list', list, method);

    if (list && method === 'all') {
      return list;
    }

    if (list && method) {
      return list.filter((item) => {
        return item.type === method;
      });
    }

    return list;
  }
}
