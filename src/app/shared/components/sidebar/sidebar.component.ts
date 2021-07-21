import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../_models";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userLoggedIn?: User|null|undefined;

  constructor(public authService: AuthService, private ngZone: NgZone) {
  }


  ngOnInit(): void {

      this.authService.currentUser.subscribe( user => {
        this.userLoggedIn = user
      })


    console.log(this.userLoggedIn)
  }




}
