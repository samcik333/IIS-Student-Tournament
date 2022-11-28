import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../model/team';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';

const endpoint = `http://localhost:5005/`;

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClient, private router: Router) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(endpoint + `teams`, { withCredentials: true });
  }

  getOwnedTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(endpoint + `ownedTeams`, {
      withCredentials: true,
    });
  }

  getPlayers(id: string): Observable<User[]> {
    return this.http.get<User[]>(endpoint + `teamPlayerList/` + id);
  }

  getOwner(id: string): Observable<User> {
    return this.http.get<User>(endpoint + `teamOwner/` + id);
  }

  addPlayer(id: string, data: any): Observable<any> {
    return this.http.post(endpoint + `teamAddPlayer/` + id, data, {
      withCredentials: true,
    });
  }

  updateTeam(id: string, data: any): Observable<any> {
    return this.http.put(endpoint + `team/` + id, data, {
      withCredentials: true,
    });
  }

  deletePlayer(id: string, username: string): Observable<any> {
    return this.http.delete(endpoint + 'teamDelPlayer/' + id, {
      body: { username },
      withCredentials: true,
    });
  }

  create(data: any): Observable<any> {
    return this.http.post(endpoint + `teams`, data, { withCredentials: true });
  }

  findTeam(id: string): Observable<Team> {
    return this.http.get<Team>(endpoint + 'team/' + id);
  }

  findUser(id: string): Observable<User> {
    return this.http.get<User>(endpoint + 'teamPlayer/' + id);
  }

  delete(name: string): Observable<any> {
    return this.http.delete(endpoint + 'teams', {
      body: { name },
      withCredentials: true,
    });
  }
}
