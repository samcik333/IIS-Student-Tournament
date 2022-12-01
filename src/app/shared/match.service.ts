import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Match} from "../model/match";

const baseUrl = `http://localhost:5005/`;

const httpOptions = {
	headers: new HttpHeaders({
		"Content-Type": "application/json",
		"Access-Control-Allow-Headers": "Origin",
	}),
};

@Injectable({
	providedIn: "root",
})
export class MatchService {
	constructor(private http: HttpClient, private router: Router) {}

	getMatch(id: string): Observable<Match> {
		return this.http.get<Match>(baseUrl + "match/" + id, {
			headers: httpOptions.headers,
		});
	}

	create(match: any): Observable<Match> {
		return this.http.post<Match>(baseUrl + "match/create", match, {
			withCredentials: true,
			headers: httpOptions.headers,
		});
	}

	getAll(tournamentId: number): Observable<any> {
		return this.http.get<any>(baseUrl + "matches/" + tournamentId, {
			headers: httpOptions.headers,
		});
	}

	update(match: Match) {
		return this.http.put<any>(`${baseUrl}match/update`, match, {
			headers: httpOptions.headers,
		});
	}
}
