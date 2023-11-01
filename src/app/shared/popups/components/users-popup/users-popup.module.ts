import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersPopupComponent } from './users-popup.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShortNamePipe } from 'src/app/shared/services/filters/short-name.pipe';
import { ManageRoleModule } from 'src/app/shared/components/manage-role/manage-role.module';
import { RoleLevelMultiFacilityFilterModule } from 'src/app/shared/components/role-level-multi-facility-filter/role-level-multi-facility-filter.module';

@NgModule({
  declarations: [UsersPopupComponent,ShortNamePipe,
],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ManageRoleModule,
    RoleLevelMultiFacilityFilterModule,

    RouterModule.forChild([{ path: '', component: UsersPopupComponent }])
  ],
  exports: [UsersPopupComponent],
  providers: [ShortNamePipe,
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersPopupModule { }
