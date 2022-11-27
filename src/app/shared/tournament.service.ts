import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import { Bracket } from "../model/bracket";
import {Tournament} from "../model/tournament";

const endpoint = `http://localhost:5005/`;
@Injectable({
	providedIn: "root",
})
export class TournamentService {
	constructor(private http: HttpClient, private router: Router) {}

	getTournaments(): Observable<Tournament[]> {
		return this.http.get<Tournament[]>(endpoint);
	}

	find(id: string): Observable<Tournament> {
		return this.http.get<Tournament>(endpoint + "tournament/" + id);
	}

	findByName(name: string): Observable<Tournament[]> {
		return this.http.get<Tournament[]>(`${endpoint}?name=${name}`);
	}

	getParticipants(id: string): Observable<any[]> {
		return this.http.get<any[]>(`${endpoint}participants?id=${id}`);
	}
	create(data: any) {
		console.log(data);
		return this.http.post(endpoint + "tournaments", data, {
			withCredentials: true,
		});
	}

	getBracket(id:string){
		return this.http.get<Bracket>(`${endpoint}bracket?id=${id}`);
	}
}
