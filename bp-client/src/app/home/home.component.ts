import { Component, OnInit } from '@angular/core';
import {User} from '../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector : 'app-home',
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  currentUser: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {

  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
