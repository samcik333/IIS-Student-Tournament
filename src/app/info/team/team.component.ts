import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Team } from 'src/app/model/team';
import { User } from 'src/app/model/user';
import { HelperService } from 'src/app/shared/helper.service';
import { LoginService } from 'src/app/shared/login.service';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  myParam!: string;
  team!: Team;
  playerList: Array<User> = [];
  router: Router;
  owner!: string;
  teamData!: Team;
  loggedUser!: User;
  isMember!: boolean;

  teamForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    logo: new FormControl(''),
  });
  userForm: FormGroup = new FormGroup({
    username: new FormControl(''),
  });

  constructor(
    private teamService: TeamService,
    private loginService: LoginService,
    private helperService: HelperService,
    private route: ActivatedRoute,
    router: Router
  ) {
    this.router = router;
  }

  async ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => (this.myParam = params['id'])
    );
    this.teamService.findTeam(this.myParam).subscribe((response: Team) => {
      this.team = response;
      this.fillUpData(this.team);
    });

    this.loggedUser = this.loginService.loadUserFromLocalStorage();

    this.getOwner();
    this.showPlayers(this.myParam);
  }

  fillUpData(team: Team) {
    this.teamForm.patchValue({ name: this.team.name, logo: this.team.logo });
  }

  async showPlayers(id: string) {
    const players$ = this.teamService.getPlayers(id);
    this.playerList = await lastValueFrom(players$);
    if (this.playerList.some((e) => e.id === this.loggedUser.id)) {
      this.isMember = true;
    }
  }

  async getOwner() {
    this.teamService.getOwner(this.myParam).subscribe((res) => {
      res;
      this.owner = res.username;
    });
  }

  async userInfo(id: number) {
    this.router.navigate(['user', id]);
  }

  addPlayer() {
    this.teamService.addPlayer(this.myParam, this.userForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.ngOnInit();
      },
      error: (e) => {
        console.log(e);
        this.helperService.openSnackBarWarn(e.error.message);
      },
    });
    this.userForm.reset();
  }

  deletePlayer(username: string) {
    this.teamService.deletePlayer(this.myParam, username).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
  }

  leaveTeam(username: string) {
    this.teamService.deletePlayer(this.myParam, username).subscribe((res) => {
      console.log(res);
      this.ngOnInit();
    });
    this.router.navigate(['user/teams']);
  }

  updateTeam() {
    this.teamService.updateTeam(this.myParam, this.teamForm.value).subscribe({
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
}
