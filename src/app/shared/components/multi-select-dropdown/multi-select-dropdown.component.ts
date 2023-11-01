import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { CommonService } from '../../services/common.service';
import { Assets, Screens } from 'src/app/app.constant';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchFilterPipe } from '../../services/filters/search-filter.pipe';

@Component({
  standalone: true,
  selector: 'app-multi-select-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
  imports: [CommonModule, NgSelectModule, FormsModule
    , BsDropdownModule, SearchFilterPipe]
})
export class MultiSelectDropdownComponent implements OnInit {
  stringValues: any
  @Input() list: any[];
  @Input() placeHolder: string
  @Input() selectedItems:any[]
  @Output() roleBasedFilterData = new EventEmitter<any>();
  selectedValues
  checkBoxValue: any[] = [];
  outputArray: any;
  searchValue: any;
  arrowIcon: string;
  constructor(private dataStorageService: DataStorageService, private commonService: CommonService, private cdr: ChangeDetectorRef) {
    this.checkBoxValue = [];
  }
  ngOnInit() {
    this.arrowIcon = Assets.ARROW_DOWN;
    this.getStringResources();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.outputArray = [];
      if (changes.list.currentValue != undefined) {
        this.list = changes.list.currentValue;
        if (this.list.length > 0) {
          this.list.unshift({ name: "All", id: 0 });
        }
      }
      this.checkBoxValue = [];
      if(changes.selectedItems && changes.list)
      {
        this.list.forEach((ele) => {
                  const matchItem = this.selectedItems.find((obj2) => obj2.id === ele.id);
                  if (matchItem) {
                    ele.checked = true
                    this.checkBoxValue.push(ele.name)
                    this.outputArray.push(ele)
                  }
                });
      }
      
      if (changes.placeHolder) {
        this.placeHolder = changes.placeHolder.currentValue;
      }
    }

  }
  ngAfterViewInit() {
    if (this.placeHolder === undefined) {
      this.placeHolder = "Select"
    }
  }
  getSelectedValue(isChecked?: any, name?: any) {
    if (isChecked === false && name == 'All') {
      this.checkBoxValue = [];
      this.outputArray = [];
      this.list.map(i => {
        i.checked = true;
      })
      for (let i = 1; i < this.list.length; i++) {
        this.checkBoxValue.push(this.list[i].name);
        this.outputArray.push(this.list[i]);
      }
    }
    else if (isChecked === false) {
      const index = this.list.findIndex((i: { name: any; }) => i.name === name); // 3
      this.list[index].checked = true;
      this.checkBoxValue.push(name);
      this.outputArray.push(this.list[index]);
      const shouldSelectAllChecked = this.list.slice(1).every((checkbox) => checkbox.checked);
      if (shouldSelectAllChecked) {
        this.list[0].checked = true;
      }
    }
    else if (isChecked === true && name === 'All') {
      this.list.map(i => {
        i.checked = false;
      })
      this.checkBoxValue = [];
      this.outputArray = [];
    }
    else {

      const listIndex = this.list.findIndex(i => i.name === name); // 3
      const index = this.checkBoxValue.findIndex(i => i === name);
      const outputArrayIndex = this.outputArray.findIndex((i: { name: any; }) => i.name === name);
      this.list[listIndex].checked = false;
      const shouldSelectAllChecked = this.list.slice(1).every((checkbox) => checkbox.checked);
      if (!shouldSelectAllChecked) {
        this.list[0].checked = false;
      }
      this.checkBoxValue.splice(index, 1);
      this.outputArray.splice(outputArrayIndex, 1)
    }


    this.roleBasedFilterData.emit(this.outputArray)
  }
  async getStringResources() {
    try {
      let getStringSFromLocalData = await this.dataStorageService.getLocalData("stringResources");
      if (getStringSFromLocalData) {
        this.stringValues = this.commonService.getStringResources(getStringSFromLocalData, Screens.FACILITY);
      }
    } catch (e) {
      console.log('error', e);
    }
  }
  onOpenChange(data: any): void {
    this.arrowIcon = data ? Assets.ARROW_COLLAPSE : Assets.ARROW_DOWN;
  }
}
