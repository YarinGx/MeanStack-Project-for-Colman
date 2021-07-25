// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import {PageEvent} from '@angular/material/paginator';
// import {Review} from "../../_models/review";
// import {ReviewService} from "../../services/review.service";
// import {AuthService} from "../../services/auth.service";
//
//
// @Component({
//   selector: 'app-posts',
//   templateUrl: './posts.component.html',
//   styleUrls: ['./posts.component.css']
// })
// export class PostsComponent implements OnInit, OnDestroy {
//
//   posts: Review[] = [];
//   isLoading = false;
//   totoalPosts = 0;
//   postsPerPage = 100;
//
//   currentPage = 1;
//   pageSizeOptions = [1, 2, 5, 10, 50, 100];
//   userIsAuth = false;
//   userId: number | undefined;
//   curentCreateTimes!: 0;
//   currentDeleteTimes!: 0;
//   private postsSub!: Subscription;
//   private authStateusSub!: Subscription;
//   searchTermByTitle!: string;
//   searchTermByContent!: string;
//   searchTermByimage = true;
//   searchTermByEstimatedTime!: string;
//
//
//   constructor(public postsService: ReviewService, private authService: AuthService) { }
//
//   ngOnInit() {
//     this.isLoading = false;
//     this.postsService.getPosts(this.postsPerPage, 1);
//     // this.userId = this.authService.currentUserValue();
//     this.postsSub = this.postsService.getPostUpdateListener()
//       .subscribe((postData: { posts: Review[], postCount: number }) => {
//         this.isLoading = false;
//         this.totoalPosts = postData.postCount;
//         this.posts = postData.posts;
//       });
//     // this.userIsAuth = this.authService.getIsAuth();
//     this.authStateusSub = this.authService.currentUser
//       .subscribe((isAuthenticated) => {
//         // this.userIsAuth = isAuthenticated;
//         this.userId = isAuthenticated?.id;
//       });
//     this.postsService.getCms().subscribe((d: any) => {
//       this.curentCreateTimes = d.doc[0];
//       this.currentDeleteTimes = d.doc[1];
//     });
//   }
//
//   onChangePage(pageData: PageEvent) {
//     this.isLoading = true;
//     this.currentPage = pageData.pageIndex + 1;
//     this.postsPerPage = pageData.pageSize;
//     this.postsService.getPosts(this.postsPerPage, this.currentPage);
//   }
//
//   onDelete(postId: string) {
//     this.isLoading = true;
//     this.postsService.deletePost(postId).subscribe(() => {
//       this.postsService.getPosts(this.postsPerPage, this.currentPage);
//     });
//     window.location.reload();
//   }
//
//   ngOnDestroy() {
//     this.postsSub.unsubscribe();
//     this.authStateusSub.unsubscribe();
//   }
//
// }
