import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Review} from "../../../_models/review";
import {Observable, Subscription, throwError} from "rxjs";
import {ReviewService} from "../../../services/review.service";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../../services/auth.service";
import {first} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  reviewSub!: Subscription;
  reviewOb!: Observable<any>;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 50,100,150,200];
  @Input() hotelId: string = '0';
  @Output() newItemEvent = new EventEmitter<Review>();
  @Output() panStatus = new EventEmitter<string>();

  constructor(public reviewsService: ReviewService, public authService: AuthService, private _snackBar: MatSnackBar) {
    this.reviewsService.getReviews()
    this.reviewSub = this.reviewsService.getReviewUpdateListener()
      .subscribe((reviewData: { reviews: Review[]}) => {
        this.reviews = reviewData.reviews.filter(rev => rev.hotelId==this.hotelId)
      });
    this.reviewOb = this.reviewsService.getReviewUpdateListener();
  }

  onOpen(){
    this.panStatus.emit("create");
  }

  gotoelement(review:Review) {
    this.newItemEvent.emit(review);
    this.panStatus.emit("edit");
  }
  deleteReview(review:Review){
    this.reviewsService.deleteReview(review._id).pipe(first())
      .subscribe(
        data => {
          // console.log(data)
          this._snackBar.open("review deleted!", "close",{
            duration: 3000
          });
        },
        error => {
          if (error.status !== 401){
            this._snackBar.open("not logged in", "close",{
              duration: 3000
            });
          }
          if (error.status !== 201){
            this._snackBar.open("internal issue", "close",{
              duration: 3000
            });
          }
          return throwError( error )
        });
  }


  ngOnInit(): void {

  }

  ngOnDestroy() {
    // this.reviewSub.unsubscribe();
  }

}
