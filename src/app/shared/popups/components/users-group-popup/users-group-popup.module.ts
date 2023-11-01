import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersGroupPopupComponent } from './users-group-popup.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoleLevelMultiFacilityFilterModule } from 'src/app/shared/components/role-level-multi-facility-filter/role-level-multi-facility-filter.module';
import { ManageRoleModule } from 'src/app/shared/components/manage-role/manage-role.module';

@NgModule({
  declarations: [UsersGroupPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RoleLevelMultiFacilityFilterModule,
    ManageRoleModule,
    RouterModule.forChild([{ path: '', component: UsersGroupPopupComponent }])
  ],
  exports: [UsersGroupPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersGroupPopupModule { }
