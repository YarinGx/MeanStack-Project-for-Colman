export interface Review {
  _id:string;
  hotelId: string;
  title: string;
  review: string;
  creator: {_id:string,username:string } ;
  reviewDate: Date;
}
