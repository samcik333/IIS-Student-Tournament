import {HttpErrorResponse} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {switchMap} from "rxjs";
import {User} from "../model/user";
import {HelperService} from "../shared/helper.service";
import {LoginService} from "../shared/login.service";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
	isUserExist = false;
	constructor(
		private loginService: LoginService,
		private dialog: MatDialog,
		private helperService: HelperService
	) {}

	ngOnInit(): void {}

	registerGroup = new FormGroup({
		username: new FormControl(),
		password: new FormControl(),
		email: new FormControl("", [Validators.required, Validators.email]),
		name: new FormControl(),
		lastname: new FormControl(),
	});

	onSubmit(): void {
		let authFlow = this.loginService
			.register(this.registerGroup.value)
			.pipe(switchMap(() => this.loginService.profile()));

		authFlow.subscribe({
			next: (user: User) => {
				this.loginService.saveUserToLocalStorage(user);
				this.dialog.closeAll();
			},
			error: (error: HttpErrorResponse) => {
				console.log(error.error.message);
				switch (error.error.message) {
					case "/name":
						this.helperService.openSnackBarWarn("Missing Name");
						break;
					case "/lastname":
						this.helperService.openSnackBarWarn("Missing Lastname");
						break;
					case "/username":
						this.helperService.openSnackBarWarn("Missing Username");
						break;
					case "/email":
						this.helperService.openSnackBarWarn(
							"Email is missing, or invalid"
						);
						break;
					case "/password":
						this.helperService.openSnackBarWarn(
							"Password must have 8 or more characters"
						);
						break;
					case "Username already exists":
						this.helperService.openSnackBarWarn(
							"User with this username already exists"
						);
						break;
					case "Email already exists":
						this.helperService.openSnackBarWarn(
							"User with this email already exists"
						);
						break;

					default:
						break;
				}
			},
		});
	}
}
