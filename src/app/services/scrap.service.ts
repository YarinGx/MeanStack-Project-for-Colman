import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Hotel } from '../_models/hotel';

const BACKEND_URL = environment.apiUrl + '/scrap';

@Injectable({ providedIn: 'root' })
export class ScrapsService {
  private scraps: Hotel[] = [];
  private scrapsUpdated = new Subject<{ scraps: Hotel[], scrapCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }
  getAllScraps() {
    return this.scraps;
  }
  getScraps(scrapsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${scrapsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, scraps: any, maxScraps: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((scrapDate) => {
        return {
          scraps: scrapDate.scraps.map((scrap:Hotel) => {
            return {
              _id: scrap._id,
              name: scrap.name,
              address : scrap.address,
              latitude: scrap.latitude,
              longitude : scrap.longitude,
              img: scrap.img,
              description:scrap.description,
              city:scrap.city
            };
          }),
          maxScraps: scrapDate.maxScraps
        };
      }))
      .subscribe(transformScraps => {
        this.scraps = transformScraps.scraps;
        this.scrapsUpdated.next({ scraps: [...this.scraps], scrapCount: transformScraps.maxScraps });
      });
  }

  getScrapUpdateListener() {
    return this.scrapsUpdated.asObservable();
  }

  getScrap(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ _id: string, title: string, year: string, summary: string, len: string, director: string }>(
      BACKEND_URL + id
    );
  }

}
