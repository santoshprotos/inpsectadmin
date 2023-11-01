import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPopupComponent } from './common-popup.component';
import { RouterModule } from '@angular/router';

import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationModule } from 'src/app/shared/components/animation/animation.module';

@NgModule({
  declarations: [CommonPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: CommonPopupComponent }]),
    AnimationModule
  ],
  exports: [CommonPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonPopupModule { }
