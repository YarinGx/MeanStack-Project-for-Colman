import {EventEmitter, Injectable, Output} from '@angular/core';
import * as moment from "moment";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../_models";
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import { map } from 'rxjs/operators';
import {Review} from "../_models/review";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User|null>;

  constructor(private http: HttpClient) {
    if( localStorage.getItem('currentUser') === null){
      this.currentUserSubject = new BehaviorSubject<User|null>(JSON.parse(<string>localStorage.getItem('currentUser')));
    }
    else{
      this.currentUserSubject = new BehaviorSubject<User|null>(JSON.parse(<string>localStorage.getItem('currentUser'))['user']);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User|null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/login`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          this.currentUserSubject.next(user['user']);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }));
  }

  register(username: string, password: string, firstname: string, lastname: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/register`, { username, password, firstname, lastname })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user['user']);
        }

        return user;
      }));
  }

  getUserById(id: string) {
    this.http.get<{ username: string}>(
      `${environment.apiUrl}/users/${id}`
    )
      .pipe(map((data) => {
        return {
          username: data.username
        };
      })).subscribe(data => {

      }
    );
  }

  setLocalStorage(responseObj: {
    token: string;
    expiresIn: string; }){
    const expires = moment().add(responseObj.expiresIn);

    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));

  }

  logout(){
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(){
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(){
    return !this.isLoggedIn();
  }

  getToken(){
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser != null) {
      const parsed = JSON.parse(currentUser);
      return parsed.token;
    }
    else{
      return null;
    }


  }

  getExpiration(){
    const expiration = localStorage.getItem('expires');
    if (expiration != null) {
      const expiredAt = JSON.parse(expiration);
      return moment(expiredAt);
    }
    else{
      return moment(0);
    }


  }
}
