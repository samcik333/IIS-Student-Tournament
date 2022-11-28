import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Route } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { myMatch } from 'src/app/interface/myMatch';
import { Bracket } from 'src/app/model/bracket';
import { Match } from 'src/app/model/match';
import { Team } from 'src/app/model/team';
import { Tournament } from 'src/app/model/tournament';
import { User } from 'src/app/model/user';
import { MatchService } from 'src/app/shared/match.service';
import { TeamService } from 'src/app/shared/team.service';
import { TournamentService } from 'src/app/shared/tournament.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-ver2',
  templateUrl: './ver2.component.html',
  styleUrls: ['./ver2.component.css'],
})
export class Ver2Component implements OnInit {
  contactForm!: FormGroup;
  v2: boolean = false;
  v4: boolean = false;
  v8: boolean = false;
  v16: boolean = false;
  render: boolean = false;
  popup: boolean = false;

  myParam!: string;
  tournament!: Tournament;
  match!: Match;
  userID!: number;
  participantA!: string;
  participantB!: string;
  TeamA!: Team;
  TeamB!: Team;
  UserA!: User;
  UserB!: User;
  participants!: any[];
  spider = new Bracket();

  eightMatches: Array<myMatch> = [];
  quarterMatches: Array<myMatch> = [];
  semiMatches: Array<myMatch> = [];
  final: Array<myMatch> = [];
  bronze: Array<myMatch> = [];

  constructor(
    public fb: FormBuilder,
    public restTournaments: TournamentService,
    public route: ActivatedRoute,
    public restMatch: MatchService,
    public restUser: UserService,
    public restTeam: TeamService
  ) {
    this.spider.eightfinals = [];
    this.spider.quarterfinals = [];
    this.spider.semifinals = [];
    this.spider.bronze = [];
    this.spider.final = [];
  }

  async ngOnInit(): Promise<void> {
    this.userID = parseInt(localStorage.getItem('userID') || '');
    ///Get Tournament by ID
    this.route.params.subscribe(
      (params: Params) => (this.myParam = params['id'])
    );
    this.restTournaments
      .find(this.myParam)
      .subscribe(async (response: Tournament) => {
        this.tournament = response;
      });

    ///Get TournamentBracket by IDofTournament
    const bracket$ = this.restTournaments.getBracket(this.myParam);
    this.spider = await lastValueFrom(bracket$);
    ///Get TournamentBracket by IDofTournament

    ///Generate spider depends on capacity
    this.generateTree(this.tournament.capacity.toString());
    ///Generate spider depends on capacity

    this.createBracketMatches(this.spider.eightfinals, this.eightMatches);
    this.createBracketMatches(this.spider.quarterfinals, this.quarterMatches);
    this.createBracketMatches(this.spider.semifinals, this.semiMatches);
    this.createBracketMatches(this.spider.bronze, this.bronze);
    this.createBracketMatches(this.spider.final, this.final);

    this.render = true;
    ///Get Tournament by ID
  }

  async createSchedule() {
    this.spider.quarterfinals = this.shuffle(this.spider.quarterfinals);
    this.restTournaments.updateSchedule(this.spider);
  }

  async createBracketMatches(spider_array: string[], matches: Array<myMatch>) {
    ///Generate BracketMatches
    if (spider_array.length > 0) {
      spider_array.forEach(async (element) => {
        const mat$ = this.restMatch.getMatch(element);
        this.match = await lastValueFrom(mat$);
        const scoreA = this.match.firstScore;
        const scoreB = this.match.secondScore;
        if (this.tournament.mode == 1) {
          const userA$ = this.restUser.getUserById(
            this.match.firstTeam.toString()
          );
          const userB$ = this.restUser.getUserById(
            this.match.secondTeam.toString()
          );
          this.UserA = await lastValueFrom(userA$);
          this.UserB = await lastValueFrom(userB$);
          this.participantA = this.UserA.username;
          this.participantB = this.UserB.username;
        } else {
          const teamA$ = this.restTeam.findTeam(
            this.match.firstTeam.toString()
          );
          const teamB$ = this.restTeam.findTeam(
            this.match.secondTeam.toString()
          );
          this.TeamA = await lastValueFrom(teamA$);
          this.TeamB = await lastValueFrom(teamB$);
          this.participantA = this.TeamA.name;
          this.participantB = this.TeamB.name;
        }
        let a: myMatch = {
          TeamA: this.participantA,
          TeamB: this.participantB,
          ScoreA: scoreA,
          ScoreB: scoreB,
        };
        matches.push(a);
      });
    }
  }

  generateSchedule() {}

  evaluate() {}

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
}
