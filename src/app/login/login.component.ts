import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieOptions } from 'express';
import { switchMap } from 'rxjs';
import { AppComponent } from '../app.component';
import { HomeComponent } from '../home/home.component';
import { User } from '../model/user';
import { HelperService } from '../shared/helper.service';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  invalidCredentials = false;
  router: Router;

  loginGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    public loginService: LoginService,
    private helperService: HelperService,
    private dialog: MatDialog,
    router: Router,
  ) {
    this.router = router;
  }

  ngOnInit() {}

  onSubmit(): void {
    let authFlow = this.loginService
      .login(this.loginGroup.value)
      .pipe(switchMap(() => this.loginService.profile()));

    authFlow.subscribe({
      next: (user: User) => {
        //console.log(user);
        this.loginService.saveUserToLocalStorage(user);
        this.helperService.openSnackBarSucc('Loged in successfully');
        this.dialog.closeAll();
        // admin side
        if (this.loginGroup.value.username == 'admin') {
          this.adminInfo();
        }
        location.reload();
        //this.home.ngOnInit();
      },

      error: (e: HttpErrorResponse) => {
        console.log(e);
        this.helperService.openSnackBarWarn('Invalid username or password');

        this.invalidCredentials = true;
        setTimeout(() => {
          this.invalidCredentials = false;
        }, 3000);
      },
    });
  }

  async adminInfo() {
    this.router.navigate(['admin/userManager']);
  }
}
