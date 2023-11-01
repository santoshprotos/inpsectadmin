import { Injectable } from '@angular/core';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { projectConstants } from 'src/app/app.constant';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleTimerService {
  private timer: any;
  private idleTime = 1200000; // Time in milliseconds (e.g., 20 minutes)

  constructor(
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private router: Router
  ) { }

  getCurrentRoutePath(): string {
    let currentRoute = this.router.routerState.snapshot.root;
    while (currentRoute.children && currentRoute.children.length) {
      currentRoute = currentRoute.children[0];
    }
    return currentRoute.routeConfig?.path || '';
  }

  public initTimer(): void {
    this.resetTimer();
    this.initListener();
  }

  private initListener(): void {
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'wheel'];
    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimer());
    });

    // Reset timer on navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.resetTimer());
  }

  private resetTimer(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // Perform the action when the session times out
      // E.g., logout the user, display a modal, etc.
      let urlPath = this.getCurrentRoutePath();
      if (urlPath !== '' && urlPath !== 'login') {
        this.globalErrorHandlerService.openErrorModal(
          projectConstants.ERR_SESSION_EXPIRED,
          projectConstants.LOGOUT
        );
      }
    }, this.idleTime);
  }
}
