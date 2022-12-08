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
import { UserService } from "../shared/user.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	restTournament: TournamentService;
	public tournamentList: Array<Tournament> = [];
	router: Router;
	liked: boolean = true;
	likedTournaments:Array<any> = [];

	searchForm: FormGroup = new FormGroup({
		search: new FormControl(""),
	});

	constructor(
		restTournament: TournamentService,
		public restUser: UserService,
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
		const liked$ = this.restUser.getLiked(localStorage.getItem("userID") || "");
		this.likedTournaments = await lastValueFrom(liked$);
		console.log(this.likedTournaments);
	}

	async info(id: number) {
		this.router.navigate(["tournament", id]);
	}

	async filtered(state: string) {
		if(state === "1"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.tournamentList = res; 
			});
		}else if(state === "2"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.tournamentList = res; 
				const result = this.tournamentList.filter(s => s.state.includes('open'));
				this.tournamentList = result;
			});	
		}else if(state === "3"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.tournamentList = res; 
				const result = this.tournamentList.filter(s => s.state.includes('closed'));
				this.tournamentList = result;
			});	
		}else if(state === "4"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.tournamentList = res; 
				const result = this.tournamentList.filter(s => s.state.includes('waiting'));
				this.tournamentList = result;
			});	
		}
	}

}
