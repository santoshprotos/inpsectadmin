import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, mergeMap, Observable, throwError } from 'rxjs';
import { projectConstants } from 'src/app/app.constant';
import { AuthService } from '../auth.service';
import { CommonService } from '../common.service';
import { DataStorageService } from '../data-storage.service';

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  constructor(private commonService: CommonService, private dataStorageService: DataStorageService, private authService: AuthService) { }
  skipUrls = ['https://ad.sonorasoftware.com/adfs/.well-known/openid-configuration'];
  anonymousAPI = ['PreLoginData', 'Account/Login'];
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {

    return from(this.dataStorageService.getLocalData('accessToken').then(
    )).pipe(mergeMap((accessToken: any): any => {

      let isTokenRequired = false;
      for (const skipUrl of this.anonymousAPI) {
        if (new RegExp(skipUrl).test(request.url)) {
          isTokenRequired = true;
        }
      }
      if (!isTokenRequired && !request.url.includes("json")) {
        request = this.setHeaders(request, accessToken);
      }


      let isUrlCheck = true;
      for (const skipUrl of this.skipUrls) {
        if (new RegExp(skipUrl).test(request.url)) {
          isUrlCheck = false;
        }
      }
      let url = '';

      if (this.commonService.config && isUrlCheck) {
        url = this.commonService.config.apiUrl + request.url;
      } else {
        url = request.url;
      }
      if (url.includes("json")) {
        url = request.url;
      }

      request = request.clone({
        url: url
      });

      if (accessToken && !url.includes("json")) {

        return from(this.authService.isAccessTokenValid().then())
          .pipe(mergeMap((valid: any): any => {
            if (!valid) {
              const errorResponse = new HttpErrorResponse({
                error: { ErrorCode: projectConstants.ERR_SESSION_EXPIRED },
                statusText: "SESSION_EXPIRED",
              })
              return throwError(() => errorResponse);
            }
            else {
              return next.handle(request);
            }
          }));
      }
      else {
        return next.handle(request).pipe(catchError((err: any): any => {
          if (err.status === 401 && !isTokenRequired) {
            if (!err?.error?.ErrorCode) {
              const errorResponse = new HttpErrorResponse({
                error: { ErrorCode: projectConstants.UNAUTHORIZED },
              })
              return throwError(() => errorResponse);
            } else {
              return throwError(() => err);
            }
          }
          else {
            return throwError(() => err);
          }
        }));
      }
    }))

  }

  private setHeaders(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    if (accessToken) {
      request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${accessToken}`) });
    }
    return request;
  }

}

