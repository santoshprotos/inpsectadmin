import { Component } from '@angular/core';
import { IdleTimerService } from './shared/services/idle-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private idleTimerService: IdleTimerService) {  
   }
   ngOnInit(): void {
    this.idleTimerService.initTimer();
  }
}
