import { PipeTransform, Pipe, OnInit } from '@angular/core';
import { Hotel } from '../../../_models/hotel';

@Pipe({
  name: 'HotelCityFilter'
})
export class HotelCityFilter implements PipeTransform {
  transform(hotel_list: Hotel[], searchTerm: string): Hotel[] {
    if (!hotel_list || !searchTerm) {
      return hotel_list;
    }
    return hotel_list.filter(hotel =>
      hotel.city.indexOf(searchTerm) !== -1);
  }
}
