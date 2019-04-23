import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../../../services/alert.service';
import {UserService} from '../../../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../../services/group.service';
import {User} from '../../../../models/User';
import {Group, Member, Project, Task} from '../../../models/Group';

@Component({
  selector: 'app-group-task',
  templateUrl: './group-task.component.html',
  styleUrls: ['./group-task.component.css']
})
export class GroupTaskComponent implements OnInit {

  currentUser: User;
  user: User = new User();
  group: Group;
  task: Task = new Task();
  isLoading = true;
  groupID: string;
  project: Project = new Project();

  member: Member;
  members: Member[];
  isAuthor: boolean = false;

  constructor(
    private alertService: AlertService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private userService: UserService)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getUser();
    this.route.params.subscribe(params => {
      this.getTask(params['id'], params['taskID']);
      this.getGroupMembers(params['id']);
      this.groupID = params['id'];
    });
  }

  getGroupMembers(id: string){
    this.isLoading = true;
    this.groupService.getGroupMembers(id).subscribe(
      data => {
        for (let i = 0; i < data.length; i++)
          if (data[i]._id === this.currentUser._id) {
            data.splice(i, 1);
            break;
          }
        this.members = data;
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

  getTask(groupId: string, taskId: string){
    this.isLoading = true;
    this.groupService.getGroupTask(groupId, taskId).subscribe(
      data => {
        this.task = data;
        console.log(this.task);
        this.checkIfAuthor(this.task);
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

  updateTask(){
    this.isLoading = true;
    this.groupService.updateGroupTask(this.groupID, this.task._id, {"title": this.task.title, "description": this.task.description}).subscribe(
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

  addMemberToProject(id: string){
    if(this.project.authors.length == 2){
      this.alertService.error("Other project authors is full.");
      return
    }else {
      for (let i = 0; i < this.members.length; i++)
        if (this.members[i]._id === id) {
          this.project.authors.push(this.members[i]);
          this.members.splice(i, 1);
          break;
        }
        this.project.authors.sort(function(a, b) {
          let nameA = a.name.toUpperCase();
          let nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
    }
  }

  removeMemberFromProject(id: string){
    for (let i = 0; i < this.project.authors.length; i++)
      if (this.project.authors[i]._id === id) {
        this.members.push(this.project.authors[i]);
        this.project.authors.splice(i, 1);
        break;
      }
    this.members.sort(function(a, b) {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  addProject(){
    this.isLoading = true;
    this.project.authors.push({_id: this.currentUser._id, name: this.currentUser.first_name + " " + this.currentUser.last_name, email: this.currentUser.email});
    this.groupService.addTaskProject(this.groupID, this.task._id, this.project._id, this.project).subscribe(
      next => {
        this.alertService.success("success");
        this.task.user_projects.push(this.project);
        this.isAuthor = true;
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

  checkIfAuthor(task: Task){
    for(let i=0; i<task.user_projects.length; i++){
      for(let j=0; j<task.user_projects[i].authors.length; j++){
        if(this.task.user_projects[i].authors[j]._id === this.currentUser._id){
          this.isAuthor = true;
          break;
        }
      }
    }
  }

}
