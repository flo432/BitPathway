import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/User';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../services/alert.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser: User;
  user: User;
  isLoading = true;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private authSerive: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.userService.getUser(this.currentUser._id)
      .subscribe(
        next => {
          this.user = next;
        },
        error => {
          this.alertService.error(error);
        },
        () => {
          this.isLoading = false;
        }
      );
  }


  onSubmit(){
    this.isLoading = true;
    this.user._id = this.currentUser._id;
    this.userService.updateUser(this.user)
      .subscribe(
        next => {

          this.alertService.success("User data updated.");
        },
        error =>{

          this.alertService.error(`Error while updating. ${error}`);
        },
        () => {
          this.isLoading = false;
        }
      )
  }

  goBack(): void {
    this.location.back();
  }

  deleteUser(){

    let decision = window.confirm("This operation is permanent, are u sure?");
    if(decision == true){
      this.userService.deleteUser(this.currentUser._id)
        .subscribe(
          next => {
            this.authSerive.logout();
            this.router.navigate(['/login']);
            this.alertService.success("User profile removed.", true);

          },
          error => {
            this.alertService.error("Error while deleting profile.")
          },
          () => {
          }
        )
    }

  }

}
