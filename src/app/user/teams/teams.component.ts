import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Team } from 'src/app/model/team';
import { User } from 'src/app/model/user';
import { HelperService } from 'src/app/shared/helper.service';
import { LoginService } from 'src/app/shared/login.service';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  teamList: Array<Team> = [];
  router: Router;
  loggedUser!: User;

  teamForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    logo: new FormControl(''),
  });

  constructor(
    private teamService: TeamService,
    private loginService: LoginService,
    private helperService: HelperService,
    router: Router
  ) {
    this.router = router;
  }

  async ngOnInit() {
    this.loggedUser = this.loginService.loadUserFromLocalStorage();

    const teams$ = this.teamService.getTeams();
    this.teamList = await lastValueFrom(teams$);
  }

  createTeam() {
    this.teamService.create(this.teamForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.ngOnInit();
      },
      error: (e) => {
        console.log(e);
        this.helperService.openSnackBarWarn(e.error.message);
      },
    });
  }

  async info(id: number) {
    this.router.navigate(['team', id]);
  }

  deleteTeam(name: string) {
    this.teamService.delete(name).subscribe((res) => {
      console.log(res);
      this.helperService.openSnackBarSucc('Team ' + name + ' has been deleted');

      this.ngOnInit();
    });
  }
}
