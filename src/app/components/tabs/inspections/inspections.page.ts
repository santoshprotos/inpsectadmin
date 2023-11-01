import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';

interface DateObjCollection{
  fromDate: any; 
  toDate: any;
  isValid :boolean,
  errorMessage:string
}

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.page.html',
  styleUrls: ['./inspections.page.scss'],
})
export class InspectionsPage implements OnInit {
  public customBsDatepickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  // bsValue = new Date();
  // maxDate = new Date();

  // businessDropdownData: any[];
  businessDropdownData: any[] = [];
  divisionDropdownData:any[] =[];
  facilityDropdownData:any[] =[];
  inspectorDropdownData:any[]=[];
  supervisorDropdownData:any[]=[];
  certifierDropdownData:any[]=[];
  statusDropdownData:any;
  selectedBUName:any;
  selectedDivName:any;
  selectedFecName:any;
  selectedInspectorName:any;
  selectedSupervisorName:any;
  selectedCertifierName:any;
  selectedStateList: any=[]=[];
  selectedCertifier:any[]=[];
  selectedStateNameList: any =[]=[];
  selectedOptions: any;
  showDropDown: boolean = false;
  isDateSelected: boolean =true;
  searchVal: string;
  isStateFilterSelected: boolean = false;
  thresholdExceeded:any;
  geoTaggedAssets:any;
  nonPerformingAssets:any;
  stringValues: any;

  earliestDateObj = {isValid:true} as DateObjCollection;
  latestDateObj= {isValid:true} as DateObjCollection;
  submissionDateObj = {isValid:true} as DateObjCollection;
  approvalDateObj = {isValid:true} as DateObjCollection;
  certificationDateObj = {isValid:true} as DateObjCollection;
  dateDataArray: Array<any> = [];
  

  tableJoneData = [
    { id: 1, facility: 'Facility 1', formname: 'Chemical Control 002',frequency:'Weekly',inspector:'Jone Deo',startDate: 'Jan 18.2023',dueDate:'Dec 25,2023',status:'Approved' },
    { id: 2, facility: 'Facility 2', formname: 'FCC 003',frequency:'Daily',inspector:'Charles Willis',startDate: 'Jan 15.2023',dueDate:'Dec 20,2023',status:'Submitted for Approval' },
    { id: 3, facility: 'Facility 3', formname: 'HAZMAT/DOT 004',frequency:'Monthly',inspector:'Larry Henderson',startDate: 'Jan 18.2023',dueDate:'Dec 25,2023',status:'Auto Approved' }    
  ];
  

  constructor( private http: HttpClient,  private dataStorageService: DataStorageService,private commonService: CommonService,) {
    // this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.customBsDatepickerConfig.containerClass = 'theme-blue';
    this.customBsDatepickerConfig.showWeekNumbers = false;
    this.customBsDatepickerConfig.dateInputFormat = 'MM-DD-YYYY';
   }

  ngOnInit() {
    this.loadBusinessDropdownData();
    this.loadDivisionDropdownData();
    this.loadFacilityDropdownData();
    this.getInspector();
    this.getSupervisor();
    this.getCertifier();
    this.getStatus();
    this. getStringResourcesForInspection();
  }

  async getStringResourcesForInspection() {
    let getStringValues = await this.dataStorageService.getLocalData("stringResources");
    if(getStringValues) {
      this.stringValues = this.commonService.getStringResources(getStringValues, "ADMININSPECTION")
    }
  }

  loadBusinessDropdownData() {
    this.http.get('assets/inspectorDummyJson/BusinessDropdown.json').subscribe((data: any) => {
      this.businessDropdownData = data;
      this.businessDropdownData.unshift({name: "All", business_id: 0});
    });
  }

  loadDivisionDropdownData() {
    this.http.get('assets/inspectorDummyJson/divisionDropdown.json').subscribe((data: any) => {
      this.divisionDropdownData = data;
      this.divisionDropdownData.unshift({name: "All", division_id: 0});
    });
  }

  
  loadFacilityDropdownData() {
    this.http.get('assets/inspectorDummyJson/facilityDropdown.json').subscribe((data: any) => {
      this.facilityDropdownData = data;
      this.facilityDropdownData.unshift({name: "All", facility_id: 0});
    });
  }

  getInspector() {
    this.http.get('assets/inspectorDummyJson/inspector.json').subscribe((data: any) => {
      this.inspectorDropdownData = data;
      this.inspectorDropdownData=this.inspectorDropdownData.map(inspector => ({
        ...inspector, 
        fullName:  `${inspector.firstName} ${inspector.lastName}`
      }))
      this.inspectorDropdownData.unshift({ fullName: "All", id: 0});
    });
  }

  getSupervisor() {
    this.http.get('assets/inspectorDummyJson/supervisor.json').subscribe((data: any) => {
      this.supervisorDropdownData = data;
      this.supervisorDropdownData=this.supervisorDropdownData.map(sup => ({
        ...sup, 
        fullName:  `${sup.firstName} ${sup.lastName}`
      }))
      this.supervisorDropdownData.unshift({ fullName: "All", id: 0});
    });
  }

  getCertifier() {
    this.http.get('assets/inspectorDummyJson/certifier.json').subscribe((data: any) => {
      this.certifierDropdownData = data;
      this.certifierDropdownData=this.certifierDropdownData.map(cert => ({
        ...cert, 
        fullName:  `${cert.firstName} ${cert.lastName}`
      }))
      this.certifierDropdownData.unshift({ fullName: "All", id: 0});
    });
  }

  getStatus() {
    this.http.get('assets/inspectorDummyJson/status.json').subscribe((data: any) => {
      this.statusDropdownData = data;
    });
  }

  selectBU(bu) {
    let selectedBusiness = [];
    this.selectedBUName = bu.name;
    if (bu.business_id === '') {
      for (let x of this.businessDropdownData) {
        if (x.business_id !== '') {
          selectedBusiness.push(x.business_id);
        }
      }
    } else {
      selectedBusiness.push(bu.business_id);
    }
  }

  selectDivision(div) {
    let selectedDivision = [];
    this.selectedDivName = div.name;
    if (div.division_id === '') {
      for (let x of this.divisionDropdownData) {
        if (x.division_id !== '') {
          selectedDivision.push(x.division_id);
        }
      }
    } else {
      selectedDivision.push(div.division_id);
    }
  }

  selectFacility(fec) {
    let selectedFacility = [];
    this.selectedFecName = fec.name;
    if (fec.facility_id === '') {
      for (let x of this.facilityDropdownData) {
        if (x.facility_id !== '') {
          selectedFacility.push(x.facility_id);
        }
      }
    } else {
      selectedFacility.push(fec.facility_id);
    }
  }

  selectInspector(inspector) {
    let selectedInspector = [];
    if (inspector.firstName !== '') {
      this.selectedInspectorName = inspector.firstName + " " + inspector.lastName;     
      selectedInspector.push(inspector.id);
    } else {
      this.selectedInspectorName = '';
      selectedInspector.push(inspector.id);
    }
  }

  selectSupervisor(sup) {
    let selectedSupervisor = [];
    if (sup.firstName !== '') {
      this.selectedSupervisorName = sup.firstName + " " + sup.lastName;     
      selectedSupervisor.push(sup.id);
    } else {
      selectedSupervisor.push(sup.id);
    }
  }

  selectCertifier(cer) {
    this.selectedCertifier = [];
    if (cer.firstName !== '') {
      this.selectedCertifierName = cer.firstName + " " + cer.lastName;     
      this.selectedCertifier.push(cer.id);
    } else {
      this.selectedCertifier.push(cer.id);
    }
  }

  selectStates(state: any, index:any) {
    if (state.stateName === 'All') {
      this.selectedStateList = [];
      this.selectedStateNameList = [];
      if (state.Checked) {
        this.isStateFilterSelected = true;
        this.statusDropdownData.forEach((state) => {
          if (state.Checked === false) {
            state.Checked = true;
          }
          this.selectedStateNameList.push(state.stateName);
          this.selectedStateList.push(state.id);
        });
        var stateNameIndex = this.selectedStateNameList.indexOf(state.stateName);
        var stateCodeIndex = this.selectedStateList.indexOf(state.id);
        this.selectedStateNameList.splice(stateNameIndex, 1);
        this.selectedStateList.splice(stateCodeIndex, 1);
        this.selectedOptions = 'All';
      } else {
        this.statusDropdownData.forEach((state) => {
          if (state.Checked === true) {
            state.Checked = false;
          }
        });
        this.statusDropdownData = '';
        this.selectedStateList = [];
      }
    } else {
      if (!state.Checked) {
        this.statusDropdownData[0].Checked = false;
        var stateNameIndex = this.selectedStateNameList.indexOf(state.stateName);
        var stateCodeIndex = this.selectedStateList.indexOf(state.id);
        this.selectedStateNameList.splice(stateNameIndex, 1);
        this.selectedStateList.splice(stateCodeIndex, 1);

        if(this.selectedStateList.length <= 0){
          this.statusDropdownData[index].Checked = true;
          state.Checked = true;
          this.statusDropdownData.forEach((state) => {
            if (state.Checked === false) {
              state.Checked = true;
            }
            this.selectedStateNameList.push(state.stateName);
            this.selectedStateList.push(state.id);
          });
          this.selectedStateNameList.splice(0, 1);
          this.selectedStateList.splice(0, 1);
          this.showDropDown = false;
        }
      } else {
        this.isStateFilterSelected = true;
        this.selectedStateNameList.push(state.stateName);
        this.selectedStateList.push(state.id);

        if(this.selectedStateList.length === (this.statusDropdownData.length-1)){
          this.statusDropdownData[0].Checked = true;
        }
      }
    }
    if(this.selectedStateList.length === (this.statusDropdownData.length-1)){
      this.selectedOptions = 'All';
    } else {
      this.selectedOptions = this.selectedStateNameList.join(', ');
      if (this.selectedOptions.length > 10) {
        this.selectedOptions = this.selectedOptions.slice(0, 17) + '...';
      }
    }

  }

  addDateFields(selectedDateObj:DateObjCollection,selectedDateType:string){
    let selectFromDateTime = new Date(selectedDateObj.fromDate).setHours(0, 0, 0);
    let selectToDateTime = new Date(selectedDateObj.toDate).setHours(23, 59, 59);
    if (selectedDateObj.fromDate && selectedDateObj.toDate && selectedDateObj.fromDate != undefined && selectedDateObj.toDate != undefined) {
      if(selectFromDateTime > selectToDateTime){
        selectedDateObj.isValid = false;
        selectedDateObj.errorMessage = "error";
        // this.hasErrorInSearchCriteria = true;
        return false;
      }
      else{
        let dateTableJSON = {
          type: selectedDateType,
          from: selectFromDateTime,
          to: selectToDateTime
        };
        let index = this.dateDataArray.findIndex((a => a.type === selectedDateType));
        if (index !== -1) {
          this.dateDataArray.splice(index, 1);
        }
        this.dateDataArray.push(dateTableJSON);
      }
  }
  else{
    // this.hasErrorInSearchCriteria = true;
    // this.dateError = { isError: true, datErrorMessage: this.stringValues.ADMININSPECTION_VALIDATION_MESSAGE_REQUIRED };
  }
    return true;
  }

  iterateDateFields(){
    this.isDateSelected = false;
    // this.dateDataArray.length = 0;
    // this.inspectionList.length = 0;
    // this.hasErrorInSearchCriteria = false;
    // this.dateError = '';

    if(this.earliestDateObj.fromDate || this.earliestDateObj.toDate){
      this.isDateSelected = true;
      this.earliestDateObj.errorMessage = ""
      this.addDateFields(this.earliestDateObj,"earlystartdate");
    }
    if(this.latestDateObj.fromDate || this.latestDateObj.toDate){
      this.isDateSelected = true;
      this.latestDateObj.errorMessage = ""
      this.addDateFields(this.latestDateObj,"duedate");
    }
    if(this.submissionDateObj.fromDate || this.submissionDateObj.toDate){
      this.isDateSelected = true;
      this.submissionDateObj.errorMessage = ""
      this.addDateFields(this.submissionDateObj,"submittedon");
    }
    if(this.approvalDateObj.fromDate || this.approvalDateObj.toDate){
      this.isDateSelected = true;
      this.approvalDateObj.errorMessage = ""
      this.addDateFields(this.approvalDateObj,"approvedon");
    }
    if(this.certificationDateObj.fromDate || this.certificationDateObj.toDate){
      this.isDateSelected = true;
      this.certificationDateObj.errorMessage = ""
      this.addDateFields(this.certificationDateObj,"certificatdon");
    }
    if(!this.isDateSelected){
      this.addDateFields(this.earliestDateObj,"earlystartdate");
    }
    // if(this.dateDataArray && this.dateDataArray.length > 0 && !this.dateError.isError) {
    //   this.advancedSearch();
    // }
  }
  
  clearEarliestDateField(){
    this.earliestDateObj = {
      isValid:true
    } as DateObjCollection;
  }
  clearLatestDateField(){
    this.latestDateObj = {
      isValid:true
    } as DateObjCollection;
  }
  clearSubmissionDateField(){
    this.submissionDateObj = {
      isValid:true
    } as DateObjCollection;
  }
  clearApprovalDateField(){
    this.approvalDateObj = {
      isValid:true
    } as DateObjCollection;
  }
  clearCertificationDateField(){
    this.certificationDateObj = {
      isValid:true
    } as DateObjCollection;
  }

  clearDateFields(dateType:string){
    switch (dateType) {
      case "earliest":
        this.clearEarliestDateField();
        break;
        case "latest":
        this.clearLatestDateField();
        break;
        case "submission":
        this.clearSubmissionDateField();
        break;
        case "approval":
       this.clearApprovalDateField();
        break;
        case "certification":
       this.clearCertificationDateField();
        break;
  
      default:
        break;
    }
  }

  clearAdvancedSearch() {
    this.selectedBUName = this.businessDropdownData[0].name; 
    this.selectedDivName = this.divisionDropdownData[0].name;
    this.selectedFecName = this.facilityDropdownData[0].name;

    const state = {
      id: "",
      stateName: '',
      Checked: false
    };
    this.selectStates(state,0);

    this.selectedInspectorName = '';
    // this.inspectorDropdownData = [];

    this.selectedSupervisorName = '';
    // this.supervisorDropdownData = [];

    this.selectedCertifierName = '';
    // this.certifierDropdownData = [];
    // this.formTitleContains = '';
    this.thresholdExceeded =false;
    this.geoTaggedAssets =false;
    this.nonPerformingAssets =false;
    // this.selectedDateType = 'earlystartdate';
    // this.dateDataArray = [];
    // this.isDateFilterSelected = true;
    // this.isFacilitySelected = true;
    // this.isStateFilterSelected = true;
    // this.isValidDate = false;

    // this.selectedDateType = 'earlystartdate';
    // this.selectedDateTypeDisplayText = this.stringValues.ADMININSPECTION_EARLIEST_SUBMISSION;
    // this.dateError = '';
    this.isDateSelected = true;
    // this.hasErrorInSearchCriteria= false;
    this.clearAllDateFields();
  }

  clearAllDateFields(){
    this.clearEarliestDateField();
    this.clearLatestDateField();
    this.clearSubmissionDateField();
    this.clearApprovalDateField();
    this.clearCertificationDateField();
  }

}
