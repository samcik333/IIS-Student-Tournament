import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Team } from 'src/app/model/team';
import { Tournament } from 'src/app/model/tournament';
import { User } from 'src/app/model/user';
import { TournamentService } from 'src/app/shared/tournament.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  myParam!: string;
  users!: User;
  teams!: Team;
  tournament!: Tournament;
  constructor(private route: ActivatedRoute, private routerTournament:TournamentService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.myParam = params['id']);
    this.routerTournament.getParticipants(this.myParam).subscribe((response:any) => {
      console.log(response);
    });
  }

}
