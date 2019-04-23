import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AlertService} from '../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnDestroy {

  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) {
    // subscribe to alert messages
    this.subscription = alertService.getMessage().subscribe(message => { this.message = message; });
  }

  dispose(){
    this.alertService.dispose();
  }

  ngOnDestroy(): void {
    // unsubscribe on destroy to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
