import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './user/profile/profile.component';
import { TeamsComponent } from './user/teams/teams.component';
import { TournamentsComponent } from './user/tournaments/tournaments.component';
import { InfoComponent } from './tournament/info/info.component';
import { PlayersComponent } from './tournament/players/players.component';
import { PlayoffComponent } from './tournament/playoff/playoff.component';
import { PlayerComponent } from './info/player/player.component';
import { TeamComponent } from './info/team/team.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdnTournamentTreeModule } from '@adonsio/adn-tournament';
import { NgTournamentTreeModule } from 'ng-tournament-tree/public-api';
import { Ver2Component } from './tournament_bracket/ver2/ver2.component';
import { UserManagerComponent } from './admin/user-manager/user-manager.component';
import { TournamentManagerComponent } from './admin/tournament-manager/tournament-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    TeamsComponent,
    TournamentsComponent,
    InfoComponent,
    PlayersComponent,
    PlayoffComponent,
    RegisterComponent,
    LoginComponent,
    PlayerComponent,
    TeamComponent,
    Ver2Component,
    UserManagerComponent,
    TournamentManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RegisterComponent, LoginComponent],
})
export class AppModule {}
