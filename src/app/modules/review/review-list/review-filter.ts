import { Pipe, PipeTransform } from '@angular/core';
import {Review} from "../../../_models/review";

@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: Review[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.hotelId.indexOf(filter) !== -1);
  }
}
