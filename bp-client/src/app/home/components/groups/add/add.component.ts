import { Component, OnInit } from '@angular/core';
import {User} from '../../../../models/User';
import {UserService} from '../../../../services/user.service';
import {AlertService} from '../../../../services/alert.service';
import {GroupService} from '../../../services/group.service';
import {Group} from '../../../models/Group';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  currentUser: User;
  user: User = new User();
  group: Group = new Group();
  isLoading = true;


  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
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

  addGroup(){
    this.isLoading = true;
    this.group.owner = this.user._id;
    this.group.owner_name = this.user.first_name + " " + this.user.last_name;
    this.group.owner_email = this.user.email;
    console.log(this.group);

    this.groupService.addGroup(this.group).subscribe(
      next => {
        this.group = new Group();
        this.alertService.success("Group added.")
      },
      error => {
        this.alertService.error(error);
      },
      () => {
        this.isLoading = false;
      }
    )
  }

}
