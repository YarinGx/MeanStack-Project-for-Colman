import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Review } from '../_models/review';
import {Hotel} from "../_models/hotel";
import {FormControl} from "@angular/forms";

const BACKEND_URL = environment.apiUrl + '/reviews/';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private reviews: Review[] = [];
  private postsUpdated = new Subject<{ reviews: Review[] }>();

  constructor(private http: HttpClient, private router: Router) { }
  getAllReviews() {
    return this.reviews;
  }
  getReviews() {
    this.http.get<{ message: string, reviews:any }>(
      BACKEND_URL
    )
      .pipe(map((reviews) => {
        return {
          reviews: reviews.reviews.map((review:Review) => {
            return {
              _id: review._id,
              hotelId: review.hotelId,
              title: review.title,
              review: review.review,
              reviewDate: review.reviewDate,
              creator: review.creator
            };
          })
        };
      }))
      .subscribe(transformPosts => {
        this.reviews = transformPosts.reviews;
        this.postsUpdated.next({ reviews: [...this.reviews] });
      });
  }


  getReviewUpdateListener() {
    return this.postsUpdated.asObservable();
  }


  getReviewByHotel(id: string) {
    // tslint:disable-next-line: max-line-length
    this.http.get<[{ _id: string, hotelId: string, title: string, review: string, creator:  { _id: string; username: string; },reviewDate: Date  }]>(
      BACKEND_URL + id
    )
      .pipe(map((data) => {
        return {
          reviews: data.map((review:Review) => {
            return {
              _id: review._id,
              hotelId: review.hotelId,
              title: review.title,
              review: review.review,
              reviewDate: review.reviewDate,
              creator: review.creator
            };
          })
        };
      }));
  }

  addReview(title: string, review: string, image: File|null, addImage: boolean, hotelId:string ) {
    const postDate = new FormData();
    postDate.append('title', title);
    postDate.append('review', review);
    postDate.append('hotelId', hotelId);
    if (addImage && image != null) {
      postDate.append('image', image, title);
    } else {
      postDate.append('image', '');
    }


    return this.http.post<{ message: string, post: Review }>(BACKEND_URL,postDate)
      .pipe(map(code => {
        this.reviews.push(code['post']);
        this.postsUpdated.next({ reviews: this.reviews });
        return code;
      }));
  }

  updateReview(id:string, title: string, review: string, image: File|null, addImage: boolean) {
    const body = { id: id, title: title, review: review };
    return this.http
      .put(BACKEND_URL + id, body)
      .pipe(map(code => {
        if(this.reviews){
          let r = this.reviews.find(r => r['_id']==id);
          if(r){
            if(r.title && r.review){
              r.title = title;
              r.review = review;
            }
            this.reviews = this.reviews.filter(r=>r._id != id)
            this.reviews.push(r);
          }

        }
        this.postsUpdated.next({ reviews: this.reviews });
        return code;
      }));
  }

  deleteReview(postId: string) {
    return this.http.delete(BACKEND_URL + postId)
      .pipe(map(code => {
        if(this.reviews){
          let r = this.reviews.find(r => r['_id']==postId);
          if(r){
            this.reviews = this.reviews.filter(r=>r._id != postId)
          }
        }
        this.postsUpdated.next({ reviews: this.reviews });
        return code;
      }));
  }


  getCms() {
    return this.http.get<{ docs: any[] }>(BACKEND_URL + 'sketch');
  }

}
