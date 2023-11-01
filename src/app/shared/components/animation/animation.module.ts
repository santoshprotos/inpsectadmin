import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationComponent } from './animation.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AnimationComponent }])

  ],
  declarations: [AnimationComponent],
  exports: [AnimationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimationModule { }
