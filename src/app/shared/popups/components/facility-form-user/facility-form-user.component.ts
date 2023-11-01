import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShortNamePipe } from 'src/app/shared/services/filters/short-name.pipe';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { Actions, APIResources, Modal, projectConstants, Screens } from 'src/app/app.constant';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-facility-form-user',
  templateUrl: './facility-form-user.component.html',
  styleUrls: ['./facility-form-user.component.scss'],
})
export class FacilityFormUserComponent implements OnInit {
  @Input('facilityFormUserCom') public modalRef: BsModalRef;
  @Input('userDetails') public userDetails: any;
  @Input('modalRefFromCreateUsers') public modalRefCreateUser: BsModalRef;
  @Input('userId') public editUserId: any;
  @Input('modalRefFromUserGroups') public modalRefUserGroups: BsModalRef;
  @Input('businessId') public businessId: any;
  @Input('divisionId') public divisionId: any;
  @Input('facilityId') public facilityId: any;
  @Input('form') public form: any;
  multiSelectList: any[]
  @ViewChild('combo', { static: true }) combo;
  stringValues: any;
  business: any;
  division: any;
  facility: any;
  submitted: boolean;
  isLoading: boolean;
  placeHolder: string;
  selectedMultiSelectArray: any
  is_facilityFormUser: boolean = true;
  searchText: any;
  isDivisionLabel: boolean = true;
  selectedItems: any;
  selectedUserOrGroup: any;
  users = "USERS";
  userGroups = "USERGROUP"
  selectedEntity: any;
  EntityAllChecked: boolean;
  userAssignment: FormGroup;
  user: any = [];
  userGroup: any = [];
  userFormAssignments = [];
  deleteFormAssignmentSubscription = new Subscription();


  constructor(
    public modalRefAssignUser: BsModalRef,
    private modalService: BsModalService,
    public dataStorageService: DataStorageService,
    public commonService: CommonService,
    public shortNamePipe: ShortNamePipe,
    public httpWrapperService: HttpWrapperService,
    public selectmodule: NgSelectModule,
    private formBuilder: FormBuilder,
    private httpService: HttpWrapperService,
    private globalErrorHandlerService: GlobalErrorHandlerService
  ) { }


  ngOnInit() {
    this.getStringResources();
    this.userAssignment = this.formBuilder.group({
      entitySelection: ['', Validators.required],
    });

    this.deleteFormAssignmentSubscription = this.commonService.getdDeleteFormFormAssignment().subscribe((isDelete) => {
      if (isDelete) {
        this.deleteFormAssignment();
      }
    })
  }

  ngOnDestroy() {
    this.deleteFormAssignmentSubscription.unsubscribe();
  }

  get f() { return this.userAssignment.controls; }

  async ngOnChanges() {
    await this.getFacilityDetails();
    this.getFormAssignments();
  }

  modifyUsers() {
    if (this.selectedEntity === "USERS") {
      this.multiSelectList = this.user;
      this.placeHolder = "Search and select user"
    }
  }

  modifyUserGroups() {
    if (this.selectedEntity === 'USERGROUP') {
      this.multiSelectList = this.userGroup;
      this.placeHolder = "Search and select user group"
    }
  }
  async getFacilityDetails() {
    let businesses = await this.dataStorageService.getLocalData("myBusiness");
    this.business = businesses.filter(item => item.id === this.businessId)[0];

    let division = await this.dataStorageService.getLocalData("myDivision");
    this.division = division.filter(item => item.id === this.divisionId)[0];

    let facility = await this.dataStorageService.getLocalData("myFacility");
    this.facility = facility.filter(item => item.id === this.facilityId)[0];

  }

  assignUserOrUserGroup(template: TemplateRef<any>) {
    this.modalRefAssignUser = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-md',
      backdrop: 'static',
      ignoreBackdropClick: true
    });

    // Get Users and User groups by access
    this.getUsers();
    this.getUserGroups();

    this.selectedEntity = "USERS"
    this.userAssignment.get('entitySelection').clearValidators();
    this.userAssignment.get('entitySelection').updateValueAndValidity();

  }
  radioChangeUser() {
    //this.userAssignment.get("entitySelection").setValue([]);
    this.selectedMultiSelectArray = []
    this.multiSelectList = []
    if (this.selectedEntity === 'USERS') {
      this.getUsers()
    }
    else if (this.selectedEntity === 'USERGROUP') {
      this.getUserGroups()
    }
  }

  // removeItems(data: any) {
  //   let selectedEntities = this.userAssignment.value.entitySelection;
  //   let entityProp = this.selectedEntity == "USERS" ? "userid" : "usergroupid";
  //   selectedEntities.forEach((value, index) => {
  //     if (value[entityProp] == data[entityProp]) selectedEntities.splice(index, 1);
  //   });
  //   this.userAssignment.get("entitySelection").setValue(selectedEntities);
  // }

  // toggleCheckAll(values: any) {
  //   if (values.currentTarget.checked) {
  //     if (this.selectedEntity == "USERS") {
  //       this.userAssignment.get("entitySelection").setValue(this.user);
  //     }
  //     else {
  //       this.userAssignment.get("entitySelection").setValue(this.userGroup);
  //     }
  //   }
  //   else {
  //     this.userAssignment.get("entitySelection").setValue([]);
  //   }
  //   this.EntityAllChecked = !this.EntityAllChecked
  // }

  // onEntitySelectionChange(event: any[]) {
  //   if (Array.isArray(event)) {
  //     if (event.length == 0) {
  //       this.userAssignment.get("entitySelection").setValue([]);
  //     }
  //     else {
  //       this.EntityAllChecked = false
  //     }
  //     this.userAssignment.get("entitySelection").setValue(event);
  //   }

  // }
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

  mapUserToSaveForm() {
    let formUsers = this.selectedMultiSelectArray.map(assignment => ({
      key: "USER",
      value: assignment.userid
    }));
    return formUsers;
  }

  mapUserGroupToSaveForm() {
    let formUsergroup = this.selectedMultiSelectArray.map(assignment => ({
      key: "USERGROUP",
      value: assignment.usergroupid
    }));
    return formUsergroup;
  }

  getFormAssignmentObj() {
    let payload = {
      "formId": this.form.formid,
      "facilityId": this.facilityId,
      "listOfAssignments": this.selectedEntity == "USERS" ?
        this.mapUserToSaveForm() : this.mapUserGroupToSaveForm()
    }
    console.log(payload)
    return payload;
  }

  async getFormAssignments() {
    this.isLoading = true;
    let data = {
      "formId": this.form.formid,
      "facilityId": this.facilityId == 0 ? null : this.facilityId,
      "entityType": null,
      "entityId": null
    };
    try {
      const result: any = await this.httpService.post(APIResources.getFormAssignments, data).toPromise();
      this.userFormAssignments = result
      this.isLoading = false;
    }
    catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }

  async getUsers() {

    let data = {
      "divisionId": this.divisionId,
      "businessId": this.businessId,
      "facilityId": this.facilityId,
      "pageNumber": 1,
      "pageSize": 99999,
      "searchKeyword": ""
    };
    try {

      const result: any = await this.httpService.post(APIResources.getUserByAccess, data).toPromise();
      this.user = result.usersByAccess;
      console.log(this.user)
      this.user.map(a => {
        a["name"] = a.firstname + " " + a.lastName;
        a["checked"] = false
      })

      this.modifyUsers();

    }
    catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }


  async getUserGroups() {
    let data = {
      "divisionId": this.divisionId,
      "businessId": this.businessId,
      "facilityId": this.facilityId,
      "pageNumber": 1,
      "pageSize": 99999,
      "searchKeyword": ""
    };
    try {
      const result: any = await this.httpService.post(APIResources.getUserGroupByAccess, data).toPromise();
      this.userGroup = result;
      this.userGroup.map(a => {
        a["name"] = a.usergroupname
        a["checked"] = false
      })
      this.modifyUserGroups();
    }
    catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }

  cancelAssignUserPopup() {
    this.userAssignment.get("entitySelection").setValue([]);
    this.multiSelectList = []
    this.modalRefAssignUser.hide()
  }

  async assignUserOrGroup() {
    this.submitted = true;
    // this.userAssignment.get('entitySelection').setValidators([Validators.required]);
    // this.userAssignment.get('entitySelection').updateValueAndValidity();

    try {
      // if (this.f.entitySelection.errors) {
      //   this.userAssignment.get('entitySelection').setValidators([Validators.required]);
      //   this.userAssignment.get('entitySelection').updateValueAndValidity();
      // }
      // else {
      // this.userAssignment.get('entitySelection').clearValidators();
      // this.userAssignment.get('entitySelection').updateValueAndValidity();
      let data = this.getFormAssignmentObj();
      console.log(data)
      //const result: any = await this.httpService.post(APIResources.saveFormAssignment, data).toPromise();
      this.modalRefAssignUser.hide()
      //this.userAssignment.get("entitySelection").setValue([]);
      this.selectedMultiSelectArray = [];
      this.getFormAssignments();
      let successText = projectConstants.USER_ASSIGNED_TO_FORM_SUCCESSFULLY;
      if (this.selectedEntity == "USERGROUP") {
        successText = projectConstants.USER_GROUP_ASSIGNED_TO_FORM_SUCCESSFULLY;
      }
      this.commonService.openMessageModal(successText, Screens.FACILITY, Modal.SUCCESS)
      // } 
    }
    catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }

  onDeleteFormAssignmentClick(item) {
    this.selectedUserOrGroup = item;
    this.commonService.openMessageModal(projectConstants.DELETE_CONFIRM_FORM_ASSIGNMENT, Screens.FACILITY, Modal.CONFIRMATION, Actions.DELETE_FORM_ASSIGNMENT);
  }

  async deleteFormAssignment() {
    let data = {
      id: this.selectedUserOrGroup.formAssignmentId
    }
    try {
      await this.httpService.post(APIResources.deleteFormAssignment, data).toPromise();
      this.getFormAssignments();
      this.commonService.hideMessageModal();
    }
    catch (err) {
      this.globalErrorHandlerService.openErrorModal(err.message);
    }
  }

  //   searchAsignUserGroup(searchTerm: string, eachObject) {
  //     let replacedKey = searchTerm.replace(/[,\.-\s]/g, '')
  //     let newRegEx = new RegExp(replacedKey, 'gi');
  //     let purgedName = eachObject.firstname.replace(/[,\.-\s]/g, '')
  //     if (newRegEx.test(purgedName)) {
  //       return true
  //     }
  //     return false
  // }
  receiveData(event:any) {
    let data = []
    for (let i = 0; i < event.length; i++) {
      const { name, checked, ...newObject } = event[i];
      data.push(newObject);
    }
    this.selectedMultiSelectArray = data;
    this.getFormAssignmentObj();
  }

}
