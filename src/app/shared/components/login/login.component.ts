import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import { filter, map, catchError, first} from 'rxjs/operators';
import { throwError } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Map} from "leaflet";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  form: FormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;
  private returnUrl!: string;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {

        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;

        this.authService.login(username, password)
          .pipe(first())
          .subscribe(
            data => {
              this._snackBar.open("logged in successfully!", "close",{
                duration: 3000
              });
              this.router.navigate([this.returnUrl]);
            },
            error => {
              if (error.status === 401){
                this._snackBar.open("wrong username or password", "close",{
                  duration: 3000
                });
                // error = "wrong username or password"
              }
              this.error = error;
              // this.loading = false;
              return throwError( error )
            });
      } catch (err) {
        console.log("err: "+err)
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
