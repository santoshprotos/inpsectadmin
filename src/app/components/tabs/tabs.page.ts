import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  selectedTab: any;
  stringValues: any = {};
  pwdPolicyBtnClicked: boolean = true;
  constructor(
    public dataStorageService: DataStorageService,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    this.getStringResourcesForTabs();
  }
  ngOnInit(): void {
    this.commonService.loadScript();
    this.authService.setHeader(true);
  }

  tabClicked(e: { tab: any }) {
    this.selectedTab = e.tab;
  }

  showPwdPolicyButton() {
    this.pwdPolicyBtnClicked = !this.pwdPolicyBtnClicked;
  }
  // Fatch All tab labels in local storage.
  // async getStringResourcesForTabs() {
  //   try {
  //     let body = { ScreenName: 'Tabs' };
  //     // get data in localStorage for showing labels
  //     let labelsDecryptedData = await this.dataStorageService.getLocalData(
  //       'LabelStrings'
  //     );
  //     let data = labelsDecryptedData.filter(function (item: any) {
  //       return item.ScreenName === body.ScreenName;
  //     });
  //     this.stringValues = data[0].StringResources;
  //   } catch (e) {
  //     console.log('errrorr', e);
  //   }
  // }
  async getStringResourcesForTabs() {
    let getStringSFromLocalData = await this.dataStorageService.getLocalData('stringResources');
    if (getStringSFromLocalData) {
      this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, 'TABS');
    }
  }
}
