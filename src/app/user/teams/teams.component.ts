import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  teams: any = [];
  router: Router;

  teamForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    logo: new FormControl(''),
  });

  constructor(private teamService: TeamService, router: Router) {
    this.router = router;
  }

  async ngOnInit() {
    const teams$ = this.teamService.getTeams();
    this.teams = await lastValueFrom(teams$);
  }

  createTeam() {
    console.log(this.teamForm.value);

    this.teamService.create(this.teamForm.value).subscribe((result) => {
      console.log(result);
    });
  }

  info(id: number) {
    this.router.navigate(['team', id]);
  }
}
