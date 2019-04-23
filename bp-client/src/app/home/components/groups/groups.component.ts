import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../../services/alert.service';
import {User} from '../../../models/User';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  currentUser: User;
  user: User = new User();
  isLoading = true;


  constructor(
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

}
