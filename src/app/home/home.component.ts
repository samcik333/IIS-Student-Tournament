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
	tournamentList: { tournaments: Tournament, liked: boolean }[] = [];
	router: Router;
	liked: boolean = false;
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
	}

	ngOnInit() {
		if(localStorage.getItem("userID")){
			this.liked = true;					
			this.restTournament.getTournaments().subscribe((resA) => {
				this.restUser.getLiked(localStorage.getItem("userID") || "").subscribe((resB) => {
					this.likedTournaments = this.getLikedIDs(resB);
					console.log(this.likedTournaments)
					this.createList(resA);
				});
			});
		}else{
			this.restTournament.getTournaments().subscribe((res) => {
				this.createList(res);
			});
		}
		this.search();

	}

	async search() {
		this.searchForm
			.get("search")
			?.valueChanges.pipe(
				debounceTime(100),
				distinctUntilChanged(),
				switchMap((result) => this.restTournament.findByName(result))
			)
			.subscribe((result) => {
				if(localStorage.getItem("userID")){
					this.liked = true;					
				}
				this.restUser.getLiked(localStorage.getItem("userID") || "").subscribe((res) => {
					this.likedTournaments = this.getLikedIDs(res);
					this.createList(result);
				});	
			});
	}

	async info(id: number) {
		this.router.navigate(["tournament", id]);
	}

	async filtered(state: string) {
		if(state === "1"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.createList(res);
			});
		}else if(state === "2"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.createList(res);
				const result = res.filter(s => s.state.includes('open'));
				this.createList(result);
			});	
		}else if(state === "3"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.createList(res);
				const result = res.filter(s => s.state.includes('closed'));
				this.createList(result);
			});	
		}else if(state === "4"){
			this.restTournament.getTournaments().subscribe((res) => { 
				this.createList(res);
				const result = res.filter(s => s.state.includes('waiting'));
				this.createList(result);
			});	
		}else if(state === "5"){
			const result = this.tournamentList.filter(s => s.liked == true);
			this.tournamentList = result;
		}
	}

	async createList(result: Tournament[]) {
		this.tournamentList = [];
		result.forEach(element => {
			if(this.likedTournaments.includes(element.id)){
				this.tournamentList.push({tournaments: element, liked: true});
			}else{
				this.tournamentList.push({tournaments: element, liked: false});
			}
		});
	}

	like(id: number) {
		this.restUser.likeTournament(localStorage.getItem("userID") || "", id.toString()).subscribe((res) => {
			this.restTournament.getTournaments().subscribe((resA) => {
				this.restUser.getLiked(localStorage.getItem("userID") || "").subscribe((resB) => {
					this.likedTournaments = this.getLikedIDs(resB);
					this.createList(resA);
				});
			});
		});
	}

	dislike(id: number) {
		this.restUser.dislikeTournament(localStorage.getItem("userID") || "", id.toString()).subscribe((res) => {
			this.restTournament.getTournaments().subscribe((resA) => {
				this.restUser.getLiked(localStorage.getItem("userID") || "").subscribe((resB) => {
					this.likedTournaments = this.getLikedIDs(resB);
					this.createList(resA);
				});
			});
		});
	}

	getLikedIDs(tournaments:Tournament[]){
		let likedIDs:number[] = [];
		tournaments.forEach(tournament => {
			likedIDs.push(tournament.id);
		});
		return likedIDs;
	}
}
