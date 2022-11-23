import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Team } from 'src/app/model/team';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  teams: any = [];

  team: Team = {
    id: 1,
    ownerId: 1,
    name: '',
    capacity: 0,
    logo: '',
    gold: 0,
    silver: 0,
    bronze: 0,
    numberOfGames: 0,
    numberOfWins: 0,
  };

  constructor(private teamService: TeamService) {}

  async ngOnInit() {
    const teams$ = this.teamService.getTeams();
    this.teams = await lastValueFrom(teams$);
  }

  createTeam() {}
}
