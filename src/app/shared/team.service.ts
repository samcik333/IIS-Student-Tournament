import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Team} from "../model/team";
import {User} from "../model/user";
import {environment} from "src/environments/environment";

const endpoint = `http://localhost:5005/`;

const httpOptions = {
	headers: new HttpHeaders({
	  'Content-Type': 'application/json',
	  'Access-Control-Allow-Headers': 'x-access-token'
	})
  };

@Injectable({
	providedIn: "root",
})
export class TeamService {
	constructor(private http: HttpClient, private router: Router) {}

	getTeams(): Observable<Team[]> {
		return this.http.get<Team[]>(endpoint + `teams`, {
			withCredentials: true, headers:httpOptions.headers
		});
	}

	getOwnedTeams(): Observable<Team[]> {
		return this.http.get<Team[]>(endpoint + `ownedTeams`, {
			withCredentials: true, headers:httpOptions.headers
		});
	}

	getPlayers(id: string): Observable<User[]> {
		return this.http.get<User[]>(endpoint + `teamPlayerList/` + id, {headers:httpOptions.headers});
	}

	getOwner(id: string): Observable<User> {
		return this.http.get<User>(endpoint + `teamOwner/` + id, {headers:httpOptions.headers});
	}

	addPlayer(id: string, data: any): Observable<any> {
		return this.http.post(endpoint + `teamAddPlayer/` + id, data, {
			withCredentials: true, headers:httpOptions.headers
		});
	}

	updateTeam(id: string, data: any): Observable<any> {
		return this.http.put(endpoint + `team/` + id, data, {
			withCredentials: true, headers:httpOptions.headers
		});
	}

	deletePlayer(id: string, username: string): Observable<any> {
		return this.http.delete(endpoint + "teamDelPlayer/" + id, {
			body: {username},
			withCredentials: true, headers:httpOptions.headers
		});
	}

	create(data: any): Observable<any> {
		return this.http.post(endpoint + `teams`, data, {
			withCredentials: true, headers:httpOptions.headers
		});
	}

	findTeam(id: string): Observable<Team> {
		return this.http.get<Team>(endpoint + "team/" + id, {headers:httpOptions.headers});
	}

	findUser(id: string): Observable<User> {
		return this.http.get<User>(endpoint + "teamPlayer/" + id, {headers:httpOptions.headers});
	}

	delete(name: string): Observable<any> {
		return this.http.delete(endpoint + "teams", {
			body: {name},
			withCredentials: true, headers:httpOptions.headers
		});
	}
}
