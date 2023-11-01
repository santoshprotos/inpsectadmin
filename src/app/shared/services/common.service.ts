import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { APIResources, CommonMessage } from 'src/app/app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonMessageComponent } from '../popups/components/common-message/common-message.component';
import { Subject } from 'rxjs/internal/Subject';
import { HttpWrapperService } from './Http-services/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  config: any;
  private isSuperAdmin = new Subject<boolean>();
  private isUserFormSubmit = new Subject<boolean>();
  private isRoleAndLevelForm = new Subject<boolean>();
  private isSaveUpdate = new Subject<boolean>();
  private deleteFormAssignmentSubject = new Subject<boolean>();
  private refreshSchedule = new Subject<boolean>();
  private isDeleteUserFromUserGroup = new Subject<boolean>();
  private isDeleteSchedule = new Subject<boolean>();
  private isUserDeleteFromList = new Subject<boolean>();
  private isDeleteNotification = new Subject<boolean>();

  
  modalRef: BsModalRef;
  public progressIndicatorMessage: any;
  constructor(
    private httpClient: HttpClient,
    private dataStorageService: DataStorageService,
    private modalService: BsModalService
  ) { }

  setIsSuperAdmin(isSuperAdmin: boolean) {
    this.isSuperAdmin.next(isSuperAdmin);
  }

  getIsSuperAdmin() {
    return this.isSuperAdmin.asObservable();
  }

  setIsUserFormSubmit(isUserFormSubmit: boolean) {
    this.isUserFormSubmit.next(isUserFormSubmit);
  }

  getIsUserFormSubmit() {
    return this.isUserFormSubmit.asObservable();
  }

  setRoleAndLevelFormValidity(isRoleAndLevelForm: boolean) {
    this.isRoleAndLevelForm.next(isRoleAndLevelForm);
  }

  getRoleAndLevelFormValidity() {
    return this.isRoleAndLevelForm.asObservable();
  }

  setUserAddUpdate(isSaveUpdate: boolean) {
    this.isSaveUpdate.next(isSaveUpdate);
  }

  getUserAddUpdate() {
    return this.isSaveUpdate.asObservable();
  }

  deleteFormAssignment(isDelete) {
    return this.deleteFormAssignmentSubject.next(isDelete);
  }

  getdDeleteFormFormAssignment() {
    return this.deleteFormAssignmentSubject.asObservable();
  }

  refreshScheduleList(schedule: boolean) {
    this.refreshSchedule.next(schedule);
  }

  getRefreshScheduleList() {
    return this.refreshSchedule.asObservable();
  }

  deleteUserFromUserGroup(isUserFroGroupDelete: boolean) {
    this.isDeleteUserFromUserGroup.next(isUserFroGroupDelete);
  }

  getDeleteUserFromUserGroup() {
    return this.isDeleteUserFromUserGroup.asObservable();
  }


  deleteSchedule(isDeleteSchedule: boolean) {
    this.isDeleteSchedule.next(isDeleteSchedule);
  }

  getDeleteSchedule() {
    return this.isDeleteSchedule.asObservable();
  }

  setRefreshUserGroupList(isUserDelete: boolean) {
    this.isUserDeleteFromList.next(isUserDelete);
  }

  getRefreshUserGroupList() {
    return this.isUserDeleteFromList.asObservable();
  }

  deleteNotification(isDeleteNotification: boolean) {
    this.isDeleteNotification.next(isDeleteNotification);
  }

  getDeleteNotification() {
    return this.isDeleteNotification.asObservable();
  }
  

  loadScript() {
    const animationScriptSrc = '/assets/js/lottie-player.js';
    if (!customElements.get('lottie-player')) {
      const animationScript = document.createElement('script');
      animationScript.type = 'text/javascript';
      animationScript.async = true;
      animationScript.src = animationScriptSrc;
      document.body.appendChild(animationScript);
    }
  }

  loadConfiguration(): Promise<any> {
    return this.httpClient
      .get('assets/config.json')
      .toPromise()
      .then(config => {
        this.config = config;
      });
  }

  getStringResources(stringResourcesObj: any, screenCode?: string) {
    const stringValuesObj = {};
    stringResourcesObj
      .filter((res: any) => res.screenCode === screenCode || res.screenCode === null)
      .forEach((element) => {
        stringValuesObj[element.stringKey] = element.stringValue;
      });
    return stringValuesObj;
  }

  isValidEmailFormat(email: string): boolean {
    // let regex =/^[\w-\.]+[^.]+@([\w-]+\.)+[\w-]{2,150}$/g;  
    // let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/g;
    // let regex = /^[a-zA-Z0-9]+(?:[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
    // let regex = /^[a-zA-Z0-9]+(?:[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{1,}$/g;
    let regex = /^[a-zA-Z0-9](\.?[-a-zA-Z0-9_])*@[a-zA-Z0-9-]+(\.[a-zA-Z]+)+$/g;
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
    // const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    //  return email !== '' && EMAIL_REGEXP.test(email);
  }

  openMessageModal(msgCode: any, screenCode?: string, type?: string, action?: any) {
    this.getStringForMessageModal(msgCode, screenCode).then((msg) => {
      const initialState = {
        message: msg,
        modalType: type,
        action: action // logout or delete 
      };
      this.modalRef = this.modalService.show(CommonMessageComponent, {
        class: 'modal-dialog-centered confirmation-modal',
        backdrop: false,
        ignoreBackdropClick: true,
        initialState,
      });
    });
  }

  hideMessageModal() {
    this.modalRef.hide();
  }

  async getStringForMessageModal(msgCode: any, screenCode?: string): Promise<string | null> {
    try {
      const getStringValues = await this.dataStorageService.getLocalData('stringResources');
      if (getStringValues) {
        return this.getStringResources(getStringValues, screenCode)[msgCode];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  getUserByAccess(objGetUser: any, httpService: HttpWrapperService) {
    return new Promise((resolve, reject) => {
      httpService.post(APIResources.getUserByAccess, objGetUser)
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (error) => {
            reject(error); // Assuming you have a 'reject' function for Promise rejection
          }
        });

    });
  }

}
