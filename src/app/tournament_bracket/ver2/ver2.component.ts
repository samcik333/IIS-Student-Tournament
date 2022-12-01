import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {ActivatedRoute, Params, Route} from "@angular/router";
import * as e from "express";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {myMatch} from "src/app/interface/myMatch";
import { MatchComponent } from "src/app/match/match.component";
import {Bracket} from "src/app/model/bracket";
import {Match} from "src/app/model/match";
import {Team} from "src/app/model/team";
import {Tournament} from "src/app/model/tournament";
import {User} from "src/app/model/user";
import {MatchService} from "src/app/shared/match.service";
import {TeamService} from "src/app/shared/team.service";
import {TournamentService} from "src/app/shared/tournament.service";
import {UserService} from "src/app/shared/user.service";

@Component({
	selector: "app-ver2",
	templateUrl: "./ver2.component.html",
	styleUrls: ["./ver2.component.css"],
})
export class Ver2Component implements OnInit {
  contactForm!:FormGroup;
  v2:boolean = false;
  v4:boolean = false;
  v8:boolean = false;
  v16:boolean = false;
  popup:boolean = false;


  myParam!:string;
  tournament!:Tournament;
  match!:Match;
  userID!:number;
  participantA!:string;
  participantB!:string;
  TeamA!:Team;
  TeamB!:Team;
  UserA!:User;
  UserB!:User;
  IDA!:number;
  IDB!:number;
  spiderID!:number;
  participants!:any;
  matches!:any;
  spider = new Bracket();

  eightMatches: Array<myMatch> = [];
  quarterMatches: Array<myMatch> = [];
  semiMatches: Array<myMatch> = [];
  final: Array<myMatch> = [];
  bronze: Array<myMatch> = [];

  constructor(public fb:FormBuilder, public restTournaments:TournamentService, public route:ActivatedRoute, public restMatch:MatchService, public restUser:UserService, public restTeam:TeamService, public dialog:MatDialog) { 
  }

  async ngOnInit(): Promise<void> {
    this.userID = parseInt(localStorage.getItem('userID') || "");
    ///Get Tournament by ID
      this.route.params.subscribe((params: Params) => this.myParam = params['id']);
      const $tournament = this.restTournaments.find(this.myParam);
      this.tournament = await lastValueFrom($tournament);

    ///Generate spider depends on capacity
      this.generateTree((this.tournament.capacity).toString());

    ///Fill bracket - Spider
      this.fillBracket();
  }

  
  async fillBracket(){
    await this.restTournaments.getBracket(this.myParam).subscribe( async res => {
    this.spider = res;
    if(this.spider){
      this.createBracketMatches(this.spider.eightfinals, this.eightMatches);
      this.createBracketMatches(this.spider.quarterfinals, this.quarterMatches);
      this.createBracketMatches(this.spider.semifinals, this.semiMatches);
      this.createBracketMatches(this.spider.bronze, this.bronze);
      this.createBracketMatches(this.spider.final, this.final);
    }});
  }
  
  async updateSchedule(){
    const ip$ = this.restTournaments.updateSchedule(this.spider);
    console.log(lastValueFrom(ip$));
    this.ngOnInit();
  }

  async createBracketMatches(spider_array:string[], matches:Array<myMatch>){
    ///Generate BracketMatches
    if(spider_array && spider_array.length > 0){
      spider_array.forEach(async element => {
        const mat$ = this.restMatch.getMatch(element);
        if(!mat$){return};
        this.match = await lastValueFrom(mat$);
        const scoreA = this.match.firstScore;
        const scoreB = this.match.secondScore;
        const order = this.match.order;
        if(this.tournament.mode == 1){
          const userA$ = this.restUser.getUserById((this.match.firstTeam).toString());
          const userB$ = this.restUser.getUserById((this.match.secondTeam).toString());
          if(!userA$ && !userB$){return};
          this.UserA = (await lastValueFrom(userA$));
          this.UserB = (await lastValueFrom(userB$));
          this.participantA = this.UserA.username;
          this.participantB = this.UserB.username;
          this.IDA = this.UserA.id;
          this.IDB = this.UserB.id;
        }else{
          const teamA$ = this.restTeam.findTeam((this.match.firstTeam).toString());
          const teamB$ = this.restTeam.findTeam((this.match.secondTeam).toString());
          if(!teamA$ && !teamB$){return};
          this.TeamA = await lastValueFrom(teamA$);
          this.TeamB = await lastValueFrom(teamB$);
          this.participantA = this.TeamA.name;
          this.participantB = this.TeamB.name;
          this.IDA = this.TeamA.id;
          this.IDB = this.TeamB.id;
        }
        let a: myMatch = {
          order: order,
          idA: this.IDA,
          idB: this.IDB,
          id: this.match.id,
          TeamA: this.participantA,
          TeamB: this.participantB,
          ScoreA: scoreA,
          ScoreB: scoreB
        }
        matches.push(a);
        matches.sort((a,b) => a.order - b.order);
      });
    }
  }

  async generateSchedule(){
    if(this.spider.eightfinals && this.spider.eightfinals.length > 0){return;}
    const participants$ = this.restTournaments.getParticipants(this.myParam);
    this.participants = await lastValueFrom(participants$);
    if(this.participants.result.type == "teams"){
      this.participants = this.participants.result.teams;
    }else if(this.participants.result.type == "users"){
      this.participants = this.participants.result.users;
    }
    this.participants = this.shuffle(this.participants);
    let order = 0;
    for (let i = 0; i < this.participants.length; i+=2) {
      const match = {
        date: new Date(),
        tournamentId: this.myParam,
        firstTeam: this.participants[i].id,
        secondTeam: this.participants[i+1].id,
        order: order++,
      };
      const $mat = this.restMatch.create(match).subscribe(res => {
        this.match = res;
        this.spider.eightfinals.push((res.id).toString());
        if(this.tournament.capacity/2 == this.spider.eightfinals.length){
          this.restTournaments.updateSchedule(this.spider).subscribe(() => this.ngOnInit());
        }
      });
    }
  }

  evaluate(){
    if(this.quarterMatches){
      this.quarterMatches =  [new myMatch,new myMatch,new myMatch,new myMatch];
      let counter = 0;
      let pair = true;
      for (let i = 0; i < this.eightMatches.length; i++) {
        if(pair){
          if(this.eightMatches[i].ScoreA > this.eightMatches[i].ScoreB){
            this.quarterMatches[counter].TeamA = this.eightMatches[i].TeamA;
          }else if(this.eightMatches[i].ScoreA < this.eightMatches[i].ScoreB){
            this.quarterMatches[counter].TeamA = this.eightMatches[i].TeamB;
          }
          pair = false;
        }else if(!pair){
          if(this.eightMatches[i].ScoreA > this.eightMatches[i].ScoreB){
            this.quarterMatches[counter].TeamB = this.eightMatches[i].TeamA;
          }else if(this.eightMatches[i].ScoreA < this.eightMatches[i].ScoreB){
            this.quarterMatches[counter].TeamB = this.eightMatches[i].TeamB;
          }
          pair = true;
          counter++;
        }
      }
    }
    if(this.semiMatches){
      this.semiMatches =  [new myMatch,new myMatch];
      let counter = 0;
      let pair = true;
      for (let i = 0; i < this.quarterMatches.length; i++) {
        if(pair){
          if(this.quarterMatches[i].ScoreA > this.quarterMatches[i].ScoreB){
            this.semiMatches[counter].TeamA = this.quarterMatches[i].TeamA;
          }else if(this.quarterMatches[i].ScoreA < this.quarterMatches[i].ScoreB){
            this.semiMatches[counter].TeamA = this.quarterMatches[i].TeamB;
          }
          pair = false;
        }else if(!pair){
          if(this.quarterMatches[i].ScoreA > this.quarterMatches[i].ScoreB){
            this.semiMatches[counter].TeamB = this.quarterMatches[i].TeamA;
          }else if(this.quarterMatches[i].ScoreA < this.quarterMatches[i].ScoreB){
            this.semiMatches[counter].TeamB = this.eightMatches[i].TeamB;
          }
          pair = true;
          counter++;
        }
      }
    }
    if(this.final && this.bronze){
      this.final =  [new myMatch];
      this.bronze =  [new myMatch];
      if(this.semiMatches[0].ScoreA > this.semiMatches[0].ScoreB){
        this.final[0].TeamA = this.semiMatches[0].TeamA;
        this.bronze[0].TeamA = this.semiMatches[0].TeamB;
      }else if(this.semiMatches[0].ScoreA > this.semiMatches[0].ScoreB){
        this.final[0].TeamA = this.semiMatches[0].TeamB;
        this.bronze[0].TeamA = this.semiMatches[0].TeamA;
      }
      if(this.semiMatches[1].ScoreA > this.semiMatches[1].ScoreB){
        this.final[0].TeamB = this.semiMatches[1].TeamA;
        this.bronze[0].TeamB = this.semiMatches[1].TeamB;
      }else if(this.semiMatches[1].ScoreA > this.semiMatches[1].ScoreB){
        this.final[0].TeamB = this.semiMatches[1].TeamB;
        this.bronze[0].TeamB = this.semiMatches[1].TeamA;
      }
    }
  }

  saveMatch(matchA:Match,scoreA:number,matchB:Match,scoreB:number){

  }

	generateTree(data: string) {
		const value = parseInt(data);
		if (value == 2) {
			this.v2 = true;
		}
		if (value >= 4) {
			this.v4 = true;
		}
		if (value >= 8) {
			this.v8 = true;
		}
		if (value >= 16) {
			this.v16 = true;
		}
		if (value != 2) {
			this.v2 = false;
		}
		if (value < 4) {
			this.v4 = false;
		}
		if (value < 8) {
			this.v8 = false;
		}
		if (value < 16) {
			this.v16 = false;
		}
	}

	shuffle(a: any) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}

  openPOP(id:number){
    const loginConfig = new MatDialogConfig();
		loginConfig.disableClose = false;
		loginConfig.autoFocus = true;
		loginConfig.width = "30%";
    loginConfig.height = "40%";
    loginConfig.data = id;
		this.dialog.open(MatchComponent, loginConfig);
    this.ngOnInit();
  }
}
