import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {GroupService} from '../../../services/group.service';
import {AlertService} from '../../../../services/alert.service';
import {User} from '../../../../models/User';
import {Group} from '../../../models/Group';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.css']
})
export class UserGroupsComponent implements OnInit {

  currentUser: User;
  user: User = new User();
  groups: Group[] = [];
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
    this.groupService.getUserGroups(this.currentUser._id).subscribe(
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

  deleteGroup(_id: string){
    let decision = window.confirm("This operation is permanent, are u sure?");
    if(decision == true){
      this.groupService.deleteGroup(_id)
        .subscribe(
          next => {
            this.alertService.success("Group removed.");
            for (let i = 0; i < this.groups.length; i++)
              if (this.groups[i]._id === _id) {
                this.groups.splice(i, 1);
                break;
              }
          },
          error => {
            this.alertService.error("Error while removing group.")
          }
        )
    }
  }
}
