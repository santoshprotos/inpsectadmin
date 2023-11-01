import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageRoleComponent } from './manage-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ManageRoleComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule
  ],
  exports:[ManageRoleComponent]
})
export class ManageRoleModule { }



