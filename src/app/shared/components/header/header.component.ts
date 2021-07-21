import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, NavigationStart, ParamMap, Router, UrlSegment} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../_models";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter()

  currentRoute: string;
  userLoggedIn?: User|null;

  constructor(private route: Router, public authService: AuthService) {
    this.currentRoute = '/' }

  ngOnInit(): void {
    this.route.events.subscribe(e => {
      if(e instanceof NavigationStart) {
        // console.log(e.url);
        this.currentRoute = e.url;
      }
    })
    if(this.authService)
      this.authService.currentUser.subscribe( user => {
        this.userLoggedIn = user
      })
  }

  toggleSideBar(){
    console.log(this.userLoggedIn)
    // console.log(this.userLoggedIn)
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

}
