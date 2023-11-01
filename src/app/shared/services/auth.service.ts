import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { CreateSignoutRequestArgs, OidcClient, SigninResponse } from 'oidc-client-ts';
import { jwtVerify, createRemoteJWKSet, createLocalJWKSet } from 'jose';
import { Router } from '@angular/router';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { HttpWrapperService } from './Http-services/http-wrapper.service';
import { APIResources, projectConstants } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private m_displayHeader = false;
  settings: any;
  oidcClient: OidcClient;
  signInResponse: SigninResponse;

  constructor(
    private httpWrapperService: HttpWrapperService,
    private http: HttpClient,
    private dataStorageService: DataStorageService,
    private router: Router,
    private globalErrorHandlerService: GlobalErrorHandlerService
  ) {
    this.settings = {};
    this.dataStorageService.getLocalData('signInResponse').then((signInResponse) => {
      this.signInResponse = signInResponse;
    });
  }

  showHeader(): boolean {
    return this.m_displayHeader;
  }

  setHeader(value: boolean) {
    this.m_displayHeader = value;
  }

  async getAccessToken(): Promise<string> {
    return this.dataStorageService.getLocalData('accessToken');
  }

  async getTokenExpiry(): Promise<number> {
    return this.dataStorageService.getLocalData('tokenExpiryDateEpoch');
  }

  async isAccessTokenValid(): Promise<boolean> {
    const expiry = await this.getTokenExpiry();
    const validity = expiry * 1000 > Date.now();
    return validity;
  }

  async getSSOSettingsFromLocalStorage(): Promise<any> {
    const authority = await this.filterSystemSettings(projectConstants.AUTHORITY_URL);
    const client_id = await this.filterSystemSettings(projectConstants.CLIENT_ID);
    const redirect_uri = await this.filterSystemSettings(projectConstants.REDIRECT_URI);
    const authEndPoint = await this.filterSystemSettings(projectConstants.METADATA_AUTH_ENDPOINT);
    const post_logout_redirect_uri = await this.filterSystemSettings(projectConstants.POST_LOGOUT_URI);
    const metadata: any = {};
    if (authEndPoint) {
      metadata.authorization_endpoint = authEndPoint;
      metadata.end_session_endpoint = await this.filterSystemSettings(projectConstants.METADATA_ENDSESSION_ENDPOINT);
      metadata.token_endpoint = await this.filterSystemSettings(projectConstants.METADATA_TOKEN_ENDPOINT);
    }

    return {
      authority,
      client_id,
      redirect_uri,
      post_logout_redirect_uri,
      metadata
    };
  }

  async filterSystemSettings(key: string): Promise<any> {
    const settings: any[] = await this.dataStorageService.getLocalData('systemSettings');
    const setting = settings.find((s) => s.key === key)?.value;
    return setting;
  }

  async login(): Promise<void> {
    const settings = await this.getSSOSettingsFromLocalStorage();
    this.oidcClient = new OidcClient(settings);
    const signinRequest = await this.oidcClient.createSigninRequest({});
    window.location.href = signinRequest.url;
  }

  getSignInResponse(): SigninResponse {
    return this.signInResponse;
  }

  async signinCallback(url: string): Promise<SigninResponse> {
    const settings = await this.getSSOSettingsFromLocalStorage();
    this.oidcClient = new OidcClient(settings);
    this.signInResponse = await this.oidcClient.processSigninResponse(url);
    await this.dataStorageService.setLocalData('signInResponse', this.signInResponse);
    return this.signInResponse;
  }

  async validateJWTToken(jwt: string): Promise<any> {
    try {
      const authority = await this.filterSystemSettings('SSO_Authority_URL');
      const settings: any = await this.http.get(`${authority}/.well-known/openid-configuration`).toPromise();
      const jwks = createRemoteJWKSet(new URL(settings?.jwks_uri));
      const { payload, protectedHeader } = await jwtVerify(jwt, jwks, {
        issuer: this.settings.issuer,
        audience: this.settings.audience,
      });
      return payload;
    } catch (error) {
      await this.handleTokenValidationFailure();
      throw error;
    }
  }

  private async handleTokenValidationFailure(): Promise<void> {
    await this.dataStorageService.removeLocalData('signInResponse');
    this.globalErrorHandlerService.openErrorModal(projectConstants.ERR_SESSION_EXPIRED);
    this.router.navigate(['/login']);
  }

  public async logout() {
    this.signInResponse = await this.dataStorageService.getLocalData("signInResponse");
    if (this.signInResponse) {

      await this.getSSOSettingsFromLocalStorage().then(settings => {
        this.oidcClient = new OidcClient(settings);
      });
      let args: CreateSignoutRequestArgs = {
        id_token_hint: this.signInResponse.id_token,
        post_logout_redirect_uri: this.oidcClient.settings.post_logout_redirect_uri,
      }
      const signoutRequest = await this.oidcClient.createSignoutRequest(args);
      if(signoutRequest) {
        this.callLogoutApi(signoutRequest.url);
      }
    }
    else {
      this.callLogoutApi();
    }
  }

  async callLogoutApi(url?: any) {
    let isTokenValid = await this.isAccessTokenValid();
    if (isTokenValid) {
      this.httpWrapperService.delete(APIResources.logout).subscribe({
        next: (res: any) => {
          this.deleteTokensAndRedirect(url);
        },
        error: (err: any) => {
          this.globalErrorHandlerService.openErrorModal(projectConstants.ERR_SESSION_EXPIRED, projectConstants.LOGOUT);
        }
      });
    }
    else {
      this.globalErrorHandlerService.openErrorModal(projectConstants.ERR_SESSION_EXPIRED, projectConstants.LOGOUT);
    }
  }

  private async deleteTokensAndRedirect(url?: any): Promise<void> {
    await Promise.all([
      this.dataStorageService.removeLocalData("accessToken"),
      this.dataStorageService.removeLocalData('signInResponse'),
      this.dataStorageService.removeLocalData("tokenExpiryDateEpoch"),
      this.dataStorageService.removeLocalData("loggedInUserDetails"),
      this.dataStorageService.removeLocalData("myRoles"),
      this.dataStorageService.removeLocalData("scheduleFrequency"),
      this.dataStorageService.removeLocalData("myDivision"),
      this.dataStorageService.removeLocalData("myBusiness"),
      this.dataStorageService.removeLocalData("myFacility"),
      this.dataStorageService.removeLocalData("roleMaster"),
      this.dataStorageService.removeLocalData("languageMaster"),
      this.dataStorageService.removeLocalData("loginUserRole"),
      this.dataStorageService.removeLocalData("userCategoryMaster"),
      this.dataStorageService.removeLocalData("lastSelectedFacilityId"),
      this.dataStorageService.removeLocalData("lastSelectedDivisionId"),
      this.dataStorageService.removeLocalData("lastSelectedBusinessId"),
      // this.dataStorageService.removeLocalData("lastSelectedFacilityIdForFacility"),
      // this.dataStorageService.removeLocalData("lastSelectedDivisionIdForFacility"),
      // this.dataStorageService.removeLocalData("lastSelectedBusinessIdForFacility"),
      // this.dataStorageService.removeLocalData("lastSelectedFacilityIdForUsergroup"),
      // this.dataStorageService.removeLocalData("lastSelectedDivisionIdForUsergroup"),
      // this.dataStorageService.removeLocalData("lastSelectedBusinessIdForUsergroup")
    ]);
    if (url) {
      window.location.href = url;
    }
    else {
      await this.router.navigate(["/login"]);
    }
    this.setHeader(false);
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const accessToken = await this.dataStorageService.getLocalData('accessToken');
      return !!accessToken;
    } catch (err) {
      return false;
    }
  }
}



