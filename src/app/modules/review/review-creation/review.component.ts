import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../_models/review';
import {Observable, Subscription, throwError} from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import {first} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Hotel} from "../../../_models/hotel";
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  @Input() hotelId: string = '0';

  reviews: Review[] = [];
  enteredTitle = '';
  enteredReview = '';
  comment!: Comment;
  isLoading = false;
  form: FormGroup;
  private reviewId!: string;
  private authStatusSub!: Subscription;
  private reviewsSub!: Subscription;
  private postId!: string;
  private reviewEditSub!: Subscription;
  @Input() events!: Observable<Review>;
  @Input() mode!: Observable<string>;
  private modeSub!: Subscription;
  private modeValue:string = 'create';

  constructor(
    public reviewsService: ReviewService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {

    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      review: new FormControl('', { validators: [Validators.required] })
    });
  }

  ngOnInit() {
    this.reviewEditSub = this.events.subscribe((review) => {
      this.reviewId = review._id;
      this.form.setValue({
        title: review.title,
        review: review.review
      })
    });
    this.modeSub = this.mode.subscribe((mode) => {
      if(mode=='create') {
        this.modeValue = 'create';
        this.form.reset();
      }
      else
        this.modeValue='edit';
    });
    this.authStatusSub = this.authService.currentUser.subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSaveComment() {
    console.log("modemode:" +this.modeValue)
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
  // .subscribe(transformPosts => {
  //     this.reviews.push(transformPosts.post);
  //     this.postsUpdated.next({ reviews: [...this.reviews] });
  //   });
    if (this.modeValue === 'create') {// check if create or update
      this.reviewsService.addReview(
        this.form.value.title,
        this.form.value.review, null,
        false,
        this.hotelId,
      ).pipe(first())
        .subscribe(
          data => {
            // console.log(data)
            this.isLoading = false;
            this._snackBar.open("review added!", "close",{
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
            this.isLoading = false;
            return throwError( error )
          });
    }
    else {
      this.reviewsService.updateReview(
        this.reviewId,
        this.form.value.title,
        this.form.value.review,
        null,
        false
      ).pipe(first())
        .subscribe(
          data => {
            // console.log(data)
            this.isLoading = false;
            this._snackBar.open("review updated!", "close",{
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
            this.isLoading = false;
            return throwError( error )
          });
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.reviewEditSub.unsubscribe();
  }

}
