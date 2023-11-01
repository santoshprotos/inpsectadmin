
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonService } from 'src/app/shared/services/common.service';
import { ShortNamePipe } from 'src/app/shared/services/filters/short-name.pipe';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { Actions, APIResources, Modal, projectConstants, Screens } from 'src/app/app.constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { UserData } from 'src/app/modals/user-data.model';
import { UserGroupData } from 'src/app/modals/user-group.modal';
import { GetUsers } from 'src/app/modals/get-users.model';
import { Subscription } from 'rxjs/internal/Subscription';


interface Item {
    userid: any;
    id: number;
    name: string;
}

@Component({
    selector: 'app-users-group-popup',
    templateUrl: './users-group-popup.component.html',
    styleUrls: ['./users-group-popup.component.scss'],
})
export class UsersGroupPopupComponent implements OnInit {
    @Input('modalRefFromUserComp') public modalRef: BsModalRef;
    @Input('userDetails') public userDetails: any;
    @Input('modalRefFromCreateUsers') public modalRefCreateUser: BsModalRef;
    @Input('userId') public editUserId: any;
    @Input('modalRefFromUserGroups') public modalRefUserGroups: BsModalRef;
    @ViewChild('combo', { static: true }) combo;
    @Input('modalRefFromGroupCreateEdit') public modalRefCreateEdit: BsModalRef;
    @Input('groupId') public editGroupId: any;
    @Input('modalRefFromGroupMembersDetails') public modalRefMembersDetails: BsModalRef;
    @Input('groupDetails') public groupDetails: any;
    // @Input('users') public memberDetails: any[];
    @Input('accessLevel') public accessLevel: any;



    registerUser: FormGroup;
    config: any;
    is_userDetails: boolean = false;
    is_userRole: boolean = false;
    is_userGroups: boolean = false;
    is_editUser: boolean = false;
    is_editUserGroup: boolean = false;
    categoryCode: any = projectConstants.SSOCODE;
    submitted: boolean = false;




    userInfo: any;
    stringValues: any = [];
    is_superAdmin: any = false;
    userRole: any = '';
    loginUserRole: any;
    selectedValues: any = [];
    selectedBuName: any;
    is_usersGroupRoles: boolean = false;
    is_groupDetails: boolean = false;
    stringLabelValues: any;
    registerGroup: any;
    is_groupMembers: boolean = false;
    data: any;
    selectedUsers: any;
    groupInfo: any;
    optionsModel: number[];
    isSuperAdmin: boolean = false;
    isStringValues: boolean = false;
    is_addMember: boolean = false;
    selectedItems: Item[] = [];
    selectedMembers: any;
    selectUser = [];




    //for validation
    roleLevel: string = '';
    division: string = '';
    business: string = '';
    facility: string = '';
    userGroupName: string = '';
    // isSuperAdmin: boolean = false;
    isFormSubmit: boolean = false;
    userData: UserData;
    userGroupData: UserGroupData;
    errorMessage: string = '';
    viewOnlyAdmin: any = projectConstants.VIEWONLYADMIN;
    ssoLogin: any; //for edit
    contractorLogin: any;
    isVerifySuccess: any;
    isVerifyShow: any = false;
    userCategory: any;
    // isStringValues: boolean = false;

    memberAllChecked: boolean = false;
    members: any = [];
    fullNames: any;
    allMembers: any = [];
    selectedItemCount = 0;
    removedUser: any;
    subscription = new Subscription();

    uGroupName: any;
    isDeletedFromDB: boolean = false;
    

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
        private cdr: ChangeDetectorRef,




    ) {
        this.registerUser = this.formBuilder.group({
            members: new FormControl([]) // Initialize with an empty array or default values
        });
    }

    async ngOnInit() {
        this.getMembers();
        this.getStringValuesForModal();
        this.selectedMembers = this.members[0];
        // this.selectAllForDropdownItems(this.members);
        this.is_editUserGroup = (this.editGroupId > 0) ? true : false;
        if (this.groupDetails !== undefined) {
            this.groupInfo = this.groupDetails[0];
        }
        // if (this.editGroupId != 0) {
        //     this.uGroupName = this.groupInfo.usergroupname;
        //     if (this.groupInfo.usergroupname.length > 0) {
        //         this.registerUser.get("members").setValue(this.groupInfo?.userGroupMenbers);
        //         this.selectedItems = this.groupInfo?.userGroupMenbers;
        //         this.selectedItems = this.selectedItems.map((item: any) => {
        //             const fullName = `${item.firstName || ''} ${item.lastName || ''}`;
        //             return { ...item, fullName };
        //         });
        //         this.selectedItemCount = this.selectedItems.length;
        //     }
        // }

        if (this.modalRef !== undefined) {
            this.is_usersGroupRoles = true;
            this.is_groupDetails = false;
            this.is_groupMembers = false;
        } else if (this.modalRefCreateEdit !== undefined) {
            this.is_groupDetails = true;
            this.is_usersGroupRoles = false;
            this.is_groupMembers = false;
            this.isVerifySuccess = true;
        } else if (this.modalRefMembersDetails !== undefined) {
            this.is_groupMembers = true;
            this.is_usersGroupRoles = false;
            this.is_groupDetails = false;
        }
        //called functions
        this.formValidation();
        this.customValidation(projectConstants.SSOCODE);
        //  get value when select unselect superAdmin
        this.commonService.getIsSuperAdmin().subscribe((isSuperAdmin: boolean) => {
            this.isSuperAdmin = isSuperAdmin;
        });

        this.subscription = this.commonService.getDeleteUserFromUserGroup().subscribe((isUserDeleteFromUserGroup: boolean) => {
            if (isUserDeleteFromUserGroup) {
                this.removeUser();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    bindOnEditUserGroup() {
        this.isDeletedFromDB= false;
        if (this.editGroupId != 0) {
            this.registerUser.get("userGroupName").setValue(this.groupInfo?.usergroupname);
            this.registerUser.get("members").setValue(this.groupInfo?.userGroupMenbers);
            this.selectedItems = this.groupInfo?.userGroupMenbers;
            this.selectedItems = this.selectedItems.map((item: any) => {
                const fullName = `${item.firstName || ''} ${item.lastName || ''}`;
                return { ...item, fullName };
            });
            this.isDeletedFromDB= true;
            this.selectedItemCount = this.selectedItems.length;
            this.selectedMembers = [];
            this.selectedItems.forEach((item: any) => {
                this.toggleMemberExistence(item, true);
            });
        }
    }


    // findAlreadyExitMember(item: any) {
    //     const member = this.members.find((r) => r.userid === item.userid);
    //     if (member) {
    //         member.IsExist = true;
    //         member.disabled = true;
    //         this.selectedMembers.push(member);
    //     }
    // }

    // resetMemberDisabled(item: any) {
    //     const member = this.members.find((r) => r.userid === item);
    //     if (member) {
    //       member.IsExist = false;
    //       member.disabled = false;
    //       this.selectedMembers.push(member);
    //     }
    //   }

    toggleMemberExistence(item: any, exists: boolean) {
        const member = this.members.find((r) => r.userid === item);
    
        if (member) {
            member.IsExist = exists;
            member.disabled = exists ? true : false;
    
            if (exists) {
                this.selectedMembers.push(member);
            } else {
                // If it doesn't exist, remove it from the selectedMembers array
                const index = this.selectedMembers.findIndex((selectedMember) => selectedMember.userid === item);
                if (index !== -1) {
                    this.selectedMembers.splice(index, 1);
                }
            }
        }
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
            division: [''],
            business: [''],
            facility: [''],
            roleLevel: [''],
            members: [],
            userGroupName: ['', Validators.required],
            userAdminRole: [],
            isRoleAndLevelFormValid: [true, Validators.required],
        });
    }

    async customValidation(category: string) {
        if (this.is_editUser == true) {
            this.registerUser.get('division').clearValidators();
            this.registerUser.get('division').updateValueAndValidity();
        }

        if (this.roleLevel == '' && this.isSuperAdmin == false && !this.is_editUser) {
            this.registerUser.get('roleLevel').setValidators([Validators.required]);
            this.registerUser.get('roleLevel').updateValueAndValidity();
        }
    }



    // convenience getter for easy access to form fields
    get f() { return this.registerUser.controls; }

    // API Call for new user forms data save in database
    Save() {
        //To check Role and level from is valid
        if (this.editGroupId === 0) {
            this.commonService.setRoleAndLevelFormValidity(true);
            this.addRemoveValidation(this.isSuperAdmin);
        }
        this.submitted = true;

        if (this.isDeletedFromDB) {
            this.commonService.setRefreshUserGroupList(true);
        }
        // stop here if form is invalid
        if (this.registerUser.invalid) {
            return;
        } else {
            if (this.editGroupId > 0) {
                //update                
                this.saveUserGroupDetails(this.editGroupId)
            } else {
                //Add 
                this.saveUserGroupDetails(0)
            }

        }
    }

    saveUserGroupDetails(userGroupId?: number) {
        this.userGroupData = new UserGroupData();
        this.userGroupData.userGroupId = userGroupId;
        this.userGroupData.userGroupName = this.registerUser?.value?.userGroupName;
        this.userGroupData.assignedLevel = this.registerUser?.value?.roleLevel.length > 0 ? this.registerUser?.value?.roleLevel : '';
        // Adding Role to the assignedRolesCodes array
        this.userGroupData.assignedRolesCodes = this.registerUser?.value?.userAdminRole || [];

        // Adding AssignedEntities object to the assignedEntitieIds array
        let divisions = this.registerUser?.value?.division;
        let business = this.registerUser?.value?.business;
        let facility = this.registerUser?.value?.facility;

        if (divisions.length > 0) {
            for (const division of divisions) {
                this.userGroupData.assignedEntitieIds.push(division.id);
            }
        }

        if (business.length > 0) {
            for (const businessItem of business) {
                this.userGroupData.assignedEntitieIds.push(businessItem.id);
            }
        }

        if (facility.length > 0) {
            for (const facilityItem of facility) {
                this.userGroupData.assignedEntitieIds.push(facilityItem.id);
            }
        }

        //Adding User Group Members object      
        let selectedMembers: any = this.registerUser?.value?.members;
        if (selectedMembers.length > 0) {
            for (const member of selectedMembers) {
                this.userGroupData.usergroupmembers.push({ usergroupid: 0, userid: member.userid });
            }
        }
        this.saveUserGroup(this.userGroupData);
    }

    async saveUserGroup(userGroupData: any) {
        this.isDeletedFromDB= false;
        this.httpService.post(APIResources.saveUserGroup, userGroupData)
            .subscribe({
                next: (data) => {
                    // Handle the response data
                    if (data) {
                        // this.modalRefFromGroupCreateEdit.hide();
                        this.commonService.setUserAddUpdate(true);
                        if (this.editGroupId > 0) {
                            this.commonService.openMessageModal(projectConstants.USER_UPDATED_SUCCESSFULLY, Screens.USER_GROUP, Modal.SUCCESS); // show success message modal
                        } else {
                            this.commonService.openMessageModal(projectConstants.USER_ADDED_SUCCESSFULLY, Screens.USER_GROUP, Modal.SUCCESS);
                        }
                    } else {
                        this.globalErrorHandlerService.openErrorModal(); // show internal server error if result return false
                    }
                    this.isDeletedFromDB= true;
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

    removeUserFromGroup(user: any) {
        this.removedUser = user;
        this.commonService.openMessageModal(projectConstants.REMOVE_USER_FROM_GROUP_CONFIRMATION_MSG, Screens.USER_GROUP, Modal.CONFIRMATION, Actions.DELETE_USER_FROM_USERGROUP);
    }



    removeUser() {
        this.isDeletedFromDB = false;
        let user: any = this.removedUser;
        if (user.tempAdded) {
            this.removeItems(user);
        } else {
            if (this.editGroupId > 0) {
                const url = `${APIResources.deleteUserGroup}?userId=${user.userid}&groupid=${this.editGroupId}`;
                this.httpService.delete(url)
                    .subscribe({
                        next: (data) => {
                            // Handle the response data
                            if (data) {
                                this.removeItems(user); 
                                this.isDeletedFromDB = true;  
                                // this.toggleMemberExistence(user.userid, false);                                                                                                                                                                                                       
                                this.commonService.hideMessageModal();
                            }
                        }
                    })
            }
        }

    }


    removeItems(data: any) {
        let AllMembers = this.registerUser.value.members;
        this.selectedItems = [];
        AllMembers.forEach((value: any, index: number) => {
            if (value.userid == data.userid) {
                AllMembers.splice(index, 1);
            }
        });
        this.selectedItems = AllMembers;
        // Decrement the selected items count
        this.selectedItemCount--;
        this.registerUser.get("members").setValue(AllMembers);
        if (AllMembers.length > 0) {
            this.memberAllChecked = false;
        } else {
            this.is_addMember = false;
        }
        this.commonService.hideMessageModal();
        this.cdr.detectChanges();
    }

    /**
     * @function use : on formSubmit add/remove roleLevel and Multi select division/business/facility validation
     * @param isSuperAdmin = true/false
     */
    addRemoveValidation(isSuperAdmin: boolean) {
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

    onAddMember() {
        let selectedMembers = this.registerUser.value.members;
        this.selectedItems = [];
        this.selectedItemCount = 0;
        if (selectedMembers) {
            for (const member of selectedMembers) {
                if (!this.selectedItems.some(item => item.userid === member.userid && member.IsExist)) {
                    member.tempAdded = true;
                    this.selectedItems.push(member);
                    // Increment the selected items count
                    this.selectedItemCount++;
                }
            }
        }

    }

    toggleCheckAll(values: any) {
        if (values.currentTarget.checked) {
            this.selectAll();
            this.memberAllChecked = true;
            this.is_addMember = true;
        } else {
            this.unselectAll();
            this.memberAllChecked = false;
            this.is_addMember = false;
        }
    }

    selectAll() {
        this.registerUser.get("members").setValue([]);
        // this.getMembers();
        this.registerUser.get("members").setValue(this.members);
    }
    unselectAll() {
        this.registerUser.get("members").setValue([]);
    }


    onMemberSelectionChange(event: any) {
        if (Array.isArray(event)) {
            this.memberAllChecked = false;
            // let selectedMembers = this.registerUser.value.members;
            if (event.length == 0) {
                this.is_addMember = false;
                this.registerUser.get("members").setValue([]);
            } else {
                this.is_addMember = true;
            }
        }
    }



    async getMembers() {
        let getUsers = new GetUsers();
        getUsers.divisionId = this.accessLevel.divisionId;
        getUsers.businessId = this.accessLevel.businessId;
        getUsers.facilityId = this.accessLevel.facilityId;
        getUsers.pageNumber = 1;
        getUsers.pageSize = 100; //need to change later or change in API

        this.commonService.getUserByAccess(getUsers, this.httpService).then((res: any) => {
            let users = res?.usersByAccess;
            if (users.length > 0) {
                this.members = users.map((item: any) => {
                    const fullName = `${item.firstname || ''} ${item.lastName || ''}`;
                    return { ...item, fullName };
                });
            }
        }).catch((err: any) => {
            this.globalErrorHandlerService.openErrorModal(err.message);
        }).finally(() => {
            //on Edit bind Data to form
            this.bindOnEditUserGroup();
        });
    }

    hideModal() {
        if (this.isDeletedFromDB) {
            this.commonService.setRefreshUserGroupList(true);
        }
        this.modalRefCreateEdit.hide()
    }


    searchMemberDropdown(searchTerm: string, eachObject) {
        let replacedKey = searchTerm.replace(/[,\.-\s]/g, '')
        let newRegEx = new RegExp(replacedKey, 'gi');
        let purgedName = eachObject.firstname.replace(/[,\.-\s]/g, '')
        if (newRegEx.test(purgedName)) {
          return true
        }
        return false
    }
}
