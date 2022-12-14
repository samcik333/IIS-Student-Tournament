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
    this.restTournaments.getBracket(this.myParam).subscribe( async res => {
    this.spider = res;
    if(this.spider){
      this.eightMatches = [];
      this.quarterMatches = [];
      this.semiMatches = [];
      this.final = [];
      this.bronze = [];
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
        let mat: myMatch = {
          order: 0,
          idA: 0,
          idB: 0,
          id: 0,
          TeamA: "",
          TeamB: "",
          ScoreA: 0,
          ScoreB: 0,
        }
        const mat$ = this.restMatch.getMatch(element);
        if(!mat$){return};
        this.match = await lastValueFrom(mat$);
        mat.ScoreA = this.match.firstScore;
        mat.ScoreB = this.match.secondScore;
        mat.order = this.match.order;
        mat.id = this.match.id;
        if(this.tournament.mode == 1){
          this.restUser.getUserById((this.match.firstTeam).toString()).subscribe( async resA => {
            this.restUser.getUserById((this.match.secondTeam).toString()).subscribe( async resB => {
              matches[mat.order-1] = new myMatch(mat.id, mat.order, resA.username, resB.username, mat.ScoreA, mat.ScoreB, resA.id, resB.id); 
            });
          });
        }else{
          this.restTeam.findTeam((this.match.firstTeam).toString()).subscribe( async resA => {
            this.restTeam.findTeam((this.match.secondTeam).toString()).subscribe( async resB => {
              matches[mat.order-1] = new myMatch(mat.id, mat.order, resA.name, resB.name, mat.ScoreA, mat.ScoreB, resA.id, resB.id); 
            });
          });
        }
      });
      matches.sort((a,b) => a.order - b.order);
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
    let order = 1;
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
      let counter = 0;
      for (let i = 0; i <= this.eightMatches.length; i+=2) {
        if(this.eightMatches[i]?.ScoreA != this.eightMatches[i]?.ScoreB 
          && this.eightMatches[i+1]?.ScoreA != this.eightMatches[i+1]?.ScoreB
          && !this.quarterMatches[counter]
          && this.quarterMatches[counter]?.ScoreA == this.quarterMatches[counter]?.ScoreB
          ){
          this.quarterMatches[counter] = new myMatch(0,0,"","",0,0,0,0);
          this.quarterMatches[counter].id = 0;
          if(this.eightMatches[i].ScoreA > this.eightMatches[i].ScoreB){
            this.quarterMatches[counter].TeamA = this.eightMatches[i].TeamA;
            this.quarterMatches[counter].idA = this.eightMatches[i].idA;
          }else if(this.eightMatches[i].ScoreA < this.eightMatches[i].ScoreB){
            this.quarterMatches[counter].TeamA = this.eightMatches[i].TeamB;
            this.quarterMatches[counter].idA = this.eightMatches[i].idB;
          }

          if(this.eightMatches[i+1].ScoreA > this.eightMatches[i+1].ScoreB){
            this.quarterMatches[counter].TeamB = this.eightMatches[i].TeamA;
            this.quarterMatches[counter].idB = this.eightMatches[i].idA;
          }else if(this.eightMatches[i+1].ScoreA < this.eightMatches[i+1].ScoreB){
            this.quarterMatches[counter].TeamB = this.eightMatches[i].TeamB;
            this.quarterMatches[counter].idB = this.eightMatches[i].idB;
          }
          this.quarterMatches[counter].ScoreA = 0;
          this.quarterMatches[counter].ScoreB = 0;
          let match = {
            tournamentId: parseInt(this.myParam),
            firstTeam: this.quarterMatches[counter].idA,
            secondTeam: this.quarterMatches[counter].idB,
            order: counter+1,
            date: new Date(),
          }

          this.restMatch.create(match).subscribe(res => {
            //this.quarterMatches[counter].id = res.id;
            this.spider.quarterfinals.push(res.id.toString());
            this.restTournaments.updateSchedule(this.spider).subscribe(() => {
              this.ngOnInit()}
              );
          });
        }
        counter++;
      }  
    }
    if(this.semiMatches){
      let counter = 0;
      for (let i = 0; i <= this.quarterMatches.length; i+=2) {
        if(this.quarterMatches[i]?.ScoreA != this.quarterMatches[i]?.ScoreB 
          && this.quarterMatches[i+1]?.ScoreA != this.quarterMatches[i+1]?.ScoreB
          && !this.semiMatches[counter]
          && this.semiMatches[counter]?.ScoreA == this.semiMatches[counter]?.ScoreB
          ){
          this.semiMatches[counter] = new myMatch(0,0,"","",0,0,0,0);
          if(this.quarterMatches[i].ScoreA > this.quarterMatches[i].ScoreB){
            this.semiMatches[counter].TeamA = this.quarterMatches[i].TeamA;
            this.semiMatches[counter].idA = this.quarterMatches[i].idA;
          }else if(this.quarterMatches[i].ScoreA < this.quarterMatches[i].ScoreB){
            this.semiMatches[counter].TeamA = this.quarterMatches[i].TeamB;
            this.semiMatches[counter].idA = this.quarterMatches[i].idB;
          }
          if(this.quarterMatches[i+1].ScoreA > this.quarterMatches[i+1].ScoreB){
            this.semiMatches[counter].TeamB = this.quarterMatches[i].TeamA;
            this.semiMatches[counter].idB = this.quarterMatches[i].idA;
          }else if(this.quarterMatches[i+1].ScoreA < this.quarterMatches[i+1].ScoreB){
            this.semiMatches[counter].TeamB = this.eightMatches[i].TeamB;
            this.semiMatches[counter].idB = this.quarterMatches[i].idB;
          }
          this.semiMatches[counter].ScoreA = 0;
          this.semiMatches[counter].ScoreB = 0;
          let match = {
            tournamentId: parseInt(this.myParam),
            firstTeam: this.semiMatches[counter].idA,
            secondTeam: this.semiMatches[counter].idB,
            order: counter+1,
            date: new Date(),
          }
          this.restMatch.create(match).subscribe(res => {
            //this.semiMatches[res.order-1].id = res.id;
            this.spider.semifinals.push(res.id.toString());
            this.restTournaments.updateSchedule(this.spider).subscribe(() => this.ngOnInit());
          });
        }
        counter++;
      }
    }
    if(this.final && this.bronze && this.semiMatches[0]?.TeamA && this.semiMatches[1]?.TeamA 
      && this.final[0]?.TeamA == "" && this.bronze[0]?.TeamA == ""
      && this.final[0]?.ScoreA == 0 && this.bronze[0]?.ScoreA == 0){
      this.final[0] = new myMatch(0,0,"","",0,0,0,0);
      this.bronze[0] = new myMatch(0,0,"","",0,0,0,0);
      if(this.semiMatches[0]?.ScoreA != this.semiMatches[0]?.ScoreB 
        && this.semiMatches[1]?.ScoreA != this.semiMatches[1]?.ScoreB){ 
        if(this.semiMatches[0].ScoreA > this.semiMatches[0].ScoreB){
          this.final[0].TeamA = this.semiMatches[0].TeamA;
          this.bronze[0].TeamA = this.semiMatches[0].TeamB;
          this.final[0].idA = this.semiMatches[0].idA;
          this.bronze[0].idA = this.semiMatches[0].idB;
        }else if(this.semiMatches[0].ScoreA > this.semiMatches[0].ScoreB){
          this.final[0].TeamA = this.semiMatches[0].TeamB;
          this.bronze[0].TeamA = this.semiMatches[0].TeamA;
          this.final[0].idA = this.semiMatches[0].idB;
          this.bronze[0].idA = this.semiMatches[0].idA;
        }
        if(this.semiMatches[1].ScoreA > this.semiMatches[1].ScoreB){
          this.final[0].TeamB = this.semiMatches[1].TeamA;
          this.bronze[0].TeamB = this.semiMatches[1].TeamB;
          this.final[0].idB = this.semiMatches[1].idA;
          this.bronze[0].idB = this.semiMatches[1].idB;
        }else if(this.semiMatches[1].ScoreA > this.semiMatches[1].ScoreB){
          this.final[0].TeamB = this.semiMatches[1].TeamB;
          this.bronze[0].TeamB = this.semiMatches[1].TeamA;
          this.final[0].idB = this.semiMatches[1].idB;
          this.bronze[0].idB = this.semiMatches[1].idA;
        }
          this.final[0].ScoreA = 0;
          this.final[0].ScoreB = 0;
          this.bronze[0].ScoreA = 0;
          this.bronze[0].ScoreB = 0;
          let matchF = {
            tournamentId: parseInt(this.myParam),
            firstTeam: this.final[0].idA,
            secondTeam: this.final[0].idB,
            order: 1,
            date: new Date(),
          }
          this.restMatch.create(matchF).subscribe(resA => {
            //this.final[res.order].id = res.id;
            this.spider.final.push(resA.id.toString());
              let matchB = {
                tournamentId: parseInt(this.myParam),
                firstTeam: this.bronze[0].idA,
                secondTeam: this.bronze[0].idB,
                order: 1,
                date: new Date(),
              }
              this.restMatch.create(matchB).subscribe(res => {
                //this.final[res.order].id = res.id;
                this.spider.bronze.push(res.id.toString());
                this.restTournaments.updateSchedule(this.spider).subscribe(() => this.ngOnInit());
              });
          });
      }
  }
  if(this.v8 == true && this.v16 == false && this.v4 == false && this.v2 == false){
    if(this.bronze && this.quarterMatches[0]?.TeamA && this.quarterMatches[1]?.TeamA 
      && this.bronze[0]?.TeamA == "" && this.bronze[0]?.ScoreA == 0){
      this.bronze[0] = new myMatch(0,0,"","",0,0,0,0);
      if(this.quarterMatches[0]?.ScoreA != this.quarterMatches[0]?.ScoreB 
        && this.quarterMatches[1]?.ScoreA != this.quarterMatches[1]?.ScoreB){ 
        if(this.quarterMatches[0].ScoreA > this.quarterMatches[0].ScoreB){
          this.bronze[0].TeamA = this.quarterMatches[0].TeamB;
          this.bronze[0].idA = this.quarterMatches[0].idB;
        }else if(this.quarterMatches[0].ScoreA > this.quarterMatches[0].ScoreB){
          this.bronze[0].TeamA = this.quarterMatches[0].TeamA;
          this.bronze[0].idA = this.quarterMatches[0].idA;
        }
        if(this.quarterMatches[1].ScoreA > this.quarterMatches[1].ScoreB){
          this.bronze[0].TeamB = this.quarterMatches[1].TeamB;
          this.bronze[0].idB = this.quarterMatches[1].idB;
        }else if(this.quarterMatches[1].ScoreA > this.quarterMatches[1].ScoreB){
          this.bronze[0].TeamB = this.quarterMatches[1].TeamA;
          this.bronze[0].idB = this.quarterMatches[1].idA;
        }
          this.bronze[0].ScoreA = 0;
          this.bronze[0].ScoreB = 0;
         
          let matchB = {
            tournamentId: parseInt(this.myParam),
            firstTeam: this.bronze[0].idA,
            secondTeam: this.bronze[0].idB,
            order: 1,
            date: new Date(),
          }
          this.restMatch.create(matchB).subscribe(res => {
            //this.final[res.order].id = res.id;
            this.spider.bronze.push(res.id.toString());
            this.restTournaments.updateSchedule(this.spider).subscribe(() => this.ngOnInit());
          });
      }
  }
  }
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
		const dialog = this.dialog.open(MatchComponent, loginConfig);
    //dialog.backdropClick().subscribe(() =>  this.ngOnInit());
    dialog.afterClosed().subscribe(() =>  this.ngOnInit());
  }
}


