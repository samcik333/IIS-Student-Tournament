import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {
	debounceTime,
	distinctUntilChanged,
	lastValueFrom,
	switchMap,
} from "rxjs";
import {AppComponent} from "../app.component";
import {Tournament} from "../model/tournament";
import {LoginService} from "../shared/login.service";
import {TournamentService} from "../shared/tournament.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	restTournament: TournamentService;
	public tournamentList: Array<Tournament> = [];
	router: Router;

	searchForm: FormGroup = new FormGroup({
		search: new FormControl(""),
	});

	constructor(
		restTournament: TournamentService,
		router: Router,
		private loginService: LoginService
	) {
		this.restTournament = restTournament;
		this.router = router;
		this.searchForm
			.get("search")
			?.valueChanges.pipe(
				debounceTime(100),
				distinctUntilChanged(),
				switchMap((result) => this.restTournament.findByName(result))
			)
			.subscribe((result) => {
				this.tournamentList = result;
			});
	}

	async ngOnInit() {
		const tournaments$ = this.restTournament.getTournaments();
		this.tournamentList = await lastValueFrom(tournaments$);
	}

	async info(id: number) {
		this.router.navigate(["tournament", id]);
	}
}
