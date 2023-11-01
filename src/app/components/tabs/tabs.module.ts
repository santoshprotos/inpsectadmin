import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { FacilitiesPage } from './facilities/facilities.page';
import { InspectionsPage } from './inspections/inspections.page';
import { RoleAssignmentPage } from './role-assignment/role-assignment.page';
import { UsersGroupsPage } from './users-groups/users-groups.page';
import { UsersGroupPopupModule } from 'src/app/shared/popups/components/users-group-popup/users-group-popup.module';
import { UsersPopupModule } from 'src/app/shared/popups/components/users-popup/users-popup.module';
import { CommonPopupModule } from 'src/app/shared/popups/components/common-popup/common-popup.module';
import { FreetextSearchPipe } from 'src/app/shared/services/filters/freetext-search.pipe';
import { FacilityFilterComponent } from './shared/facility-filter/facility-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    UsersGroupPopupModule,
    UsersPopupModule,
    CommonPopupModule,
    ReactiveFormsModule,
    SharedModule,   
    NgbModule,
    BsDatepickerModule.forRoot()
   
    
  ],
  declarations: [TabsPage,DashboardPage,FacilitiesPage,InspectionsPage,RoleAssignmentPage,UsersGroupsPage,FreetextSearchPipe, FacilityFilterComponent],
  providers:    [ FreetextSearchPipe ]
})
export class TabsPageModule {}
