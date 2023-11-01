import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Actions, CommonMessage, Filepath, Modal, Screens, projectConstants } from 'src/app/app.constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';


@Component({
    selector: 'app-common-message',
    templateUrl: './common-message.component.html',
    styleUrls: ['./common-message.component.scss'],
})
export class CommonMessageComponent implements OnInit {
    modalRef: BsModalRef;
    animationPath: any;
    height: number;
    width: number;
    message: any;
    modalType: string;
    stringValues: any = {};
    modalTitle: any;
    action: string;

    constructor(
        private dataStorageService: DataStorageService,
        private commonService: CommonService,
        private authService: AuthService,
    ) {
        this.height = 136;
        this.width = 136;
        this.stringValues.ERROR = CommonMessage.ERROR;
        this.stringValues.CLOSE = CommonMessage.CLOSE;
        this.getStringValuesForModal();
    }

    ngOnInit() {
        this.setAnimation();
        this.getStringValuesForModal();
    }

    setAnimation() {
        switch (this.modalType) {
            case Modal.CONFIRMATION:
                this.animationPath = Filepath.CONFIRM_JSON;
                this.modalTitle = this.stringValues.CONFIRMATION;
                break;
            case Modal.SUCCESS:
                this.animationPath = Filepath.SUCCESS_JSON;
                this.modalTitle = this.stringValues.SUCCESS;
                break;
            case Modal.FORGOT_PASSWORD:
                this.animationPath = Filepath.FORGOT_PASSWORD_JSON;
                this.modalTitle = this.stringValues.FORGOT_PASSWORD;
                break;
            default:
                this.animationPath = Filepath.SUCCESS_JSON;
                this.modalTitle = this.stringValues.SUCCESS;
                break;
        }
    }

    async getStringValuesForModal() {
        let getStringsFromLocalData = await this.dataStorageService.getLocalData("stringResources");
        if (getStringsFromLocalData) {
            this.stringValues = this.commonService.getStringResources(getStringsFromLocalData, Screens.LOGIN);

        }
        this.setAnimation();
    }

    logout() {
        this.commonService.hideMessageModal();
        this.authService.logout();
    }

    onClose() {
        this.commonService.hideMessageModal();
    }

    confirmOk() {
        switch (this.action) {
            case Actions.DELETE_USER_FROM_USERGROUP:
                // Delete user from user group
                this.commonService.deleteUserFromUserGroup(true);
                break;
            case Actions.DELETE_SCHEDULE:
                // Delete schedule
                this.commonService.deleteSchedule(true);
                break;
            case Actions.DELETE_NOTIFICATION:
                // Delete schedule
                this.commonService.deleteNotification(true);
                break;
            case Actions.DELETE_FORM_ASSIGNMENT:
                // Delete form assignment
                this.commonService.deleteFormAssignment(true);
                break;
            default:
                this.logout();
                break;
        }
    }

}
