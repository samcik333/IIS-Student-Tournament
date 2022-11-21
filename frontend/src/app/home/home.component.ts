import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { TournamentService } from '../shared/tournament.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  restTournament:TournamentService;
  tournaments:any = [];
  router:Router;

  constructor(restTournament:TournamentService, router:Router) {
    this.restTournament=restTournament;
    this.router=router;
  }

  async ngOnInit() {
    const tournaments$ = this.restTournament.getTournaments();
    this.tournaments = await lastValueFrom(tournaments$);
  }

  async info(id:string){
    this.router.navigate(["tournament", id]);
  }

}
