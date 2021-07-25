import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import { filter, map, catchError, first} from 'rxjs/operators';
import { throwError } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  public registerInvalid = false;
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
      username: ['', Validators.compose([Validators.email, Validators.max(30)])],
      password: ['', Validators.compose([Validators.required, Validators.max(30)])],
      firstname: ['', Validators.compose([Validators.required, Validators.max(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.max(30)])]
    });
  }

  async ngOnInit(): Promise<void> {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onSubmit(): Promise<void> {
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {

        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;
        const firstname = this.form.get('firstname')?.value;
        const lastname = this.form.get('lastname')?.value;


        this.authService.register(username, password, firstname, lastname)
          .pipe(first())
          .subscribe(
            data => {
              this._snackBar.open("registered successfully!", "close",{
                duration: 3000
              });
              this.router.navigate([this.returnUrl]);
            },
            error => {
              if (error.status === 401){
                this._snackBar.open("user already exist.", "close",{
                  duration: 3000
                });
              }
              this.error = error;
              // this.loading = false;
              return throwError( error )
            });
      } catch (err) {
        console.log("err: "+err)
        this.registerInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
