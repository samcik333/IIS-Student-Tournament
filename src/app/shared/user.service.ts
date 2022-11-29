import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/user';

const endpoint = `https://sjsquad.herokuapp.com/`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(endpoint + `users`);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(endpoint + `user/profile`, {
      withCredentials: true,
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(endpoint + 'user/' + id, {
      withCredentials: true,
    });
  }

  updateUser(data: any) {
    return this.http.patch<User>(endpoint + `user/profile`, data, {
      withCredentials: true,
    });
  }

  findByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${endpoint}users?username=${username}`);
  }

  deleteUser(username: string): Observable<User> {
    return this.http.delete<User>(endpoint + `user`, { body: { username } });
  }
}
