import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {switchMap} from "rxjs";
import {User} from "../model/user";
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
		private dialog: MatDialog
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
			error: (error) => {
				this.isUserExist = true;
				setTimeout(() => {
					this.isUserExist = false;
				}, 3000);
			},
		});
	}
}
