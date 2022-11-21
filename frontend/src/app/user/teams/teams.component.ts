import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  restTeam: TeamService;
  teams: any = [];

  constructor(restTeam: TeamService) {
    this.restTeam = restTeam;
  }

  async ngOnInit() {
    const teams$ = this.restTeam.getTeams();
    this.teams = await lastValueFrom(teams$);
  }
}
