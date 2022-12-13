import {ɵparseCookieValue} from "@angular/common";
import {Component} from "@angular/core";
import {
	MatDialog,
	MatDialogConfig,
	MatDialogRef,
} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {CookieOptions} from "express";
import { HomeComponent } from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {User} from "./model/user";
import {RegisterComponent} from "./register/register.component";
import {LoginService} from "./shared/login.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	title = "SJS Squad";
	userIsLoggedIn = true;
	public userInfo?: User;

	ngOnInit() {
		this.loginService.loadUserFromLocalStorage();
		this.loginService.userProfile.subscribe((data) => {
			this.userInfo = data;
		});
	}

	constructor(
		private dialog: MatDialog,
		private loginService: LoginService,
		private router: Router
	) {}

	openLoginDialog() {
		const loginConfig = new MatDialogConfig();
		loginConfig.disableClose = false;
		loginConfig.autoFocus = true;
		loginConfig.width = "20%";
		this.dialog.open(LoginComponent, loginConfig);
	}

	openRegisterDialog() {
		const registerConfig = new MatDialogConfig();
		registerConfig.disableClose = false;
		registerConfig.autoFocus = true;
		registerConfig.width = "40%";
		this.dialog.open(RegisterComponent, registerConfig);
	}
	logOut() {
		if (this.userInfo != undefined) {
			this.userInfo.id = 0;
			this.loginService.logout().subscribe({
				next: () => {
					localStorage.clear();
					this.router.navigate(["/"]);
					location.reload();
					//this.home.ngOnInit();	
				},
			});
		}
	}
}
