 import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleLevelMultiFacilityFilterComponent } from './role-level-multi-facility-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FilterNamePipe } from 'src/app/shared/services/filters/filter-name.pipe';
import { FilterDivisionNamePipe } from 'src/app/shared/services/filters/filter-division-name.pipe';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown/multi-select-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchFilterPipe } from '../../services/filters/search-filter.pipe';


@NgModule({
    declarations: [RoleLevelMultiFacilityFilterComponent,
        FilterNamePipe,
        FilterDivisionNamePipe,
        //MultiSelectDropdownComponent,
    ],
    exports:[RoleLevelMultiFacilityFilterComponent],
    providers: [FilterNamePipe, FilterDivisionNamePipe],
    imports: [CommonModule,NgSelectModule, FormsModule
      ,ReactiveFormsModule,MultiSelectDropdownComponent]
})
export class RoleLevelMultiFacilityFilterModule { }
