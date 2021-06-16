import { Pipe, PipeTransform } from '@angular/core';
import { MarqueeType } from '../app/app-service/public.service';
@Pipe({
  name: 'bulletin'
})
export class BulletinPipe implements PipeTransform {

  transform(list: any, navType): any {

    return list.filter(item => item.type === navType);
  }

}
