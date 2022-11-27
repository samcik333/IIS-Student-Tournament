import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {lastValueFrom, switchMap} from "rxjs";
import {User} from "src/app/model/user";
import {TournamentService} from "src/app/shared/tournament.service";

@Component({
	selector: "app-tournaments",
	templateUrl: "./tournaments.component.html",
	styleUrls: ["./tournaments.component.css"],
})
export class TournamentsComponent implements OnInit {
	tournaments: any = [];
	constructor(private tournamentService: TournamentService) {}
	createGroup = new FormGroup({
		name: new FormControl(),
		logo: new FormControl(),
		players: new FormControl(),
		capacity: new FormControl(),
		date: new FormControl(),
		place: new FormControl(),
		description: new FormControl(),
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
				this.ngOnInit();
			},
			error: (error) => {},
		});
	}
}
