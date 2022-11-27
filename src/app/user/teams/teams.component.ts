import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";
import {Team} from "src/app/model/team";
import {User} from "src/app/model/user";
import {LoginService} from "src/app/shared/login.service";
import {TeamService} from "src/app/shared/team.service";

@Component({
	selector: "app-teams",
	templateUrl: "./teams.component.html",
	styleUrls: ["./teams.component.css"],
})
export class TeamsComponent implements OnInit {
	teamList: Array<Team> = [];
	router: Router;
	loggedUser!: User;

	teamForm: FormGroup = new FormGroup({
		name: new FormControl(""),
		logo: new FormControl(""),
	});

	constructor(
		private teamService: TeamService,
		private loginService: LoginService,
		router: Router,
		private snackBar: MatSnackBar
	) {
		this.router = router;
	}

	async ngOnInit() {
		this.loggedUser = this.loginService.loadUserFromLocalStorage();

		const teams$ = this.teamService.getTeams();
		this.teamList = await lastValueFrom(teams$);
	}

	openSnackBar(errMessage: string) {
		this.snackBar.open(errMessage, "", {duration: 2500});
	}

	createTeam() {
		this.teamService.create(this.teamForm.value).subscribe({
			next: (res) => {
				console.log(res);
				this.ngOnInit();
			},
			error: (e) => {
				console.log(e);
				this.openSnackBar(e.error.message);
			},
		});
	}

	async info(id: number) {
		this.router.navigate(["team", id]);
	}

	deleteTeam(name: string) {
		this.teamService.delete(name).subscribe((res) => {
			console.log(res);
			this.ngOnInit();
		});
	}
}
