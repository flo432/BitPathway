import { Component, OnInit } from '@angular/core';
import {User} from '../models/User';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService} from '../services/alert.service';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  submitted = false;
  returnUrl: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.user = new User();
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(){
    this.submitted = true;
    this.login();
  }

  login(){

    this.authenticationService.login(this.user.email, this.user.password)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(`Login failure. Error message: ${error.message}`, false);
          this.submitted = false;
        });
  }

}
