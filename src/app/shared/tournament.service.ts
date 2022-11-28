import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bracket } from '../model/bracket';
import { Team } from '../model/team';
import { Tournament } from '../model/tournament';
import { User } from '../model/user';

const endpoint = `http://localhost:5005/`;
@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  constructor(private http: HttpClient, private router: Router) {}

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(endpoint);
  }
  getTournamentsByOwner(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(endpoint + 'user/tournaments', {
      withCredentials: true,
    });
  }

  find(id: string): Observable<Tournament> {
    return this.http.get<Tournament>(endpoint + 'tournament/' + id);
  }

  findByName(name: string): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${endpoint}?name=${name}`);
  }

  getParticipants(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${endpoint}participants?id=${id}`);
  }

  delete(id: string, ownerId: number) {
    return this.http.delete(
      endpoint + `user/tournaments?id=${id}&owner=${ownerId}`
    );
  }

  create(data: any) {
    console.log(data);
    return this.http.post(endpoint + 'tournaments', data, {
      withCredentials: true,
    });
  }

  updateState(id: number) {
    return this.http.put(endpoint + 'tournamentState/' + id, '');
  }

  deleteByAdmin(id: number) {
    return this.http.delete(endpoint + 'tournament/' + id);
  }

  getBracket(id: string) {
    return this.http.get<Bracket>(`${endpoint}bracket?id=${id}`);
  }

  updateSchedule(bracket: Bracket) {
    return this.http.post(endpoint + 'schedule', bracket, {
      withCredentials: true,
    });
  }

  update(data: any, tourId: number) {
    return this.http.patch(endpoint + `user/tournaments?id=${tourId}`, data);
  }

  addPlayer(tournamentId: number): Observable<User> {
    return this.http.post<User>(
      endpoint + `tournamentAddPlayer/` + tournamentId,
      '',
      { withCredentials: true }
    );
  }

  addTeam(tournamentId: number, teamId: string): Observable<Team> {
    return this.http.post<Team>(
      endpoint + `tournamentAddTeam/` + tournamentId,
      { teamId }
    );
  }
}
