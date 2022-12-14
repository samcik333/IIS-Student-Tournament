import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Params} from "@angular/router";
import {lastValueFrom} from "rxjs";
import {Team} from "src/app/model/team";
import {Tournament} from "src/app/model/tournament";
import {TeamService} from "src/app/shared/team.service";
import {TournamentService} from "src/app/shared/tournament.service";

@Component({
	selector: "app-info",
	templateUrl: "./info.component.html",
	styleUrls: ["./info.component.css"],
})
export class InfoComponent implements OnInit {
	myParam!: string;
	tournament!: Tournament;
	teamList: Array<Team> = [];
	userID!:number;
	isParticipantUser: boolean = false;
	isParticipantTeam: boolean = false;
	loggedIn: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private routerTournament: TournamentService,
		private teamService: TeamService,
		private snackBar: MatSnackBar
	) {}

	async ngOnInit() {
		this.userID = parseInt(localStorage.getItem('userID') || "");
		if(!Number.isNaN(this.userID)){
			this.loggedIn = true;
		}	
		this.route.params.subscribe(
			(params: Params) => (this.myParam = params["id"])
		);
		this.routerTournament
			.find(this.myParam)
			.subscribe((response: Tournament) => {
				this.tournament = response;
				if(!Number.isNaN(this.userID)){
					this.routerTournament.isParticipant(response.id,this.userID,1).subscribe((res: boolean) => {
						this.isParticipantUser = res;
						this.teamService.getOwnedTeams().subscribe((res: Team[]) => {
							res.forEach((team) => {
								this.routerTournament.isParticipant(response.id,team.id,2).subscribe((res: boolean) => {
									this.isParticipantTeam = res;
								});
							});
						});
					});	
				}
			});
			if(!Number.isNaN(this.userID)){
				const teams$ = this.teamService.getOwnedTeams();
				this.teamList = await lastValueFrom(teams$);
			}
	}

	openSnackBar(errMessage: string) {
		this.snackBar.open(errMessage, "", {duration: 2500});
	}

	join(tournamentId: number, id: string) {
		if (id == "user") {
			id = localStorage.getItem("userID") || "";
			this.routerTournament.addPlayer(tournamentId).subscribe({
				next: (res) => {
					console.log(res);
					this.ngOnInit();
				},
				error: (e) => {
					console.log(e);
					this.openSnackBar(e.error.message);
				},
			});
		} else {
			this.routerTournament.addTeam(tournamentId, id).subscribe({
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
	}
}
