import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { APIResources, Assets, projectConstants } from 'src/app/app.constant';
import { GetUsers } from 'src/app/modals/get-users.model';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
    selector: 'app-users-groups',
    templateUrl: './users-groups.page.html',
    styleUrls: ['./users-groups.page.scss'],
})
export class UsersGroupsPage implements OnInit {
    users: any = [];
    userGroupsData: any = [];
    modalRef: BsModalRef;
    userDetails: any;
    groupDetails: any;
    @ViewChild('userRoles') userRoles: TemplateRef<any>;
    userId: any;
    groupId: any;
    userGroupId: any;
    message: any;
    common_title: any;
    searchText: any = '';
    userGroupSearchText: any;
    userPageNumber: number = 1;
    userGroupPageNumber: number = 1;
    userRow: number = projectConstants.USER_DEFAULT_PAGE_SIZE;
    userGroupRow: number = projectConstants.USER_DEFAULT_PAGE_SIZE;
    pageSizes: number[] = [5, 10, 15, 20, 50, 100];

    stringValues: any;
    labelStringResources: any;
    is_userGroupsActive: any = false;
    is_groupsMemberActive: any = false;
    is_userGroupsScreen: any = true;
    skipSuccess: any;
    modalType: any;
    totalUserRecords: any;
    totalGroupRecords: any
    showDivisionBuFaclilityData: any;
    viewOnlyAdmin: any = projectConstants.VIEWONLYADMIN;
    loginUserRole: any;
    divisionId: any;
    facilityId: any;
    businessId: any;
    private routeSubscription: Subscription;
    totalUsersToDisplay: any;
    isDataLoading: boolean = false;
    private subScribeUserGroupListRefresh: Subscription;
    accessLevel: any;

    constructor(public commonService: CommonService, private modalService: BsModalService,
        public httpWrapperService: HttpWrapperService, public dataStorageService: DataStorageService, private route: ActivatedRoute,
        private authService: AuthService, private globalErrorHandlerService: GlobalErrorHandlerService, private cdr: ChangeDetectorRef) {
    }

    async ngOnInit() {
        await this.authService.isAccessTokenValid().then((valid: boolean) => {
            if (!valid) {
                this.globalErrorHandlerService.openErrorModal(projectConstants.ERR_SESSION_EXPIRED);
            } else {
                this.getLoginUserRole();
                this.getStringResourcesForUsersGroups();
                this.divisionId = 0;
                this.businessId = 0;
                this.facilityId = 0;
            }
        });

        this.commonService.getUserAddUpdate().subscribe((isSaveUpdate: boolean) => {
            if (isSaveUpdate) {
                this.getUsers();
            }
        });

        this.routeSubscription = this.route.params.subscribe(() => {
            // Call the method to refresh your component here
            this.getLoginUserRole();
            this.getStringResourcesForUsersGroups();
            this.userGroupPageNumber = 1;
            this.userPageNumber = 1
            this.searchText = '';
            this.userRow = projectConstants.USER_DEFAULT_PAGE_SIZE;
            this.userGroupRow = projectConstants.USER_DEFAULT_PAGE_SIZE;
            if (this.divisionId == undefined && this.businessId == undefined && this.facilityId == undefined) {
                this.divisionId = 0;
                this.businessId = 0;
                this.facilityId = 0;
            }
            // On page load or route call get users and groups
            this.getUsers();
            this.getGroups();
        });

        this.subScribeUserGroupListRefresh = this.commonService.getRefreshUserGroupList().subscribe((isDeleteUserFromGroup: boolean) => {
            if (isDeleteUserFromGroup) {
                this.getGroups();
            }
        });


    }

    triggerFromPaginationEmit(data: any) {
        if (data.paginationName === "U") {
            this.userPageNumber = data.pageNumber
            this.userRow = data.pageSizes
            this.getUsers()
        }
        else if (data.paginationName === 'UG') {
            this.userGroupPageNumber = data.pageNumber
            this.userGroupRow = data.pageSizes
            this.getGroups()
        }

    }

    ngOnDestroy() {
        this.isDataLoading = false;
        this.routeSubscription.unsubscribe();
        this.subScribeUserGroupListRefresh.unsubscribe();
    }

    async getLoginUserRole() {
        let getLoginUserRole = await this.dataStorageService.getLocalData('loginUserRole');
        if (getLoginUserRole) {
            this.loginUserRole = getLoginUserRole[0].roleCode;
        }
    }

    receiveFacilityFilterData(data: any) {
        if (data != '' && data.facilityId != undefined) {
            this.userPageNumber = 1; //every time click on show  pageNumber set as 1
            this.userGroupPageNumber = 1;
            this.divisionId = data.divisionId;
            this.businessId = data.businessId;
            this.facilityId = data.facilityId;
            this.getUsers();
            this.getGroups();
        }
    }

    //Fetch label names for  user and Groups forms and madal popup    
    async getStringResourcesForUsersGroups() {
        try {
            let getStringSFromLocalData = await this.dataStorageService.getLocalData("stringResources");
            if (getStringSFromLocalData) {
                this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, "USERGROUP")
            }
        } catch (e) {
            console.log('error', e);
        }
    }


    /**
     * @function use- get all users for pageload and as per filter update users array
     * @param facilityFilter - single filter functionality for user
     */
    async getUsers() {
        let getuser = new GetUsers();
        getuser.divisionId = this.divisionId;
        getuser.businessId = this.businessId;
        getuser.facilityId = this.facilityId;
        getuser.pageNumber = this.userPageNumber; //this.config.currentPage;
        getuser.pageSize = this.userRow //this.config.itemsPerPage;
        getuser.searchKeyword = this.searchText.trim();
        this.httpWrapperService.post(APIResources.getUserByAccess, getuser)
            .subscribe({
                next: (data) => {
                    //sort by asc order
                    this.totalUsersToDisplay = data.totalUserRecords;
                    if (this.totalUsersToDisplay > 0) {
                        this.totalUserRecords = this.totalUsersToDisplay;
                    }
                    const sortUsers = this.sortData(data.usersByAccess);
                    if (sortUsers != undefined) {
                        this.users = sortUsers; //data.usersByAccess;    
                        this.isDataLoading = true;
                    }
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    // Handle the error
                    this.globalErrorHandlerService.openErrorModal(error.message);
                }
            })
    }

    /**
     * 
     * @param data - user-managment-ui.json All data
     * @param facilityFilter - selected facility filter data.
     * @param type - user/group
     * @returns - filter user/group data
     */

    findUserAndGropsByFacilityFilter(data, facilityFilter, type) {
        let sortUserGroupResult = [];
        data.filter(x => {
            let roles = (type === projectConstants.USER) ? x.UserRoles : x.UserGroupRole;
            if (roles != '' && roles.length > 0) {
                roles.filter(y => {
                    let facilityInfo = (type === projectConstants.USER) ? y.FacilityInfo : y.Facility_Info;
                    if (facilityInfo != '' && facilityInfo.length > 0) {

                        let result = facilityInfo.filter(item => item.DivisionName.toLowerCase() == facilityFilter.divisionName.toLowerCase());
                        if (result.length > 0) {
                            sortUserGroupResult.push(x);
                        }
                    }
                })
            }
        });
        return sortUserGroupResult;
    }

    getGroups() {
        let getUserGroups = new GetUsers();
        getUserGroups.divisionId = this.divisionId;
        getUserGroups.businessId = this.businessId;
        getUserGroups.facilityId = this.facilityId;
        getUserGroups.pageNumber = this.userGroupPageNumber;
        getUserGroups.pageSize = this.userGroupRow;
        getUserGroups.searchKeyword = this.searchText.trim();
        this.httpWrapperService.post(APIResources.getUserGroupByAccess, getUserGroups)
            .subscribe({
                next: (data) => {
                    this.totalGroupRecords = 100;
                    if (this.totalGroupRecords > 0) {
                        this.userGroupsData = data.slice().sort((a, b) => a.usergroupname.localeCompare(b.usergroupname));

                    }
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    this.globalErrorHandlerService.openErrorModal(error.message);
                }
            })

    }


    sortData(userList: any) {
        return [...userList].sort(this.compareName)
    }
    compareName(a: any, b: any) {
        const firstNameComparison = a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase()); if (firstNameComparison !== 0) { return firstNameComparison; } return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
    }

    //Open User Role Modal popup 
    openUserRoleModal(template: TemplateRef<any>, UserId: any) {
        if (UserId != '' && UserId != undefined) {
            let userRoles = this.getUserById(UserId);
            this.userDetails = userRoles;
        }
        this.modalRef = this.modalService.show(template, {
            class: 'modal-dialog-centered modal-lg',
            backdrop: 'static',
            ignoreBackdropClick: true
        });

    }

    //get single user details by userId in existing array
    getUserById(id: any) {
        return this.users.filter((x: { userid: any; }) => x.userid === id);
    }

    // open create/edit user popup
    usersDetailsModal(template: TemplateRef<any>, userId: any) {
        this.modalRef = this.modalService.show(template, {
            class: 'modal-dialog-centered modal-xl',
            backdrop: 'static',
            ignoreBackdropClick: true
        });
        //single user record
        this.userDetails = this.getUserById(userId);
        // if userid is = 0 means is new user and if userId !=0 means is edit user.
        this.userId = (userId != undefined && userId != 0) ? userId : 0;
    }

    //get single user details by userId in existing array
    openUserGroupModal(userGroupPopupTemplate: TemplateRef<any>, userGroupId: any) {
        this.accessLevel = {
            businessId: this.businessId,
            divisionId: this.divisionId,
            facilityId: this.facilityId
        }

        this.modalRef = this.modalService.show(userGroupPopupTemplate, {
            class: 'modal-dialog-centered modal-xl',
            backdrop: 'static',
            ignoreBackdropClick: true
        });
        this.groupDetails = this.getUserGroupsById(userGroupId);
        this.userGroupId = (userGroupId != undefined && userGroupId != 0) ? userGroupId : 0;
    }

    // Open delete Modal popup for users and groups
    deleteUsersGroupModal(template: TemplateRef<any>, modalType: any, flag: any) {
        // skip success modal popup
        this.skipSuccess = (flag == true) ? true : false;
        if (modalType === 'user') {
            this.modalType = 'user';
            this.message = 'Do you really want to remove user?';
        } else {
            this.modalType = 'group';
            this.message = 'Do you really want to remove this user group?';
        }
        this.common_title = 'Confirmation!';
        this.modalRef = this.modalService.show(template, {
            class: 'modal-dialog-centered modal-sm',
            backdrop: 'static',
            ignoreBackdropClick: true
        });
    }

    //Open Group details modal popup for user list
    usersGroupDetailsModal(template: TemplateRef<any>, UserId: any) {
        if (UserId != '' && UserId != undefined) {
            let userGroups = this.getUserById(UserId);
            //define user array or object 
            if (userGroups[0].usergroups.length !== 0) {
                this.userDetails = userGroups;
                this.modalRef = this.modalService.show(template, {
                    class: 'modal-dialog-centered modal-md',
                    backdrop: 'static',
                    ignoreBackdropClick: true
                });
            } else {
                this.is_userGroupsActive = true;
            }
        }
    }


    // Create and Edit Modal for user group
    userGroupOpenModal(template: TemplateRef<any>, userGroupId: any) {
        if (userGroupId != '' && userGroupId != undefined) {
            let singleGroupData = this.getUserGroupsById(userGroupId);
            this.groupDetails = singleGroupData;
        }
        this.modalRef = this.modalService.show(template, {
            class: 'modal-dialog-centered modal-xl',
            backdrop: 'static',
            ignoreBackdropClick: true
        });
    }

    /**
     * get single groups details by groupId in existing array
     */
    getUserGroupsById(id: any) {
        return this.userGroupsData.filter((x: { usergroupid: any; }) => x.usergroupid === id);
    }

    groupMembersDetailsModal(template: TemplateRef<any>, userGroupId: any) {
        if (userGroupId != '' && userGroupId != undefined) {
            let singleGroupData = this.getUserGroupsById(userGroupId);
            this.groupDetails = singleGroupData;
            this.modalRef = this.modalService.show(template, {
                class: 'modal-dialog-centered modal-md',
                backdrop: 'static',
                ignoreBackdropClick: true
            });
        } else {
            this.is_groupsMemberActive = true;
        }
    }

    getSearchResult(searchResultFor: string) {
        if (searchResultFor == 'U') {
            if (this.searchText.length > 3) {
                this.userPageNumber = 1;
                this.getUsers();
            } else if (this.searchText.length === 0) {
                this.getUsers(); // remove value in search textbox
            }
        }
        else {
            if (this.searchText.length > 3) {
                this.userGroupPageNumber = 1;
                this.getGroups();
            }
        }
    }

}
