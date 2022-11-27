import {HttpHeaderResponse} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CookieOptions} from "express";
import {switchMap} from "rxjs";
import {AppComponent} from "../app.component";
import {User} from "../model/user";
import {LoginService} from "../shared/login.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
	invalidCredentials = false;
	constructor(public loginService: LoginService, private dialog: MatDialog) {}

	loginGroup = new FormGroup({
		username: new FormControl(),
		password: new FormControl(),
	});
	ngOnInit() {}

	onSubmit(): void {
		let authFlow = this.loginService
			.login(this.loginGroup.value)
			.pipe(switchMap(() => this.loginService.profile()));

		authFlow.subscribe({
			next: (user: User) => {
				console.log(12345, user);
				this.loginService.saveUserToLocalStorage(user);
				this.dialog.closeAll();
			},
			error: (error) => {
				this.invalidCredentials = true;
				setTimeout(() => {
					this.invalidCredentials = false;
				}, 3000);
			},
		});
	}
}
