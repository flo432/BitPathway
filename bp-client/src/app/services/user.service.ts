import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {User} from '../models/User';

import { Observable } from 'rxjs';
import {catchError, tap } from 'rxjs/operators';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

  private usersUrl = 'http://localhost:3000/api/users';  // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(next => {

        }),
        catchError(UserService.handleError)
      );
  }

  getUser(_id: string): Observable<User> {

    return this.http.get<User>(this.usersUrl + `/${_id}`)
      .pipe(
        tap(
          next => {

          }
        ),
        catchError(UserService.handleError)
      )
  }

  deleteUser(_id: string): Observable<User> {
    return this.http.delete<User>(this.usersUrl + `/${_id}`)
      .pipe(
        tap(
          next => {

          }
        ),
        catchError(UserService.handleError)
      )
  }


  updateUser (user: User): Observable<User> {
    return this.http.put<User>(this.usersUrl, user, this.httpOptions)
      .pipe(
        tap( _ => console.log(`updated user id= ${user._id}`)),
        catchError(UserService.handleError)
      );
  }


  addUser (user: User):Observable<User> {
    return this.http
      .post<User>(this.usersUrl + `/register`, user, this.httpOptions)
      .pipe(
        tap(
          next => {

          }
        ),
        catchError(UserService.handleError)
      )
  }


  private static handleError(error : HttpErrorResponse) {
    return Observable.throw(error);
  }

}
