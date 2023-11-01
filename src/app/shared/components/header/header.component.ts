import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common'
import { DataStorageService } from '../../services/data-storage.service';
import { filter, Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { Modal, projectConstants } from 'src/app/app.constant';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userAvatar: any;
  welcomeUser: any;
  loggedInUserDetails: any;
  userName: string;
  routerSubscription = new Subscription();
  isProcessing: boolean;
  stringValues:any = {};


  constructor(public authService: AuthService, private dataStorageService: DataStorageService, public router: Router,
    private commonService: CommonService) {

    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        this.dataStorageService.getLocalData('stringResources')
          .then((stringResources: any) => {
            if (stringResources) {
              this.stringValues = this.commonService.getStringResources(stringResources);
            }
          });
   
        this.dataStorageService.getLocalData("loggedInUserDetails")
          .then((user: any) => {
            if (user) {
              this.welcomeUser = `${this.stringValues['WELCOME']}, ${user['firstName']} ${user['lastName']}`;
              if (user.profileImage) {
                this.transform(user.profileImage);
              }
              else {
                let element = document.getElementById("userAvatar") as HTMLImageElement;
                if (element) {
                  element.src = "assets/images/User Default.svg"
                }

              }
            }
          });
      })

  }

  ngOnInit() { }
  transform(base64Img) {
    let element = document.getElementById("userAvatar") as HTMLImageElement;
    if (element) {
      element.src = 'data:image/jpg;base64,' + base64Img;
    }
  }

  onBackClick() {
    //this.location.back();
  }

  logout() {
    //  this.authService.logout();
    this.commonService.openMessageModal(projectConstants.LOGOUT_CONFIRMATION, null, Modal.CONFIRMATION);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
