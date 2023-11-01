
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LoggerService } from './logger.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorPopupComponent } from '../popups/components/error-popup/error-popup.component';
import { DataStorageService } from './data-storage.service';
import { APIResources, CommonMessage, projectConstants } from 'src/app/app.constant';
import { CommonService } from './common.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class GlobalErrorHandlerService implements ErrorHandler {
  private modalInstance = false;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private dataStorageService: DataStorageService,
    private commonService: CommonService,
    private router: Router,
    private httpClient: HttpClient,
    private loggerService: LoggerService
  ) { }

  /**
   * The default implementation of `handleError` prints error messages to the `console`. To
   * appropriate for your app.
   * @param error  Object of error
   */

  handleError(error: any) {
    // let clientError = null;
    // if (error.stack) {
    //   const { fileName, lineNumber } = this.extractErrorLocation(error?.stack);
    //     clientError = new ErrorEvent('Client-side error', {
    //     message: error.message,
    //     filename: fileName,
    //     lineno: lineNumber
    //   });
    // }
    // const objError = { error: clientError };
    if (error.error instanceof ErrorEvent) {
      // client-side error
      //Log Error     
      // this.loggerService.error(objError);
      const errorMessage = `Error: ${error?.error?.message}`;
      return throwError(() => new Error(errorMessage));
    } else {
      // server-side error
      if(error?.error?.status === 400) { 
        return throwError(() => new Error(projectConstants.ERR_BAD_REQUEST));
      }
      return throwError(() => new Error(error?.error?.ErrorCode));
    }
  }

  async openErrorModal(code?: any, pageName?: any) {
    if (code !== projectConstants.UNAUTHORIZED) {
      if (!this.modalInstance) {
        this.modalInstance = true;
        const msg = await this.getStringResources(code);
        const initialState = {
          message: !msg ? CommonMessage.COMMON_ERROR : msg,
          errorCode: code,
          pageName: pageName
        };
        this.modalRef = this.modalService.show(ErrorPopupComponent, {
          class: 'modal-dialog-centered modal-error',
          backdrop: false,
          ignoreBackdropClick: true,
          initialState,
        });
      }
    }
    else {
      this.modalService.hide();
      this.router.navigate(['/login']);
    }
  }

  hideErrorModal(errorCode?: any, pageName?: any) {
    this.modalInstance = false;
    if (errorCode === projectConstants.ERR_SESSION_EXPIRED || pageName === projectConstants.LOGOUT) {
      this.logout();
    }
    if (this.modalService.getModalsCount() > 1 && errorCode === projectConstants.ERR_SESSION_EXPIRED) {
      this.modalService.hide();
    } else {
      this.modalRef.hide();
    }
  }

  extractErrorLocation(stackTrace: string): { fileName: string, lineNumber: number } {
    const stackLines = stackTrace.split('\n');
    const match = /\s+at\s+(.+):(\d+):(\d+)/.exec(stackLines[1]);
    if (match) {
      const [, fileName, lineNumberStr] = match;
      const lineNumber = parseInt(lineNumberStr, 10);
      return { fileName, lineNumber };
    }
    return { fileName: '', lineNumber: -1 };
  }

  // Get data in localStorage to get error message string
  async getStringResources(errorCode: any): Promise<string | null> {
    try {
      const getStringValues = await this.dataStorageService.getLocalData("stringResources");
      if (getStringValues) {
        const stringValues = this.commonService.getStringResources(getStringValues, null);
        return stringValues[errorCode];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async deleteTokensAndRedirect() {
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
    ]);
    await this.router.navigate(["/login"]);
  }

  async logout() {
    try {
      await this.delete(APIResources.logout).toPromise();
      this.deleteTokensAndRedirect();
    } catch (err) {
      // Due to the infinite loop, we directly navigate to the login page
      this.deleteTokensAndRedirect();
    }
  }

  delete(url: string, headers?: any, responseType?: any): Observable<any> {
    return this.httpClient.delete(url, {
      headers: headers,
      responseType: responseType,
    }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }


}