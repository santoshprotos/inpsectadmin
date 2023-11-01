import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataStorageService } from '../../services/data-storage.service';
import { CommonService } from '../../services/common.service';
import { APIResources, projectConstants } from 'src/app/app.constant';
@Component({
    selector: 'app-role-level-multi-facility-filter',
    templateUrl: './role-level-multi-facility-filter.component.html',
    styleUrls: ['./role-level-multi-facility-filter.component.scss'],
})
export class RoleLevelMultiFacilityFilterComponent implements OnInit {

    @Input('stringValues') public stringValues: any;
    @Input() registerUser: FormGroup;
    // convenience getter for easy access to form fields
    @Input('f') public f: any;
    @Input('submitted') public submitted: boolean;
    @Input('loginUserRole') public loginUserRole: any;
    @Input('is_superAdmin') public is_superAdmin: any;
    @Input('is_showSsoLogin') public is_showSsoLogin: any;
    @Input('filterDivisionName') public filterDivisionName: any;

    allDivisions: any;
    allFacility: any;
    allBusiness: any;

    DivisionAllChecked: any = false;
    BusinessAllChecked: any = false;
    FacilityAllChecked: any = false;
    labelName: string = '';
    //for validation
    role_level: string = '';
    division: string = '';
    business: string = '';
    facility: string = '';
    currentlyCheckedUserRole: any = 'inspect';
    currentlyCheckedAdminRole: any = 'superAdmin';
    userRole: any = '';
    assignedRoles: any = [];
    adminRole: any = '';
    isDivisionLabel: boolean = false;
    isBusinessLabel: boolean = false;
    isFacilityLabel: boolean = false;
    isSuperAdmin: boolean = false;
    roleLevelList: any;
    isUserFormSubmit: boolean = false;
    isAppConstantUserRole: any = projectConstants.VIEWONLYADMIN;
    divisionsLength: number = 0;
    businessLength: number = 0;
    facilityLength: number = 0;
    multiSelectList: any[]
    placeHolder:string
    roleLevel:string

    // Let Angular inject the control container
    constructor(private dataStorageService: DataStorageService, private formBuilder: FormBuilder, private commonService: CommonService) {

        this.roleLevelList = [{
            id: 1,
            RoleName: 'business' 
        },
        {
            id: 2,
            RoleName: 'division'
        },
        {
            id: 3,
            RoleName: 'facility'
        }
        ];
    }

    async ngOnInit() {

        this.labelName = this.stringValues?.BUSINESS  + ' / ' + this.stringValues?.DIVISION + ' / ' + this.stringValues?.FACILITY;
     
        // below 3 call on pageload for role level permission wise show data
        this.getAllDivisions(); 
        this.getAllBusiness();
        this.getAllFacility();

        this.commonService.getIsSuperAdmin().subscribe((isSuperAdmin: boolean) => {
            this.isSuperAdmin = isSuperAdmin;
            if (isSuperAdmin == true) {

                this.registerUser.get('roleLevel').clearValidators();
                this.registerUser.get('roleLevel').updateValueAndValidity();
                this.registerUser.get("division").setValue([]);
                this.registerUser.get("business").setValue([]);
                this.registerUser.get("facility").setValue([]);
                this.registerUser.get("roleLevel").setValue([]);
                this.allDivisions = [];
                this.allBusiness = [];
                this.allFacility = [];
                this.isDivisionLabel = false;
                this.isBusinessLabel = false;
                this.isFacilityLabel = false;
                this.DivisionAllChecked = false;
                this.BusinessAllChecked = false;
                this.FacilityAllChecked = false;
            }

        });

        this.commonService.getIsUserFormSubmit().subscribe((isUserFormSubmit: boolean) => {
            this.isUserFormSubmit = isUserFormSubmit;
            if (this.isUserFormSubmit === true) {
                this.DivisionAllChecked = false;
                this.BusinessAllChecked = false;
                this.FacilityAllChecked = false;
            }
        });

    }


    // getAllRolesLevel(type) {
    //     switch (type) {
    //         case "DIVISION":

    //             if (this.allDivisions?.length === 0) {
    //                 this.roleLevelList.forEach((value, index) => {
    //                     if ((value.RoleName).toUpperCase() == projectConstants.DIVISION) this.roleLevelList.splice(index, 1);
    //                 });
    //                 this.labelName = this.stringValues?.BUSINESS + ' / ' + this.stringValues?.FACILITY;
    //             }
    //             break;
    //         case "BUSINESS":

    //             if (this.allBusiness?.length === 0) {
    //                 this.roleLevelList.forEach((value, index) => {
    //                     if ((value.RoleName).toUpperCase() == projectConstants.BUSINESS) this.roleLevelList.splice(index, 1);
    //                 });
    //                 this.labelName = this.stringValues?.FACILITY;
    //             }
    //             break;
    //         case "FACILITY":
    //             if (this.allFacility?.length === 0) {
    //                 this.roleLevelList.forEach((value, index) => {
    //                     if ((value.RoleName).toUpperCase() == projectConstants.FACILITY) this.roleLevelList.splice(index, 1);
    //                 });
    //             }
    //             break;
    //     }
    // }

    // toggleCheckAll(values: any, type: string) {
    //     if (values.currentTarget.checked) {
    //         this.selectAll(type);
    //         switch (type) {
    //             case 'division': this.DivisionAllChecked = true; break;
    //             case 'business': this.BusinessAllChecked = true; break;
    //             case 'facility': this.FacilityAllChecked = true; break;
    //         }
    //     } else {
    //         this.unselectAll(type);
    //         switch (type) {
    //             case 'division': this.DivisionAllChecked = false; break
    //             case 'business': this.BusinessAllChecked = false; break;
    //             case 'facility': this.FacilityAllChecked = false; break;
    //         }
    //     }
    // }

    // selectAll(type) {

    //     this.registerUser.get("division").setValue([]);
    //     this.registerUser.get("business").setValue([]);
    //     this.registerUser.get("facility").setValue([]);
    //     switch (type) {
    //         case 'division':
    //             this.getAllDivisions();
    //             this.registerUser.get("division").setValue(this.allDivisions);
    //             break;
    //         case 'business':
    //             this.getAllBusiness();
    //             this.registerUser.get("business").setValue(this.allBusiness);
    //             break;
    //         case 'facility':
    //             this.getAllFacility();
    //             this.registerUser.get("facility").setValue(this.allFacility);
    //             break;
    //     }
    // }
    // unselectAll(type) {
    //     if (type == 'division') {
    //         this.registerUser.get("division").setValue([]);
    //     } else if (type == 'business') {
    //         this.registerUser.get("business").setValue([]);
    //     } else if (type == 'facility') {
    //         this.registerUser.get("facility").setValue([]);
    //     }
    // }

    // removeItems(data: any, type: string) {
    //     switch (type) {
    //         case 'division':
    //             let selectedDivision = data;
    //             let AllDivisions = this.registerUser.value.division;
    //             AllDivisions.forEach((value, index) => {
    //                 if (value.id == selectedDivision.id) AllDivisions.splice(index, 1);
    //             });
    //             this.registerUser.get("division").setValue(AllDivisions);
    //             if (AllDivisions.length > 0) {
    //                 this.DivisionAllChecked = false;
    //             }
    //             break;
    //         case 'business':
    //             let selectedBusiness = data;
    //             let allBusiness = this.registerUser.value.business;
    //             allBusiness.forEach((value, index) => {
    //                 if (value.id == selectedBusiness.id) allBusiness.splice(index, 1);
    //             });
    //             this.registerUser.get("business").setValue(allBusiness);
    //             if (allBusiness.length > 0) {
    //                 this.BusinessAllChecked = false;
    //             }
    //             break;
    //         case 'facility':
    //             let selectedFacility = data;
    //             let allFacility = this.registerUser.value.facility;
    //             allFacility.forEach((value, index) => {
    //                 if (value.id == selectedFacility.id) allFacility.splice(index, 1);
    //             });
    //             this.registerUser.get("facility").setValue(allFacility);
    //             if (allFacility.length > 0) {
    //                 this.FacilityAllChecked = false;
    //             }
    //             break;
    //     }
    // }

    // onSingleSelectionChange(event: any, type: string) {
    //     if (Array.isArray(event)) {
    //         switch (type) {
    //             case 'division':
    //                 if (event.length == 0) {
    //                     this.resetFacilityFilter(type);
    //                 } else if (event.length > 0) {
    //                     this.DivisionAllChecked = false;
    //                 }
    //                 this.registerUser.get("business").setValue([]);
    //                 this.registerUser.get("facility").setValue([]);
    //                 break;
    //             case 'business':
    //                 if (event.length == 0) {
    //                     this.resetFacilityFilter(type);
    //                 } else if (event.length > 0) {
    //                     this.BusinessAllChecked = false;
    //                 }
    //                 this.registerUser.get("division").setValue([]);
    //                 this.registerUser.get("facility").setValue([]);
    //                 break;
    //             case 'facility':
    //                 if (event.length == 0) {
    //                     this.resetFacilityFilter(type);
    //                 } else if (event.length > 0) {
    //                     this.FacilityAllChecked = false;
    //                 }
    //                 this.registerUser.get("division").setValue([]);
    //                 this.registerUser.get("business").setValue([]);
    //                 break;
    //         }
    //     }
    // }

    async onChangeRoleLevel(event) {
        if (event.target != '' && event.target.value != '') {
            let roleLevel = (event.target.value).toLowerCase();
            this.labelName = roleLevel;
            this.roleLevel=roleLevel
            this.isDivisionLabel = false;
            this.isBusinessLabel = false;
            this.isFacilityLabel = false;
            this.registerUser.get('division').clearValidators();
            this.registerUser.get('division').updateValueAndValidity();
            this.registerUser.get('business').clearValidators();
            this.registerUser.get('business').updateValueAndValidity();
            this.registerUser.get('facility').clearValidators();
            this.registerUser.get('facility').updateValueAndValidity();
            switch (roleLevel) {
                case "division":
                    //label show flag
                    this.isDivisionLabel = true;
                    //validation
                    this.registerUser.get('division').setValidators([Validators.required]);
                    this.registerUser.get('division').updateValueAndValidity();
                    this.getAllDivisions();
                    this.multiSelectList = this.allDivisions
                    this.placeHolder="Search And Select Division"

                    break;
                case "business":
                    this.getAllDivisions();
                    this.isBusinessLabel = true;
                    //validation
                    this.registerUser.get('business').setValidators([Validators.required]);
                    this.registerUser.get('business').updateValueAndValidity();
                    this.getAllBusiness();
                    this.multiSelectList = this.allBusiness
                    this.placeHolder="Search And Select Business"

                    break;
                case "facility":
                    // for sub labels in facility
                    this.getAllDivisions();
                    this.getAllBusiness();
                    this.isFacilityLabel = true;
                    //validation
                    this.registerUser.get('facility').setValidators([Validators.required]);
                    this.registerUser.get('facility').updateValueAndValidity();
                    this.getAllFacility();
                    this.multiSelectList = this.allFacility
                    this.placeHolder="Search And Select Facility"
                    break;
            }
        }
    }
    async getAllDivisions() {
        await this.dataStorageService.getLocalData("myDivision").then((res) => {
            this.allDivisions = res;
            this.allDivisions.map(a => {
                a["name"] = a.divisionName
                a["checked"] = false
            })
            //this.getAllRolesLevel(projectConstants.DIVISION);
            return this.allDivisions;
            
        });
    }

    async getAllBusiness() {
        await this.dataStorageService.getLocalData("myBusiness").then((res) => {
            this.allBusiness = res;
            this.allBusiness.map(a => {
                a["name"] = a.businessname
                a["checked"] = false
            })
            //this.getAllRolesLevel(projectConstants.BUSINESS);
            return this.allBusiness;
        });
    }

    async getAllFacility() {
        await this.dataStorageService.getLocalData("myFacility").then((res) => {
            this.allFacility = res;
            this.allFacility.map(a => {
                a["name"] = a.facilityName
                a["checked"] = false
            })
            this.divisionsLength = res.length;
            //this.getAllRolesLevel(projectConstants.FACILITY);
            return this.allFacility;
        });
    }

    // resetFacilityFilter(type) {
    //     //click on resetdivision removed all business and facility
    //     switch (type) {
    //         case "division":
    //             this.DivisionAllChecked = false;
    //             this.registerUser.get("division").setValue([]);
    //             break;
    //         case "business":
    //             this.BusinessAllChecked = false;
    //             this.registerUser.get("business").setValue([]);
    //             break;
    //         case "facility":
    //             this.FacilityAllChecked = false;
    //             this.registerUser.get("facility").setValue([]);
    //             break;
    //     }
    // }
    receiveData(event) {
        let data=[]
        for(let i=0;i<event.length;i++)
        {
            const { name,checked, ...newObject } = event[i];
            data.push(newObject)
        }
        switch (this.roleLevel) {
            case "division":
                this.registerUser.get('division').setValue(data)
                this.registerUser.get("business").setValue([]);
                this.registerUser.get("facility").setValue([]);
                break;
            case "business":
                
                this.registerUser.get('business').setValue(data)
                this.registerUser.get("division").setValue([]);
                this.registerUser.get("facility").setValue([]);
                break;
            case "facility":
                // for sub labels in facility
                this.registerUser.get('facility').setValue(data)
                this.registerUser.get("division").setValue([]);
                this.registerUser.get("business").setValue([]);
                break;
        }
    }
}
