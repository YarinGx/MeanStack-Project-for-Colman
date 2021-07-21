import {HttpHandler, HttpInterceptor, HttpRequest, HttpEvent} from "@angular/common/http";

import {Injectable} from "@angular/core";
import {AuthService} from "../auth.service";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authenticationService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl && currentUser!=null) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(req);

    // const token = localStorage.getItem('token');
    // if(token){
    //   const cloned = req.clone({
    //     headers: req.headers.set("Authorization", token)
    //   });
    //   return next.handle(cloned);
    // }
    // else{
    //   next.handle(req);
    // }


  }

}
