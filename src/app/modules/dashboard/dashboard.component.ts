import { Component, OnInit } from '@angular/core';
import {User} from "../../_models";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userLoggedIn?: User|null|undefined;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe( user => {
      this.userLoggedIn = user
    })
  }

}
