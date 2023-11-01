import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Assets, Roles } from 'src/app/app.constant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/internal/operators/filter';
@Component({
    selector: 'app-facility-filter',
    templateUrl: './facility-filter.component.html',
    styleUrls: ['./facility-filter.component.scss'],
})
export class FacilityFilterComponent implements OnInit {
    @Input('is_userGroupsScreen') public is_userGroupsScreen;

    stringValues: any;
    selectedDivision: any;
    selectedBu: any;
    selectedFacility: any;
    selectedDivisionName: any;
    selectedBuName: any;
    selectedFacilityName: any;
    divisions: any = [];
    business: any = [];
    facilities: any = [];
    selectedData: any;
    @Output() forms = new EventEmitter<any>();
    @Output() faclilityFilterData = new EventEmitter<any>(); //send filter data to user-group-pate component
    businessId: number;
    facilityId: number;
    divisionId: number;
    divisionArrowIcon: Assets;
    businessArrowIcon: Assets;
    facilityArrowIcon: Assets;
    routerSubscription = new Subscription();
    showResultFor: string

    constructor(private route: ActivatedRoute, private storageService: DataStorageService, private commonService: CommonService,
        private router: Router, private _cdr: ChangeDetectorRef, private modalService: BsModalService) {
        this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(async (event: NavigationEnd) => {
                this.getStringResources();
                this.getIdFromLocalStorage();
                this._cdr.markForCheck();
            })
    }

    ngOnInit() {
        this.businessArrowIcon = Assets.ARROW_DOWN;
        this.divisionArrowIcon = Assets.ARROW_DOWN;
        this.facilityArrowIcon = Assets.ARROW_DOWN;
        this.getBusiness();
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    onDropdownOpen(entity: string) {
        if (entity === Roles.DIVISION) {
            this.divisionArrowIcon = Assets.ARROW_COLLAPSE;
        }
        else if (entity === Roles.BUSINESS) {
            this.businessArrowIcon = Assets.ARROW_COLLAPSE;
        }
        else {
            this.facilityArrowIcon = Assets.ARROW_COLLAPSE;
        }
    }

    onDropdownClose(entity: any) {
        if (entity === Roles.DIVISION) {
            this.divisionArrowIcon = Assets.ARROW_DOWN;
        }
        else if (entity === Roles.BUSINESS) {
            this.businessArrowIcon = Assets.ARROW_DOWN;
        }
        else {
            this.facilityArrowIcon = Assets.ARROW_DOWN;
        }
    }

    async getStringResources() {
        try {
            let getStringSFromLocalData = await this.storageService.getLocalData("stringResources");
            if (getStringSFromLocalData) {
                this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, "USERGROUP")
            }
        } catch (e) {
            console.log('error', e);
        }
    }

    getBusiness() {
        this.storageService.getLocalData("myBusiness").then((res) => {
            this.business = res;
            if (this.business.length > 0) {
                this.business = this.business.sort((x, y) => x.businessname.localeCompare(y.businessname));
                this.business.unshift({ businessname: "All", id: 0 }); //push data in existing array obj.
                const index = this.business.findIndex(x => x.id === this.businessId);
                this.selectBusiness(this.business[index]);
            } else {
                this.selectBusiness(this.business);
            }
        });
    }

    //sets the first Business associated to that division in dropdown at the launch of application
    selectBusiness(bu?: any) {
        if (bu?.businessname != undefined && bu?.id != undefined) {
            this.selectedBuName = bu.businessname;
            this.businessId = bu.id;
            this.getDivisions(bu);//{}
        } else {
            this.getDivisions(bu);//[]
        }

    }

    getDivisions(bu?: any) {
        
        this.storageService.getLocalData("myDivision").then((res) => {
            this.divisions = res;
            
            if (this.divisions.length > 0) {
                this.divisions = this.divisions.sort((x, y) => x.divisionName.localeCompare(y.divisionName));
               
                
                if (bu && bu.id !== 0 && (bu.length > 0 || bu.length === undefined)) {
                    this.divisions = res.filter((d: any) => d.businessId === bu.id);
                }
                this.divisions.unshift({ divisionName: "All", id: 0, businessId: bu.id });
                if(bu.id!==this.selectedData?.businessId)
                {
                    this.selectDivision(this.divisions[0]);
                }
                else{
                    const index = this.divisions.findIndex(x => x.id === this.divisionId);
                     this.selectDivision(this.divisions[index]);
                }
                
            } else {
                this.selectDivision(this.divisions);
            }
        });
    }

    selectDivision(selectedDivision: any) {
        this.selectedDivisionName = selectedDivision?.divisionName;
        this.divisionId = selectedDivision?.id;
        this.getFacility(selectedDivision);
    }


    getFacility(div?: any) {

        this.storageService.getLocalData("myFacility").then((res) => {
            this.facilities = res
            if (this.facilities.length > 0) {
                this.facilities = res.sort((a, b) => a.facilityName.localeCompare(b.facilityName));
              
                if (div && (div.length > 0 || div.length === undefined)) {
                   
                    if (div.id && div.id !== 0) {
                        this.facilities = res.filter((f: any) => f.divisionid === div.id);
                    } 
                    else if (div.businessId && !(div.businessId === 0)) {
                        this.facilities = res.filter((f: any) => f.businessId === div.businessId);
                        
                    }
                    this.facilities.unshift({ facilityName: "All", id: 0, divisionid: this.divisionId, businessid: this.businessId });
                
                   
                    
                }
                if(div.id!==this.selectedData?.divisionId || div.businessId!==this.selectedData?.businessId)
                {
                     this.selectFacility(this.facilities[0]);
                }
                else
                {
                    const index = this.facilities.findIndex(x => x.id === this.facilityId);
                    this.selectFacility(this.facilities[index]);
                }
               
                
            }
        });
    }

    // sets the first facility associated respective business in dropdown
    selectFacility(facility: any) {
        this.selectedFacilityName = facility.facilityName;
        this.facilityId = facility.id;
    }


    getSearchResult() {
        // click on "show" button click send data to user-group-page
        this.selectedData = {
            divisionId: this.divisionId,
            businessId: this.businessId,
            facilityId: this.facilityId,
        }
        this.storageService.setLocalData("lastSelectedFacilityId", this.facilityId);
        this.storageService.setLocalData("lastSelectedDivisionId", this.divisionId);
        this.storageService.setLocalData("lastSelectedBusinessId", this.businessId);
        this.faclilityFilterData.emit(this.selectedData); // filter data to user-group-page component


    }

    facilityFilterReset() {
        this.businessId = 0; this.facilityId = 0; this.divisionId = 0; // reset user result
        this.getBusiness(); // reset dropdowns
        this.getSearchResult(); // Refresh data 
    }

    async getIdFromLocalStorage() {

        this.businessId = 0; this.facilityId = 0; this.divisionId = 0;
        let facilityId, divisionId, businessId;
        facilityId = await this.storageService.getLocalData("lastSelectedFacilityId")
        divisionId = await this.storageService.getLocalData("lastSelectedDivisionId")
        businessId = await this.storageService.getLocalData("lastSelectedBusinessId")

        if (facilityId != undefined && divisionId != undefined && businessId != undefined) {
            this.businessId = businessId;
            this.facilityId = facilityId;
            this.divisionId = divisionId;

        }
        this.getBusiness();
        this.getSearchResult();


    }
}










