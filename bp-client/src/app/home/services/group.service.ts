import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from '../../../../node_modules/rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Group, Member, Project, Task} from '../models/Group';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';

@Injectable()
export class GroupService {

  private groupsUrl = 'http://localhost:3000/api/groups';  // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.groupsUrl)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      );
  }

  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(this.groupsUrl + `/${id}`)
      .pipe(
        tap( next => {

          }),
        catchError(GroupService.handleError)
      );
  }

  getGroupMembers(id: string): Observable<Member[]> {
    return this.http.get<Member[]>(this.groupsUrl + `/members/${id}`)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      )
  }

  updateGroupAbout(id: string, about: Object): Observable<Object> {
    return this.http.put(this.groupsUrl + `/about/${id}`, about, this.httpOptions)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      );
  }

  updateGroupMembers(id: string, member: Member): Observable<Member> {
    return this.http.put<Member>(this.groupsUrl + `/remove-member/${id}`, member, this.httpOptions)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      )
  }

  updateGroupTasks(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(this.groupsUrl + `/tasks/${id}`, task, this.httpOptions)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      )
  }

  removeGroupTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(this.groupsUrl + `/remove-task/${id}`, task, this.httpOptions)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      )
  }

  getGroupTask(groupId: string, taskId: string): Observable<Task> {
    return this.http.get<Task>(this.groupsUrl + `/${groupId}/task/${taskId}`)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      )
  }

  updateGroupTask(groupID: string, taskID: string, task: Object): Observable<Object> {
    return this.http.put<Object>(this.groupsUrl + `/${groupID}/task/${taskID}`, task, this.httpOptions)
      .pipe(
        tap(next=> {

        }),
        catchError(GroupService.handleError)
      )
  }

  addTaskProject(groupID: string, taskID: string, projectID: string, project: Project):Observable<Project>{
    return this.http.put<Project>(this.groupsUrl + `/${groupID}/task/${taskID}/project/${projectID}`, project, this.httpOptions)
      .pipe(
        tap(next => {
          console.log(next);
        }),
        catchError(GroupService.handleError)
      )
  }

  getUserGroups(_id: string): Observable<Group[]> {
    return this.http.get<Group[]>(this.groupsUrl + `/user/${_id}`, this.httpOptions)
      .pipe(
        tap(next => {

        }),
        catchError(GroupService.handleError)
      );
  }

  addGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.groupsUrl, group, this.httpOptions)
      .pipe(
        tap(
          next => {

          }
        ),
        catchError(GroupService.handleError)
      );
  }

  joinGroup(_id: string, member: Object): Observable<Group> {
    return this.http.put<Group>(this.groupsUrl + `/member/${_id}`, member, this.httpOptions)
      .pipe(
        tap(
          next => {

          },
          error =>{
            console.log(error);
          }
        ),
        catchError(GroupService.handleError)
      )
  }

  deleteGroup(_id: string): Observable<Group> {
    return this.http.delete<Group>(this.groupsUrl + `/${_id}`)
      .pipe(
        tap(
          next => {

          }
        ),
        catchError(GroupService.handleError)
      )
  }


  private static handleError(error : HttpErrorResponse) {
    return Observable.throw(error);
  }
}
