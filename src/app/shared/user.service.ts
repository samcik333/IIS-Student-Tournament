import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
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
export class UserService {
	constructor(private http: HttpClient, private router: Router) {}

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(endpoint + `users`, {
			headers: httpOptions.headers,
		});
	}

	getUser(): Observable<User> {
		return this.http.get<User>(endpoint + `user/profile`, {
			withCredentials: true,
			headers: httpOptions.headers,
		});
	}

	getUserById(id: string): Observable<User> {
		return this.http.get<User>(endpoint + "getuser/" + id, {
			withCredentials: true,
			headers: httpOptions.headers,
		});
	}

	updateUser(data: any) {
		return this.http.patch<User>(endpoint + `user/profile`, data, {
			withCredentials: true,
			headers: httpOptions.headers,
		});
	}

	findByUsername(username: string): Observable<User[]> {
		return this.http.get<User[]>(`${endpoint}users?username=${username}`, {
			headers: httpOptions.headers,
		});
	}

	deleteUser(username: string): Observable<User> {
		return this.http.delete<User>(endpoint + `user`, {
			body: {username},
			headers: httpOptions.headers,
		});
	}
}
