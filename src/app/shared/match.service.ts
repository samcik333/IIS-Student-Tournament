import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Match } from '../model/match';

const baseUrl = `https://sjsquad.herokuapp.com/`;

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private http: HttpClient, private router: Router) {}

  getMatch(id: string): Observable<Match> {
    return this.http.get<Match>(baseUrl + 'match/' + id);
  }

	create(match:any): Observable<Match>{
		return this.http.post<Match>(baseUrl + "match/create", match, {
			withCredentials: true,
		});
	}

	getAll(tournamentId:number):Observable<any>{
		return this.http.get<any>(baseUrl + "matches/" + tournamentId);
	}

	update(match: Match) {
		return this.http.put<any>(`${baseUrl}match/update`, match);
	}
}
