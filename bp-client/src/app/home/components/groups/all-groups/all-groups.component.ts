import { Component, OnInit } from '@angular/core';
import {User} from '../../../../models/User';
import {UserService} from '../../../../services/user.service';
import {GroupService} from '../../../services/group.service';
import {Group} from '../../../models/Group';
import {AlertService} from '../../../../services/alert.service';

@Component({
  selector: 'app-all-groups',
  templateUrl: './all-groups.component.html',
  styleUrls: ['./all-groups.component.css']
})
export class AllGroupsComponent implements OnInit {

  currentUser: User;
  user: User = new User();
  groups: Group[] = [];
  isLoading = true;
  member: Object;

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getUser();
    this.getGroups();
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

  getGroups(){
    this.isLoading = true;
    this.groupService.getGroups().subscribe(
      data => {
        this.groups = data;
      },
      error => {
        this.alertService.error(error);
      },
      () => {
        this.isLoading = false;
      }
    )
  }

  joinGroup(id: string){
    console.log(`gr id: ${id}`);
    this.isLoading = true;
    this.member = {
      _id: this.user._id,
      name: this.user.first_name + " "+ this.user.last_name,
      email: this.user.email
    };

    this.groupService.joinGroup(id, this.member).subscribe(
      next => {
        this.alertService.success("You have joined group.")
      },
      error => {
        this.isLoading = false;
        this.alertService.error(`Error while joining. ${error.message}`);
      },
      () => {
        this.isLoading = false;
      }
    )
  }
}
