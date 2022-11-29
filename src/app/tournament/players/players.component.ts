import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Router} from "express";
import {Team} from "src/app/model/team";
import {Tournament} from "src/app/model/tournament";
import {User} from "src/app/model/user";
import {LoginService} from "src/app/shared/login.service";
import {TournamentService} from "src/app/shared/tournament.service";

@Component({
	selector: "app-players",
	templateUrl: "./players.component.html",
	styleUrls: ["./players.component.css"],
})
export class PlayersComponent implements OnInit {
	myParam!: string;
	users!: User[];
	teams!: Team[];
	num: number = 0;
	tournament!: Tournament;
	hasParticipants: boolean = false;
	loggedUser!: User;
	constructor(
		private route: ActivatedRoute,
		private routerTournament: TournamentService,
		private loginService: LoginService,
		private tournamentService: TournamentService
	) {}

	ngOnInit(): void {
		this.loggedUser = this.loginService.loadUserFromLocalStorage();
		this.route.params.subscribe(
			(params: Params) => (this.myParam = params["id"])
		);
		this.routerTournament
			.find(this.myParam)
			.subscribe((response: Tournament) => {
				this.tournament = response;
			});
		this.routerTournament
			.getParticipants(this.myParam)
			.subscribe((response: any) => {
				if (response.result && response.result.type == "teams") {
					this.teams = response.result.teams;
				} else if (response.result && response.result.type == "users") {
					this.users = response.result.users;
				}
				if (this.teams && this.teams.length > 0) {
					this.hasParticipants = true;
				}
				if (this.users && this.users.length > 0) {
					this.hasParticipants = true;
				}
			});
	}

	onDeleteTeam(tournamentId: number, teamId: number) {
		this.tournamentService
			.deleteTeam(tournamentId, teamId)
			.subscribe((res) => {
				console.log(res);
				this.ngOnInit();
			});
	}
	onDeleteUser(tournamentId: number, userId: number) {
		this.tournamentService
			.deleteUser(tournamentId, userId)
			.subscribe((res) => {
				console.log(res);
				this.ngOnInit();
			});
	}
}
