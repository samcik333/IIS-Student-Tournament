import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieOptions, response } from 'express';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { User } from '../model/user';

const baseUrl = `https://sjsquad.herokuapp.com/`;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userProfile: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: 0,
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    photo:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    role: 'user',
    gold: 0,
    silver: 0,
    bronze: 0,
    numberOfGames: 0,
    numberOfWins: 0,
  });

  private componentMethodCallSource = new Subject<any>();

  constructor(private http: HttpClient) {}

  public login(data: any): Observable<Object> {
    return this.http
      .post(baseUrl + 'login', data, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  public register(data: any): Observable<Object> {
    return this.http
      .post(baseUrl + 'register', data, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  profile(): Observable<User> {
    return this.http.get<User>(`${baseUrl}` + 'user/profile', {
      withCredentials: true,
    });
  }
  saveUserToLocalStorage(user: User) {
    this.userProfile.next(user);
    localStorage.setItem('user-profile', JSON.stringify(user));
    localStorage.setItem('userID', JSON.stringify(user.id));
  }

  logout() {
    return this.http.get(baseUrl + 'logout', { withCredentials: true });
  }

  loadUserFromLocalStorage(): User {
    if (this.userProfile.value.id == 0) {
      let fromLocalStorage = localStorage.getItem('user-profile');
      if (fromLocalStorage) {
        let userInfo = JSON.parse(fromLocalStorage);
        this.userProfile.next(userInfo);
      }
    }
    return this.userProfile.value;
  }
}
