import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, tap, map } from 'rxjs/operators';
import {User} from '../models/User';

@Injectable()
export class AuthenticationService {

  private usersUrl = 'http://localhost:3000/api/users';  // URL to web api

  constructor(private http: HttpClient) { }

  login(email: string, password: string) :Observable<any> {
    return this.http.post<any>(this.usersUrl + '/authenticate', { email: email, password: password})
      .pipe(
        tap( user => {
            // login successful if there's a jwt token in the response
            if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
            }

            return user;
        }),
        catchError(AuthenticationService.handleError)
      )
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  private static handleError(error : any) {
    return Observable.throw(error);
  }
}
