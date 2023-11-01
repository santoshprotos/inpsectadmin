import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { filter, Subscription } from 'rxjs';
import { APIResources, Assets, Roles, Screens } from 'src/app/app.constant';
import { FacilitesPopupComponent } from 'src/app/shared/popups/components/facilites-popup/facilites-popup.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { ModalStateService } from 'src/app/shared/services/modal-state.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.page.html',
  styleUrls: ['./facilities.page.scss'],
})
export class FacilitiesPage implements OnInit {
  selectedTab: any;
  forms: any;
  modalRef?: BsModalRef;
  paginationName: string
  config: ModalOptions = {
    class: 'modal-dialog-centered modal-xl',
    backdrop: 'static',
    ignoreBackdropClick: true
  }
  groupId: any;
  formDetails: any;
  stringValues: any;
  searchText: any;
  pageNumber: any;
  pageSizes: number[] = [5, 10, 15, 20, 50, 100];
  viewOnlyAdmin: any;
  loginUserRole: any;
  entityId: any;
  accessLevel: any;
  totalRecords: number;


  totalUserForms: any;
  userGroupIcon = Assets.USERGROUP;
  divisionId: any;
  businessId: any;
  facilityId: any;
  row: number = 5;
  routerSubscription = new Subscription();
  form: any;

  constructor(private modalService: BsModalService, private httpService: HttpWrapperService, private modalStateService : ModalStateService,
    private commonService: CommonService, private dataStorageService: DataStorageService, private globalErrorHandler: GlobalErrorHandlerService,
    private cdr: ChangeDetectorRef, private router: Router) {


    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        if (event.url.includes("facilities")) {
          this.getStringResources();
          this.pageNumber = 1;
          this.searchText = '';
          this.row = 5;
          this.paginationName = 'facility'
          if (this.divisionId == undefined && this.businessId == undefined && this.facilityId == undefined) {
            this.divisionId = 0;
            this.businessId = 0;
            this.facilityId = 0;
          }
          this.getForms();
        }
      })

  }

  // get string from local storage and decrypt
  async getStringResources() {
    try {
      let getStringSFromLocalData = await this.dataStorageService.getLocalData("stringResources");
      if (getStringSFromLocalData) {
        this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, Screens.FACILITY)
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  ngOnInit() {

  }


  triggerFromPaginationEmit(data:any) {
    this.pageNumber = data.pageNumber
    this.row = data.pageSizes
    this.getForms()
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  receiveFacilityFilterData(data: any) {
    this.divisionId = data.divisionId;
    this.businessId = data.businessId;
    this.facilityId = data.facilityId;
    if (data != null && data.facilityId != undefined) {
      this.pageNumber = 1; //every time click on show  pageNumber set as 1
      //when user click on reset and again click on show button then call if condition
      this.getForms();
    }
  }

  async getForms() {
    if (this.divisionId === 0 && this.businessId === 0 && this.facilityId === 0) {
      this.entityId = null;
      this.accessLevel = null;
    }

    else if (this.facilityId != 0) {
      this.entityId = this.facilityId;
      this.accessLevel = Roles.FACILITY;
    }

    else if (this.businessId != 0) {
      this.entityId = this.businessId;
      this.accessLevel = Roles.BUSINESS;
    }
    else if (this.divisionId != 0) {
      this.entityId = this.divisionId;
      this.accessLevel = Roles.DIVISION;
    }

    let body = {
      "entityId": this.entityId ? this.entityId : null,
      "accessLevel": this.accessLevel,
      "pageSize": this.row,
      "pageNumber": this.pageNumber,
      "searchString": this.searchText
    }

    this.httpService.post(APIResources.getForms, body)
      .subscribe({
        next: (data) => {
          //sort by asc order
          if (data.totalRecords > 0) {
            this.totalRecords = data.totalRecords;
          }
          const sortUsers = this.sortData(data.forms);
          if (sortUsers != undefined) {
            this.forms = sortUsers; //data.usersByAccess;           
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.globalErrorHandler.openErrorModal(error.message);
        },
        complete: () => {
        
        }
      })
  }

  sortData(userList: any) {
    return [...userList].sort(this.compareName)
  }
  compareName(a: any, b: any) {
    const formNameComparison = a.formtitle.localeCompare(b.formtitle);
    if (formNameComparison !== 0) { return formNameComparison; } return a.lastName?.toLowerCase().localeCompare(b.lastName?.toLowerCase());
  }

  //open the manage schedule modal
  openManageScheduleModal(template: TemplateRef<any>, formDetails: any) {
    this.formDetails = formDetails;
    //reference of BsModalService which will be sent to facility-popup component to close or open modal
    this.modalRef = this.modalService.show(template, this.config);
  }

  getSearchResult() {
    if (this.searchText.length > 3) {
      this.pageNumber = 1;
      this.getForms();
    } else if (this.searchText.length === 0) {
      this.getForms(); // remove value in search textbox
    }
  }
 

  openModal(form: any) {
    const initialState = {
      formDetails: form
    };
    this.modalRef = this.modalService.show(FacilitesPopupComponent, {
      class: 'modal-xl modal-dialog-centered',
      backdrop: false,
      ignoreBackdropClick: true,
      initialState
    });
    this.modalStateService.openModal(this.modalRef);
  }
  FacilityUserForm(template: TemplateRef<any>, form: any) {
    this.form = form;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      backdrop: 'static',
      ignoreBackdropClick: true
    });
  }

}
