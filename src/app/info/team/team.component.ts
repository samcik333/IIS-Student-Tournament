import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Team } from 'src/app/model/team';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  myParam!: string;
  team!: Team;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => (this.myParam = params['id'])
    );
    this.teamService.find(this.myParam).subscribe((response: Team) => {
      this.team = response;
    });
  }
}
