
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShortNamePipe } from 'src/app/shared/services/filters/short-name.pipe';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { APIResources, Modal, projectConstants, Screens } from 'src/app/app.constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { UserData } from 'src/app/modals/user-data.model';
@Component({
    selector: 'app-users-popup',
    templateUrl: './users-popup.component.html',
    styleUrls: ['./users-popup.component.scss'],
})
export class UsersPopupComponent implements OnInit {
    @Input('modalRefFromUserComp') public modalRef: BsModalRef;
    @Input('userDetails') public userDetails: any;
    @Input('modalRefFromCreateUsers') public modalRefCreateUser: BsModalRef;
    @Input('userId') public editUserId: any;
    @Input('modalRefFromUserGroups') public modalRefUserGroups: BsModalRef;
    @ViewChild('combo', { static: true }) combo;

    registerUser: FormGroup;
    config: any;
    is_userDetails: boolean = false;
    is_userRole: boolean = false;
    is_userGroups: boolean = false;
    is_ssoLogin: boolean = false;
    is_editUser: boolean = false;
    is_contactorLogin: boolean = false;
    is_showSsoLogin: any = true;
    is_verify: any = false;
    submitted: boolean = false;
    userInfo: any;
    stringValues: any = [];
    is_superAdmin: any = false;
    userRole: any = '';
    loginUserRole: any;
    selectedValues: any = [];
    selectedBuName: any;
    FirstName: any = '';
    LastName: any = '';
    initialsOfName: any = '';
    Email: any = '';
    usercategorycode: any = projectConstants.SSOCODE;

    //for validation
    roleLevel: string = '';
    division: string = '';
    business: string = '';
    facility: string = '';
    isSuperAdmin: boolean = false;
    isFormSubmit: boolean = false;
    userData: UserData;
    errorMessage: string = '';
    viewOnlyAdmin: any = projectConstants.VIEWONLYADMIN;
    ssoLogin: any; //for edit
    contractorLogin: any;
    isVerifySuccess: any;
    isVerifyShow: any = false;
    userCategory: any;
    isStringValues: boolean = false;

    constructor(
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        public dataStorageService: DataStorageService,
        public commonService: CommonService,
        public shortNamePipe: ShortNamePipe,
        public httpWrapperService: HttpWrapperService,
        private authService: AuthService,
        private globalErrorHandlerService: GlobalErrorHandlerService,
        private httpService: HttpWrapperService,
    ) {
        this.registerUser = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
        });
    }

    async ngOnInit() {
        this.getStringValuesForModal();
        this.is_editUser = (this.editUserId > 0) ? true : false;

        if (this.userDetails !== undefined) {
            this.userInfo = this.userDetails[0];
        }
        if (this.editUserId != 0) {
            this.FirstName = this.userInfo.firstname;
            this.LastName = this.userInfo.lastName;
            this.Email = this.userInfo.email;
            this.ssoLogin = this.userInfo.loginname;
            this.contractorLogin = this.userInfo.loginname;
            this.isVerifySuccess = true;
            this.isVerifyShow = (this.userInfo.categoryCode === projectConstants.SSOCODE) ? true : false;;
            this.usercategorycode = this.userInfo.categoryCode;
            this.is_showSsoLogin = (this.userInfo.categoryCode === projectConstants.SSOCODE) ? true : false;
        }
        // check which modal popup click and open respective modal popup template.
        if (this.modalRefCreateUser !== undefined) {
            this.is_userDetails = true;
            this.is_userRole = false;
            this.is_userGroups = false;
        } else if (this.modalRef !== undefined) {
            this.is_userRole = true;
            this.is_userDetails = false;
            this.is_userGroups = false;
        } else if (this.modalRefUserGroups !== undefined) {
            this.is_userGroups = true;
        }
        //called functions
        this.formValidation();
        this.customValidation(projectConstants.SSOCODE);
        this.populateUserFromData();
        this.getLoginUserRole();
        this.getCategories();
        //  get value when select unselect superAdmin
        this.commonService.getIsSuperAdmin().subscribe((isSuperAdmin: boolean) => {
            this.isSuperAdmin = isSuperAdmin;
        });
    }

    async getLoginUserRole() {
        let getLoginUserRole = await this.dataStorageService.getLocalData('loginUserRole');
        if (getLoginUserRole) {           
            this.loginUserRole = getLoginUserRole[0].roleCode;
            this.is_superAdmin = (this.loginUserRole == projectConstants.SUPERADMIN) ? true : false;
        }
    }

    shortname(firstName: string, lastName: string) {       
        this.initialsOfName = firstName + this.shortNamePipe.transform(lastName);
    }

    async getStringValuesForModal() {       
        let getStringSFromLocalData = await this.dataStorageService.getLocalData("stringResources");
        if (getStringSFromLocalData) {
            this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, "USERGROUP");
            this.isStringValues = true;
        }
    }

    formValidation() {
        this.registerUser = this.formBuilder.group({
            category: [projectConstants.SSO_USER, Validators.required],
            division: [''],
            business: [''],
            facility: [''],
            roleLevel: [''],
            sso_login: [''],
            contractor_login: [''],
            firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9](\.?[-a-zA-Z0-9_])*@[a-zA-Z0-9-]+(\.[a-zA-Z]+)+$/)]],
            initials: [''],
            userAdminRole: [],
            isRoleAndLevelFormValid: [true, Validators.required],
        });
    }

    async customValidation(category: string) {
        if (!this.is_editUser) {
            if (category === projectConstants.SSOCODE) {
                // new user create
                this.registerUser.get('sso_login').setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9](\.?[-a-zA-Z0-9_])*@[a-zA-Z0-9-]+(\.[a-zA-Z]+)+$/)]);
                this.registerUser.get('sso_login').updateValueAndValidity();
                this.registerUser.get('contractor_login').clearValidators();
                this.registerUser.get('contractor_login').updateValueAndValidity();
            } else {
                // new user create
                this.registerUser.get('sso_login').clearValidators();
                this.registerUser.get('sso_login').updateValueAndValidity();
                this.registerUser.get('contractor_login').setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9](\.?[-a-zA-Z0-9_])*@[a-zA-Z0-9-]+(\.[a-zA-Z]+)+$/)]);
                this.registerUser.get('contractor_login').updateValueAndValidity();
            }
        }

        if (this.is_editUser == true) {
            this.registerUser.get('division').clearValidators();
            this.registerUser.get('division').updateValueAndValidity();
        }

        if (this.roleLevel == '' && this.isSuperAdmin == false && !this.is_editUser) {
            this.registerUser.get('roleLevel').setValidators([Validators.required]);
            this.registerUser.get('roleLevel').updateValueAndValidity();
        }
    }

    trimData(string, key:any){   
        // remove space in 2 words 
        switch (key) {
            case 'firstName':
                this.FirstName = string.replace(/\s/g, "");    
            break;
            case 'lastName':
                this.LastName = string.replace(/\s/g, "");    
            break;
        }
                
    }

    populateUserFromData() {
        if (this.is_editUser) {
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerUser.controls; }

    // API Call for new user forms data save in database
    Save() {
        //To check Role and level from is valid
        if (this.editUserId === 0) {
            this.commonService.setRoleAndLevelFormValidity(true);
            this.addRemoveValidation(this.isSuperAdmin);
        }
        this.registerUser.get('initials').setValue(this.initialsOfName);
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerUser.invalid) {
            return;
        } else {
            if (this.editUserId > 0) {
                //update                
                this.saveUserDetails(this.editUserId)
            } else {
                //Add 
                this.saveUserDetails(0)
            }

        }
    }

    saveUserDetails(userId?: number) {
        this.userData = new UserData();
        this.userData.userId = userId;
        this.userData.userCategoryCode = this.registerUser?.value?.category;
        this.userData.loginName = this.registerUser?.value?.email;
        this.userData.firstName = this.registerUser?.value?.firstName;
        this.userData.lastName = this.registerUser?.value?.lastName;
        this.userData.shortName = this.registerUser?.value?.initials;
        this.userData.email = this.registerUser?.value?.email;
        this.userData.assignedLevel = this.registerUser?.value?.roleLevel.length > 0 ? this.registerUser?.value?.roleLevel : '';
        // Adding Role to the assignedRolesCodes array
        this.userData.assignedRolesCodes = this.registerUser?.value?.userAdminRole || [];

        // Adding AssignedEntities object to the assignedEntitieIds array
        let divisions = this.registerUser?.value?.division;
        let business = this.registerUser?.value?.business;
        let facility = this.registerUser?.value?.facility;

        if (divisions.length > 0) {
            for (const division of divisions) {
                this.userData.assignedEntitieIds.push(division.id);
            }
        }

        if (business.length > 0) {
            for (const businessItem of business) {
                this.userData.assignedEntitieIds.push(businessItem.id);
            }
        }

        if (facility.length > 0) {
            for (const facilityItem of facility) {
                this.userData.assignedEntitieIds.push(facilityItem.id);
            }
        }
        this.saveUser(this.userData);
    }

    async saveUser(userData: any) {
        this.httpService.post(APIResources.Save, userData)
            .subscribe({
                next: (data) => {
                    // Handle the response data
                    if (data) {
                        this.modalRefCreateUser.hide();
                        this.commonService.setUserAddUpdate(true);
                        if (this.editUserId > 0) {
                            this.commonService.openMessageModal(projectConstants.USER_UPDATED_SUCCESSFULLY, Screens.USER_GROUP, Modal.SUCCESS); // show success message modal
                        } else {
                            this.commonService.openMessageModal(projectConstants.USER_ADDED_SUCCESSFULLY, Screens.USER_GROUP, Modal.SUCCESS);
                        }
                    } else {
                        this.globalErrorHandlerService.openErrorModal(); // show internal server error if result return false
                    }
                },
                error: (error) => {
                    // Handle the error
                    this.globalErrorHandlerService.openErrorModal(error.message);
                },
                complete: () => {
                    // Handle the completion of the observable if needed
                }
            })
    }

    /**
     * @function use : on formSubmit add/remove roleLevel and Multi select division/business/facility validation
     * @param isSuperAdmin = true/false
     */
    addRemoveValidation(isSuperAdmin) {
        if (isSuperAdmin == true) {
            this.registerUser.get('roleLevel').clearValidators();
            this.registerUser.get('roleLevel').updateValueAndValidity();
            this.registerUser.get('division').clearValidators();
            this.registerUser.get('division').updateValueAndValidity();
            this.registerUser.get('business').clearValidators();
            this.registerUser.get('business').updateValueAndValidity();
            this.registerUser.get('facility').clearValidators();
            this.registerUser.get('facility').updateValueAndValidity();
            this.registerUser.get('roleLevel').setValue([]);
            this.registerUser.get('division').setValue([]);
            this.registerUser.get('business').setValue([]);
            this.registerUser.get('facility').setValue([]);
            this.commonService.setIsUserFormSubmit(true);
        } else {
            this.registerUser.get('roleLevel').setValidators([Validators.required]); //add validation
            this.registerUser.get('roleLevel').updateValueAndValidity();

            switch (this.registerUser.value.roleLevel) {
                case 'division':
                    this.registerUser.get('division').setValidators([Validators.required]);
                    this.registerUser.get('division').updateValueAndValidity();
                    break
                case 'business':
                    this.registerUser.get('business').setValidators([Validators.required]);
                    this.registerUser.get('business').updateValueAndValidity();
                    break;
                case 'facility':
                    this.registerUser.get('facility').setValidators([Validators.required]);
                    this.registerUser.get('facility').updateValueAndValidity();
                    break;
            }
            this.commonService.setIsUserFormSubmit(false);
        }
    }

    // SSO Login and Contractor Login verify functionality
    async onVerifyUser(email: string, type: string) {    
        let validEmail = await this.commonService.isValidEmailFormat(email);
        if (!validEmail) {
            this.is_verify = false;
            this.errorMessage = this.stringValues?.EMAIL_IS_INVALID;
        } else {
            this.errorMessage = '';
            let accessToken = await this.authService.getAccessToken();
            this.verifyUser(type, email, accessToken, this.editUserId);
        }

    }

    verifyUser(type: string, email: string, accessToken: any, userId?:any) {
        const url = `${APIResources.availability}?pLoginName=${email}&pCategoryCode=${type}&pUserid=${userId}`;
      
        this.httpWrapperService.get(url).subscribe(async (result) => {
            if (result == true || Object.keys(result).length) {
                this.Email = email;
                this.is_verify = true;
                this.isVerifySuccess = true;
                if (type == projectConstants.CONTRACTOR) {
                    this.registerUser.value.contractor_login = email;
                } else if (type == projectConstants.SSO_USER) {
                    this.registerUser.value.sso_login = email;
                }
            }
        }, (err: any) => {
            if (!this.is_editUser) {
                this.isVerifySuccess = false; this.is_verify = false;              
                if (err.message == projectConstants.ERR_USER_ALREADY_EXISTS) {
                    this.errorMessage = this.stringValues?.USER_ALREADY_EXISTS;
                    this.Email = '';
                } else {
                    this.Email = '';
                    this.globalErrorHandlerService.openErrorModal(err.message);
                }
            } else {
                //edit user
                if (type == projectConstants.SSO_USER) {
                    this.isVerifySuccess = false;   this.is_verify = false;                  
                    if (err.message == projectConstants.ERR_USER_ALREADY_EXISTS) {
                        this.errorMessage = this.stringValues?.USER_ALREADY_EXISTS;
                        this.Email = email;
                    } else {
                        this.Email = email;
                        this.globalErrorHandlerService.openErrorModal(err.message);
                    }
                }
            }

        });
    }

    onRadioChange(val: string) {      
        this.is_showSsoLogin = (val === projectConstants.SSOCODE) ? true : false;
        this.usercategorycode = val;
        if (!this.editUserId) {          
            this.errorMessage = '';
            this.registerUser.get("email").setValue([]);
            this.registerUser.get("sso_login").setValue([]);
            this.registerUser.get("contractor_login").setValue([]);
            this.is_verify = false;
        } else {
          
            this.registerUser.get("email").setValue(this.Email);
            this.registerUser.get("sso_login").setValue(this.ssoLogin);
            this.registerUser.get("contractor_login").setValue(this.contractorLogin);
            if (this.is_showSsoLogin === false) {
                this.isVerifyShow = false;
            }else if(this.is_showSsoLogin === true){ // edit user - contractor to sso,  then disable save btn
                this.isVerifySuccess = false;
            }else{
                this.isVerifySuccess = true; // edit user - sso to contrctor,  then enable save btn
            }
           
        }
        this.customValidation(val);
    }

    keypress(event: KeyboardEvent) {
        if (this.ssoLogin === '' || this.contractorLogin === '') {
            this.isVerifyShow = false;
            this.isVerifySuccess = false;
            this.Email = '';
            this.is_verify = false;
        } else {
            this.isVerifyShow = true;
        }
    }

    async getCategories() {
        await this.dataStorageService.getLocalData("userCategoryMaster").then((res) => {
            this.userCategory = res;          
            return this.userCategory;
        });
    }
}
