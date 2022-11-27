import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Team } from 'src/app/model/team';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  teamList: Array<Team> = [];
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
    this.teamList = await lastValueFrom(teams$);
  }

  createTeam() {
    this.teamService.create(this.teamForm.value).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  async info(id: number) {
    this.router.navigate(['team', id]);
  }

  deleteTeam(name: string) {
    this.teamService.delete(name).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }
}
