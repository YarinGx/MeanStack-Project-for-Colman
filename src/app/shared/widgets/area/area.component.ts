import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {Map} from 'leaflet'
import 'mapbox-gl-leaflet';


import { Hotel } from '../../../_models/hotel';
import { ScrapsService } from '../../../services/scrap.service';
// import { PageEvent } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import {User} from "../../../_models";
import {PageEvent} from "@angular/material/paginator";
import {ReviewService} from "../../../services/review.service";
import {Review} from "../../../_models/review";
@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit, AfterViewInit {

  private map!: Map;

  private zoom!: number;

  receiveMap(map: Map) {
    this.map = map;
  }

  receiveZoom(zoom: number) {
    this.zoom = zoom;
  }

  reviews: Review[] = [];
  scraps: Hotel[] = [];
  cities: String[] = [];
  isLoading = false;
  totoalScraps = 0;
  scrapsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 50,100,150,200];
  private scrapsSub!: Subscription;
  private authStateusSub!: Subscription;
  searchStr!: string;
  selectedCity!: string;
  searchAddress!: string;
  editReview!:Review;
  editReviewSubject: Subject<Review> = new Subject<Review>();
  mode: Subject<string> = new Subject<string>();






  constructor(public scrapsService: ScrapsService, private authService: AuthService, public reviewsService: ReviewService,) { }

  ngOnInit() {

    this.searchStr='';
    this.selectedCity='';
    this.searchAddress='';
    this.isLoading = true;
    this.scrapsService.getScraps(this.scrapsPerPage, 1);
    this.scrapsSub = this.scrapsService.getScrapUpdateListener()
      .subscribe((scrapData: { scraps: Hotel[], scrapCount: number }) => {
        this.isLoading = false;
        this.totoalScraps = scrapData.scrapCount;
        this.scraps = scrapData.scraps;
        scrapData.scraps.forEach(hotel => {
          if(!this.cities.includes(hotel.city)){
            this.cities.push(hotel.city)
          }
        })
      });

  }
  ngAfterViewInit(): void {

  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.scrapsPerPage = pageData.pageSize;
    this.scrapsService.getScraps(this.scrapsPerPage, this.currentPage);
  }

  gotoelement(review:Review, el: HTMLElement) {
    this.mode.next("edit");
    this.editReview = review;
    this.editReviewSubject.next(review);
    el.scrollIntoView({behavior: 'smooth'});
  }

  panStatusCreate(status:string) {
    this.mode.next(status);
  }

  ngOnDestroy() {
    this.scrapsSub.unsubscribe();
  }


}
