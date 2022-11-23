import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../model/team';
import { environment } from 'src/environments/environment';

const baseUrl = environment.Base_Url;

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClient, private router: Router) {}

  getTeams(): Observable<Team> {
    return this.http.get<Team>(`${baseUrl}/teams`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/teams`, data);
  }
}