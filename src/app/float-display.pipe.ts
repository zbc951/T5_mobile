import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floatDisplay'
})
export class FloatDisplayPipe implements PipeTransform {

  isSetting = true;

  transform(value: number): unknown {

    // console.log(value, typeof value);

    if (value && this.isFloat(value)) {

      if (this.isSetting) {

        // 顯示到小數點第二位, 無條件捨去
        const tmp = value.toString().split('.');
        return tmp[0] + '.' + tmp[1].slice(0, 2);

      } else {

        // no modify
        return value;

      }

    } else {

      return value;

    }
  }

  isFloat(value): boolean {
    return !isNaN(value) && value.toString().indexOf('.') !== -1;
  }

}
