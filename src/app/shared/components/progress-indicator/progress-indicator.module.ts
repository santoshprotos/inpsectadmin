import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressIndicatorComponent } from './progress-indicator.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ProgressIndicatorComponent }])
  ],
  declarations: [ProgressIndicatorComponent],
  exports: [ProgressIndicatorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressIndicatorModule {}