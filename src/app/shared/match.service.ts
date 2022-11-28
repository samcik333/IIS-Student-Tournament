import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Match } from '../model/match';

const baseUrl = `http://localhost:5005/`;

@Injectable({
  providedIn: 'root'
})

export class MatchService {

  constructor(private http: HttpClient, private router: Router) {}

	getMatch(id:string): Observable<Match> {
		return this.http.get<Match>(baseUrl + "match/" + id);
	}

	create(match:any):Observable<any>{
		return this.http.post(baseUrl + "match/create", match, {
			withCredentials: true,
		});
	}
}
