import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonMessage, Filepath } from 'src/app/app.constant';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';


@Component({
  selector: 'app-error-popup',

  templateUrl: './error-popup.component.html',

  styleUrls: ['./error-popup.component.scss'],
})
export class ErrorPopupComponent implements OnInit {
  modalRef: BsModalRef;
  animationPath: any;
  height: number;
  width: number;
  message: any;
  errorCode:any;
  pageName:any
  // stringLabelValues: any;
  stringValues: any = {};

  constructor(
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private dataStorageService: DataStorageService,
    private commonService: CommonService
  ) {

    // this.animationPath = '../../../../assets/animations/error.json';
    this.animationPath = Filepath.ERROR_JSON;
    this.height = 136;
    this.width = 136;
    this.stringValues.ERROR = CommonMessage.ERROR;
    this.stringValues.CLOSE = CommonMessage.CLOSE;
    
  }

  ngOnInit() {
    this.getStringValuesForModal();
  }

  ngOnDestroy() {}

  async getStringValuesForModal() {
    let getStringSFromLocalData = await this.dataStorageService.getLocalData("stringResources");
    if(getStringSFromLocalData) {
      this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, null);
    }
  }

  onClose() {
    this.globalErrorHandlerService.hideErrorModal(this.errorCode, this.pageName);
  }
}
