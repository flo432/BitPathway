import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Group, Member, Task} from '../../../models/Group';
import {GroupService} from '../../../services/group.service';
import {AlertService} from '../../../../services/alert.service';
import {User} from '../../../../models/User';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  currentUser: User;
  user: User = new User();
  isLoading = true;
  group: Group = new Group();
  member: Member = new Member();
  task: Task = new Task();

  constructor(
    private groupService: GroupService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getGroup(params['id']);
    });

    this.getUser();
  }

  getUser() {
    this.isLoading = true;
    this.userService.getUser(this.currentUser._id).subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.alertService.error(error);
      },
      () => {
        this.isLoading = false;
      }
    )
  }

  getGroup(id: string){
    this.groupService.getGroup(id).subscribe(
      data => {
        this.group = data;
      },
      error => {
        this.alertService.error(error);
      },
      () => {
        this.isLoading = false;
      }
    )
  }

  deleteMember(id: string){
    this.isLoading = true;
    this.member._id = id;
    let decision = window.confirm("This operation is permanent, are u sure?");
    if(decision == true){
      this.groupService.updateGroupMembers(this.group._id, this.member).subscribe(
        next => {
          this.alertService.success("success");
          for (let i = 0; i < this.group.members.length; i++)
            if (this.group.members[i]._id === id) {
              this.group.members.splice(i, 1);
              break;
            }
        },
        error => {
          this.alertService.error(error.message);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      )
    }
  }

  updateAbout(){
    this.isLoading = true;
    this.groupService.updateGroupAbout(this.group._id, {"title": this.group.title, "description": this.group.description}).subscribe(
      next => {
        this.alertService.success("success");
      },
      error => {
        this.alertService.error(error.message);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    )
  }

  addTask(){
    this.isLoading = true;

    this.groupService.updateGroupTasks(this.group._id, this.task).subscribe(
      next => {
        this.alertService.success("success adding task");
        this.group.tasks.push(this.task);
        this.task = new Task();
      },
      error => {
        this.alertService.error(error.message);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    )
  }

  deleteTask(id: string){
    this.isLoading = true;
    this.task._id = id;
    let decision = window.confirm("This operation is permanent, are u sure?");
    if(decision == true){
      this.groupService.removeGroupTask(this.group._id, this.task).subscribe(
        next => {
          this.alertService.success("success");
          for (let i = 0; i < this.group.tasks.length; i++)
            if (this.group.tasks[i]._id === id) {
              this.group.tasks.splice(i, 1);
              break;
            }
            this.task = new Task();
        },
        error => {
          this.alertService.error(error.message);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      )
    }
  }

}
