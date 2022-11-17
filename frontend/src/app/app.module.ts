import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './user/profile/profile.component';
import { TeamsComponent } from './user/teams/teams.component';
import { TournamentsComponent } from './user/tournaments/tournaments.component';
import { TeamComponent } from './team/team.component';
import { InfoComponent } from './tournament/info/info.component';
import { PlayersComponent } from './tournament/players/players.component';
import { PlayoffComponent } from './tournament/playoff/playoff.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    TeamsComponent,
    TournamentsComponent,
    TeamComponent,
    InfoComponent,
    PlayersComponent,
    PlayoffComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatMenuModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
