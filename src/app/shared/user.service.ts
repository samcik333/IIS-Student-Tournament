import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../model/user";

const baseUrl = `http://localhost:5005/`;

@Injectable({
	providedIn: "root",
})
export class UserService {
	constructor(private http: HttpClient, private router: Router) {}

	getUser(): Observable<User> {
		return this.http.get<User>(baseUrl + `user/profile`, {
			withCredentials: true,
		});
	}
	updateUser(data: any) {
		return this.http.patch<User>(baseUrl + `user/profile`, data, {
			withCredentials: true,
		});
	}
	getUserById(id:string):Observable<User> {
		return this.http.get<User>(baseUrl + "user/" + id, {withCredentials: true});
	}
}
