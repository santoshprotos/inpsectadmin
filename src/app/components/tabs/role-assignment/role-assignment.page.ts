import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
    selector: 'app-role-assignment',
    templateUrl: './role-assignment.page.html',
    styleUrls: ['./role-assignment.page.scss'],
})
export class RoleAssignmentPage implements OnInit {
    stringValues: any = {};

    constructor(public dataStorageService: DataStorageService, private commonService:CommonService) { }

    ngOnInit() {
        this.getStringValue();
    }

    async getStringValue() {

        let getStringValues = await this.dataStorageService.getLocalData("stringResources");
        if(getStringValues) {
          this.stringValues = this.commonService.getStringResources(getStringValues, "ROLEASSIGENMENT")
        }
      }
   

    onRadioChange(data) {
        //console.log(data);
    }

}
