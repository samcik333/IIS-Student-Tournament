import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './user/profile/profile.component';
import { TeamsComponent } from './user/teams/teams.component';
import { TournamentsComponent } from './user/tournaments/tournaments.component';
import { TeamComponent } from './team/team.component';
import { InfoComponent } from './tournament/info/info.component';
import { PlayersComponent } from './tournament/players/players.component';
import { PlayoffComponent } from './tournament/playoff/playoff.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/profile', component: ProfileComponent },
  { path: 'user/teams', component: TeamsComponent },
  { path: 'user/tournaments', component: TournamentsComponent },

  { path: 'team/profile', component: TeamComponent },

  { path: 'tournament/:id', component: InfoComponent },
  { path: 'tournament/players', component: PlayersComponent },
  { path: 'tournament/playoff', component: PlayoffComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
