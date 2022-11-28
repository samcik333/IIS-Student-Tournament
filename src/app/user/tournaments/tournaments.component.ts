import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {lastValueFrom, switchMap} from "rxjs";
import {Tournament} from "src/app/model/tournament";
import {User} from "src/app/model/user";
import {LoginService} from "src/app/shared/login.service";
import {TournamentService} from "src/app/shared/tournament.service";

@Component({
	selector: "app-tournaments",
	templateUrl: "./tournaments.component.html",
	styleUrls: ["./tournaments.component.css"],
})
export class TournamentsComponent implements OnInit {
	tournaments: any = [];
	tourn = new Tournament();
	hideValues = false;
	edit = false;
	constructor(
		private tournamentService: TournamentService,
		private loginService: LoginService,
		private router: Router
	) {}
	createGroup = new FormGroup({
		name: new FormControl(),
		logo: new FormControl(),
		mode: new FormControl(),
		capacity: new FormControl(),
		date: new FormControl(),
		place: new FormControl(),
		description: new FormControl(),
		id: new FormControl(),
	});

	async ngOnInit() {
		const tournaments$ = this.tournamentService.getTournamentsByOwner();
		this.tournaments = await lastValueFrom(tournaments$);
	}

	onSubmit(): void {
		let tournamentRes = this.tournamentService.create(
			this.createGroup.value
		);
		tournamentRes.subscribe({
			next: () => {
				this.edit = false;
				this.ngOnInit();
			},
			error: (error) => {},
		});
	}
	onSave(teamId: number): void {
		let tournamentRes = this.tournamentService.update(
			this.createGroup.value,
			teamId
		);
		tournamentRes.subscribe({
			next: () => {
				this.edit = false;
				this.ngOnInit();
			},
			error: (error) => {},
		});
	}

	onSelect(TournamentId: any) {
		this.tournamentService.find(TournamentId).subscribe({
			next: (Tournament: Tournament) => {
				this.tourn = Tournament;
				this.createGroup.patchValue(Tournament);
				this.edit = true;
				this.ngOnInit();
			},
			error: (error) => {},
		});
	}

	onDelete(teamId: string) {
		const userId = this.loginService.loadUserFromLocalStorage().id;
		let tournamentDelete = this.tournamentService.delete(teamId, userId);
		tournamentDelete.subscribe({
			next: () => {
				this.ngOnInit();
			},
			error: (error) => {},
		});
	}
	async info(id: number) {
		this.router.navigate(["team", id]);
	}
}
