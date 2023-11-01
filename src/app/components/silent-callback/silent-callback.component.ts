import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SigninResponse } from 'oidc-client-ts';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-silent-callback',
  templateUrl: './silent-callback.component.html',
  styleUrls: ['./silent-callback.component.scss'],
})
export class SilentCallbackComponent  implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.signinCallback(window.location.href)
      .then((signinResponse) => {
        if(signinResponse) {
          this.router.navigate([''])
        }
      })
  }

}
