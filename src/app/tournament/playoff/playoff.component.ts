import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Tournament } from 'src/app/model/tournament';
import { TournamentService } from 'src/app/shared/tournament.service';

@Component({
  selector: 'app-playoff',
  templateUrl: './playoff.component.html',
  styleUrls: ['./playoff.component.css']
})
export class PlayoffComponent implements OnInit {

  myParam!: string;
  tournament!: Tournament;
  constructor(private route: ActivatedRoute, private routerTournament:TournamentService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => this.myParam = params['id']);
    this.routerTournament.find(this.myParam).subscribe((response:Tournament) => {
      this.tournament = response;
    });
  }

}
