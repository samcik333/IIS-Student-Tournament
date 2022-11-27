import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from 'express';
import { Observable } from 'rxjs';
import { Match } from '../model/match';

const baseUrl = `http://localhost:5005/`;

@Injectable({
  providedIn: 'root'
})

export class MatchService {

  constructor(private http: HttpClient, private router: Router) {}

	getMatch(id:string): Observable<Match> {
		return this.http.get<Match>(baseUrl + "match/" + id, { withCredentials: true });
	}
}
