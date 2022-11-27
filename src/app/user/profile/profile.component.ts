import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {response} from "express";
import {lastValueFrom, switchMap} from "rxjs";
import {User} from "src/app/model/user";
import {LoginService} from "src/app/shared/login.service";
import {UserService} from "src/app/shared/user.service";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
	public user?: User;

	constructor(
		private userService: UserService,
		private loginService: LoginService,
		private formBuilder: FormBuilder
	) {}
	saveGroup = new FormGroup({
		username: new FormControl(),
		password: new FormControl(),
		email: new FormControl(),
		name: new FormControl(),
		lastname: new FormControl(),
		photo: new FormControl(),
		role: new FormControl(),
		gold: new FormControl(),
		silver: new FormControl(),
		bronze: new FormControl(),
		numberOfGames: new FormControl(),
		numberOfWins: new FormControl(),
		id: new FormControl(),
	});

	async ngOnInit() {
		const users$ = this.userService.getUser();
		this.user = await lastValueFrom(users$);
		this.saveGroup.setValue({
			username: this.user.username,
			password: null,
			email: this.user.email,
			name: this.user.name,
			lastname: this.user.lastname,
			photo: null,
			role: this.user.role,
			gold: this.user.gold,
			silver: this.user.silver,
			bronze: this.user.bronze,
			numberOfGames: this.user.numberOfGames,
			numberOfWins: this.user.numberOfWins,
			id: this.user.id,
		});
	}
	onSubmit(): void {
		let authFlow = this.userService
			.updateUser(this.saveGroup.value)
			.pipe(switchMap(() => this.loginService.profile()));

		authFlow.subscribe({
			next: (user: User) => {
				this.loginService.saveUserToLocalStorage(user);
				this.ngOnInit();
			},
			error: (error) => {
				console.log(error);
			},
		});
	}
	hide = true;
}
