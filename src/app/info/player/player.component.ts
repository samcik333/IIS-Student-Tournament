import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { TeamService } from 'src/app/shared/team.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  user!: User;
  myParam!: string;
  router: Router;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    router: Router
  ) {
    this.router = router;
  }

  async ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => (this.myParam = params['id'])
    );
    this.teamService.findUser(this.myParam).subscribe((response: User) => {
      this.user = response;
    });
  }
}
