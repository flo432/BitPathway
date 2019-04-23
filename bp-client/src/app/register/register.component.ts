import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {AlertService} from '../services/alert.service';
import {User} from '../models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;

  submitted = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.user = new User();
  }

  onSubmit(){
    this.submitted = true;
    this.register();
  }


  register(){

    if(this.user.email.match("@uj.edu.pl")){
      this.user.isTeacher = true;
    }

    this.userService.addUser(this.user)
      .subscribe(
        next => {
          this.submitted = true;
          this.alertService.success('Registration successful.', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(`Registration failure. Error message: ${error.message}`, false);
          this.submitted = false;
        }
      )
  }

}
