import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpIntercept } from "./services/Http-services/interceptor.service";
import { HttpWrapperService } from './services/Http-services/http-wrapper.service'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
// import { FacilitesPopupModule } from './popups/components/facilites-popup/facilites-popup.module';
import { ProgressIndicatorModule } from './components/progress-indicator/progress-indicator.module';
import { CommonService } from './services/common.service';
import { ErrorPopupComponent } from './popups/components/error-popup/error-popup.component';
import { AnimationModule } from './components/animation/animation.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ShortNamePipe } from './services/filters/short-name.pipe';
import { CommonMessageComponent } from './popups/components/common-message/common-message.component';
import { TextWrapPipe } from './services/filters/text-wrap.pipe';
import { FacilityFormUserComponent } from './popups/components/facility-form-user/facility-form-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FacilitesPopupComponent } from './popups/components/facilites-popup/facilites-popup.component';
import { DaysWrapperPipe } from './services/filters/days-wrapper.pipe';
import { MultiSelectDropdownComponent } from './components/multi-select-dropdown/multi-select-dropdown.component';
export const configFactory = (commonService: CommonService) => {
  return () => commonService.loadConfiguration();
};

@NgModule({

  imports: [
    CommonModule,
    IonicModule,
    ProgressIndicatorModule,
    AnimationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbPaginationModule ,
    CommonModule,
    TimepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule,
    NgSelectModule,
    MultiSelectDropdownComponent
 ],

  declarations: [  
    HeaderComponent,
    ErrorPopupComponent,
    CommonMessageComponent,
    TextWrapPipe,
    FacilityFormUserComponent,
    PaginationComponent,
    FacilitesPopupComponent,
    DaysWrapperPipe
  ],  
  exports: [
    HeaderComponent,
    FacilitesPopupComponent,
    ProgressIndicatorModule,
    ErrorPopupComponent,
    CommonMessageComponent,
    TextWrapPipe,
    FacilityFormUserComponent,
    PaginationComponent
  ],

  providers: [ShortNamePipe,{provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [CommonService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
    HttpWrapperService
  ]
})
export class SharedModule { }
