import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Tournament } from '../model/tournament';

const endpoint = 'http://localhost:5005/';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  constructor(private http: HttpClient, private router: Router) {}

  getTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(endpoint);
  }

  find(id:string): Observable<Tournament>{
    return this.http.get<Tournament>(endpoint + "tournament/" + id);
  }

  findByName(name:string):Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${endpoint}?name=${name}`);
  }

}
