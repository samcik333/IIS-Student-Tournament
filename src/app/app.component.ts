import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SJS Squad';

  constructor(private dialog: MatDialog) {}

  openLoginDialog() {
    const loginConfig = new MatDialogConfig();
    loginConfig.disableClose = false;
    loginConfig.autoFocus = true;
    loginConfig.width = '20%';
    this.dialog.open(LoginComponent, loginConfig);
  }

  openRegisterDialog() {
    const registerConfig = new MatDialogConfig();
    registerConfig.disableClose = false;
    registerConfig.autoFocus = true;
    registerConfig.width = '40%';
    this.dialog.open(RegisterComponent, registerConfig);
  }
}
