import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { response } from 'express';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = `http://localhost:5005/`;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {}

  public login(data: Object): Observable<Object> {
    return this.http.post(baseUrl + 'login', data, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
