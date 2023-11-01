import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { APIResources, projectConstants,Modal, Screens } from 'src/app/app.constant';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { filter, Subscription } from 'rxjs';
import { LoginUser } from 'src/app/modals/loginUser.modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signInResponse: any;
  loginForm: FormGroup;
  stringValues: any = {};
  showPassword: boolean;
  submitted = false;
  loginResponse: any;
  loginUser: LoginUser;
  routerSubscription = new Subscription();
  shouldLoginScreenDisplay:boolean=true;

  constructor(public authService: AuthService, private dataStorageService: DataStorageService,
    private httpService: HttpWrapperService, private router: Router, private globalErrorHandlerService: GlobalErrorHandlerService,
    private commonService: CommonService
  ) {
    this.getPreLoginData();
    this.userStartUp();

    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        if (event.url.includes("login")) {
          this.authService.setHeader(false);
          let lastLoginId = await this.dataStorageService.getLocalData("lastLoginId");
          if (lastLoginId && lastLoginId !== "") {
            this.form.email.setValue(lastLoginId);
          }
        }
      })
  }

  async ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9](\.?[-a-zA-Z0-9_])*@[a-zA-Z0-9-]+(\.[a-zA-Z]+)+$/)]),
      password: new FormControl('', Validators.required)
    });
    this.dataStorageService.getLocalData("lastLoginId")
      .then((lastLoginId) => {
        if (lastLoginId && lastLoginId !== "") {
          this.loginForm.controls.email.setValue(lastLoginId);
        }
      });
    this.commonService.loadScript();
  }

  get form() { return this.loginForm.controls; }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  async getPreLoginData() {
    try {
      const url = `${APIResources.preLogin}?isAdminApp=${true}`;
      const res: any = await this.httpService.get(url).toPromise();
      this.stringValues = this.commonService.getStringResources(res.stringResourceMaster, projectConstants.LOGIN);
      const getStringsFromLocalData = await this.dataStorageService.getLocalData("stringResources");
      if (!getStringsFromLocalData) {
        this.dataStorageService.setLocalData("stringResources", res.stringResourceMaster);
      }
      this.dataStorageService.setLocalData("systemSettings", res.systemSettingMaster);
    } catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }
  // SSO startup code 
  async userStartUp() {
    try {
      const accessToken = await this.authService.getAccessToken();
      const signInResponse = await this.dataStorageService.getLocalData("signInResponse");
      if (accessToken) {
        const isTokenValid = await this.authService.isAccessTokenValid();
        if (isTokenValid) {
          if (signInResponse?.id_token) {
            await this.authService.validateJWTToken(signInResponse?.id_token);
            this.router.navigate(["/tabs"]);
          } else {
            this.router.navigate(["/tabs"]);
          }
        } else {
          await this.dataStorageService.removeLocalData("accessToken");
          this.globalErrorHandlerService.openErrorModal(projectConstants.ERR_SESSION_EXPIRED);
        }
      } else if (!accessToken && signInResponse) {
        this.callLoginAPi(signInResponse);
      }
    } catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }

  nonSSOUserLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.callLoginAPi(null);
    }
  }

  async callLoginAPi(user: any) {
    try {
      this.loginUser = new LoginUser();
      if (user === null) {
        this.loginUser.loginname = this.form.email.value;
        this.loginUser.password = btoa(this.form.password.value);
      } else {
        this.loginUser.ssoToken = user.id_token;
        this.shouldLoginScreenDisplay=false;
      }
      const result: any = await this.httpService.post(APIResources.Login, this.loginUser).toPromise();
      await Promise.all([
        this.dataStorageService.setLocalData("accessToken", result.accessToken),
        this.dataStorageService.setLocalData("tokenExpiryDateEpoch", result.tokenexpirydateepoch),
        this.dataStorageService.setLocalData("loggedInUserDetails", result.myDetails),
        this.dataStorageService.setLocalData("myRoles", result.myRole),
        this.dataStorageService.setLocalData("stringResources", result.stringResourceMaster),
        this.dataStorageService.setLocalData("scheduleFrequency", result.scheduleFrequencyMaster),
        this.dataStorageService.setLocalData("myDivision", result.mydivision),
        this.dataStorageService.setLocalData("myBusiness", result.mybusiness),
        this.dataStorageService.setLocalData("myFacility", result.myfacility),
        this.dataStorageService.setLocalData("languageMaster", result.languageMaster),
        this.dataStorageService.setLocalData("systemSettings", result.systemSettingMaster),
        this.dataStorageService.setLocalData("roleMaster", result.roleMaster),
        this.dataStorageService.setLocalData("loginUserRole", result.basicroles),
        this.dataStorageService.setLocalData("userCategoryMaster", result.userCategoryMaster)
      ]);
      if (this.loginUser.ssoToken === '') {
        await this.dataStorageService.setLocalData("lastLoginId", result.myDetails.loginname);
        await this.dataStorageService.removeLocalData("signInResponse");
      } else {
        await this.dataStorageService.setLocalData("lastLoginId", "");
      }
      await this.router.navigate([`/tabs`]);
      this.authService.setHeader(true);
      this.loginForm.reset();
      this.submitted = false;
    } catch (err) {
      const signInResponse = await this.dataStorageService.getLocalData("signInResponse");
      if (signInResponse) {
        this.dataStorageService.removeLocalData("signInResponse");
      }
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  forgotPassword(){
    this.commonService.openMessageModal(Modal.FORGOT_PWD_MSG, Screens.LOGIN, Modal.FORGOT_PASSWORD)
  }

}
