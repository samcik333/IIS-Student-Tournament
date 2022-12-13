import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import {Bracket} from "../model/bracket";
import {Team} from "../model/team";
import {Tournament} from "../model/tournament";
import {User} from "../model/user";

const endpoint = `http://localhost:5005/`;

const httpOptions = {
	headers: new HttpHeaders({
		"Content-Type": "application/json",
		"Access-Control-Allow-Headers": "Origin",
	}),
};

@Injectable({
	providedIn: "root",
})
export class TournamentService {
	constructor(private http: HttpClient, private router: Router) {}

	getTournaments(): Observable<Tournament[]> {
		return this.http.get<Tournament[]>(endpoint, {
			headers: httpOptions.headers,
		});
	}

	getTournamentsByOwner(): Observable<Tournament[]> {
		return this.http.get<Tournament[]>(endpoint + "user/tournaments", {
			withCredentials: true,
			headers: httpOptions.headers,
		});
	}

	find(id: string): Observable<Tournament> {
		return this.http.get<Tournament>(endpoint + "tournament/" + id, {
			headers: httpOptions.headers,
		});
	}

	findByName(name: string): Observable<Tournament[]> {
		return this.http.get<Tournament[]>(`${endpoint}?name=${name}`, {
			headers: httpOptions.headers,
		});
	}

	getParticipants(id: string): Observable<any[]> {
		return this.http.get<any[]>(`${endpoint}participants?id=${id}`, {
			headers: httpOptions.headers,
		});
	}

	delete(id: string, ownerId: number) {
		return this.http.delete(
			endpoint + `user/tournaments?id=${id}&owner=${ownerId}`,
			{headers: httpOptions.headers}
		);
	}

	create(data: any) {
		return this.http.post(endpoint + "tournaments", data, {
			withCredentials: true,
			headers: httpOptions.headers,
		});
	}

	updateState(id: number) {
		return this.http.put(
			endpoint + "tournamentState/" + id,
			"",
			httpOptions
		);
	}

	deleteByAdmin(id: number) {
		return this.http.delete(endpoint + "tournament/" + id, httpOptions);
	}

	getBracket(id: string) {
		return this.http.get<Bracket>(`${endpoint}bracket?id=${id}`, {
			headers: httpOptions.headers,
		});
	}

	updateSchedule(bracket: any) {
		return this.http.put<any>(
			`${endpoint}bracket/update`,
			bracket,
			httpOptions
		);
	}

	update(data: any, tourId: number) {
		return this.http.patch(
			endpoint + `user/tournaments?id=${tourId}`,
			data,
			httpOptions
		);
	}

	addPlayer(tournamentId: number): Observable<User> {
		return this.http.post<User>(
			endpoint + `tournamentAddPlayer/` + tournamentId,
			"",
			{withCredentials: true, headers: httpOptions.headers}
		);
	}

	addTeam(tournamentId: number, teamId: string): Observable<Team> {
		return this.http.post<Team>(
			endpoint + `tournamentAddTeam/` + tournamentId,
			{teamId, headers: httpOptions.headers}
		);
	}
	deleteTeam(tournamentId: number, teamId: number): Observable<Team> {
		return this.http.delete<Team>(
			endpoint + `tournamentDelTeam/` + tournamentId,
			{body: {teamId}, headers: httpOptions.headers}
		);
	}
	deleteUser(tournamentId: number, userId: number): Observable<User> {
		return this.http.delete<User>(
			endpoint + `tournamentDelUser/` + tournamentId,
			{body: {userId}, headers: httpOptions.headers}
		);
	}

	isParticipant(tournamentId: number, partId:number, type:number): Observable<boolean> {
		return this.http.get<boolean>(
			endpoint + `isParticipant/` + tournamentId + "/" + partId + "/" + type,
			httpOptions
		);
	}
}
