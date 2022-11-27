import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Tournament } from 'src/app/model/tournament';
import { TournamentService } from 'src/app/shared/tournament.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  myParam!: string;
  tournament!: Tournament;
  constructor(
    private route: ActivatedRoute,
    private routerTournament: TournamentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => (this.myParam = params['id'])
    );
    this.routerTournament
      .find(this.myParam)
      .subscribe((response: Tournament) => {
        this.tournament = response;
      });
  }

  join(id:string){
    if(this.tournament.players == 1){
      console.log("Join user with id: " + id + " to the current tournament");
    }
    console.log("Join team with id: " + id + " to the current tournament");
  }



}
