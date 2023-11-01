import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  stringValues: any;

  constructor(private dataStorageService: DataStorageService, private commonService: CommonService) { }

  ngOnInit() {
    this.getStringValues();
  }

  receiveFacilityFilterData(event:any) {
    console.log('receiveFacilityFilterData', event);
  }

  async getStringValues() {
    let getStringsFromLocalData = await this.dataStorageService.getLocalData("stringResources");
    if (getStringsFromLocalData) {
        this.stringValues = this.commonService.getStringResources(getStringsFromLocalData, "ADMINDASHBOARD");
    }
}

}
