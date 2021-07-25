import { Component, OnInit } from '@angular/core';
import {Review} from "../../_models/review";
import {AuthService} from "../../services/auth.service";
import {Observable, of, Subscription} from "rxjs";
import {User} from "../../_models";
import {MatTableDataSource} from "@angular/material/table";
import {delay} from "rxjs/operators";
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'username', 'role'];
  dataSource = new MatTableDataSource<User>();


  users: User[] = [];
  usersSub!: Subscription;
  usersOb!: Observable<any>;

  constructor(public authService: AuthService) {
    this.authService.getUsers()
    this.usersSub = this.authService.getUsersUpdateListener()
      .subscribe((usersData: { users: any[]}) => {
        this.dataSource.data = usersData.users;
        this.users = usersData.users

      });
    this.usersOb = this.authService.getUsersUpdateListener();


  }

  ngOnInit(): void {
    console.log(this.users)
    // console.log(this.users)
  }

}
