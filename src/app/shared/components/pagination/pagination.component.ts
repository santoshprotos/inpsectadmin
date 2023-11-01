import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { Assets, Screens } from 'src/app/app.constant';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  formsGoToPageNo:any;
  @Input() totalRecords:number;
  @Input() row:number;
  @Input() pageNumber:any;
  @Input() pageSizes:any;
  @Input() paginationName:string;
  @Output() callParentMethod: EventEmitter<any> = new EventEmitter();
  stringValues:any;
  roundNo:number;


  chevronUpIcon: string;
  chevronDownIcon: string;
  previousInActive: string;
  previousActive: string;
  nextInactive: string;
  nextActive: string;
  lastActive: string;
  lastInactive: string;
  firstActive: string;
  firstInActive: string;
  
  constructor(private dataStorageService: DataStorageService, private commonService: CommonService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.getStringResources()
    this.chevronUpIcon = Assets.CHEVRON_UP;
    this.chevronDownIcon = Assets.CHEVRON_DOWN;

    this.previousInActive = Assets.ARROWPREVIOUSINACTIVE;
    this.previousActive = Assets.ARROWPREVIOUSACTIVE;
    this.nextInactive = Assets.ARROWNEXTINACTIVE;
    this.nextActive = Assets.ARROWNEXTACTIVE;
    this.lastActive = Assets.ARROWLASTACTIVE;
    this.lastInactive = Assets.ARROWLASTINACTIVE;
    this.firstActive = Assets.ARROWFIRSTACTIVE;
    this.firstInActive = Assets.ARROWFIRSTINACTIVE;
  }
  ngAfterViewInit() {
    this.roundNo = Math.ceil(this.totalRecords / this.row);
  }
  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.pageNumber) {
        this.pageNumber = changes.pageNumber.currentValue;
        this.roundNo = Math.ceil(this.totalRecords / this.row);
        this.formsGoToPageNo = this.pageNumber;
      }
      this.roundNo = Math.ceil(this.totalRecords / this.row);
    }
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

  goToPage(page: any) {
    if (page !== "" && page !== undefined) {
      page = Number(this.formsGoToPageNo);
      let roundNo = Math.ceil((this.totalRecords / this.row));
      if (page > 0 && page <= roundNo) {
        this.pageNumber = page;
        this.roundNo = Math.ceil(this.totalRecords / this.row);
        this.formsGoToPageNo = this.pageNumber;
        this.callParentMethod.emit({ pageNumber: this.pageNumber, pageSizes: this.row, paginationName: this.paginationName });
      }
      else {
        this.formsGoToPageNo = new String(Math.round(this.pageNumber));
      }
    }

  }

  onPageChanged(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.roundNo = Math.ceil(this.totalRecords / this.row);
    this.formsGoToPageNo = this.pageNumber;
    this.callParentMethod.emit({ pageNumber: this.pageNumber, pageSizes: this.row, paginationName: this.paginationName });
  }

  changeRowUp() {
    for (const [index, item] of this.pageSizes.entries()) {
      if (item === this.row && this.row !== this.pageSizes[this.pageSizes.length - 1]) {
        this.row = this.pageSizes[index + 1];
        this.roundNo = Math.ceil((this.totalRecords / this.row));
        if (this.pageNumber <= this.roundNo) {
          this.callParentMethod.emit({ pageNumber: this.pageNumber, pageSizes: this.row, paginationName: this.paginationName });
        }
        break;
      }
    }
  }

  changeRowDown() {
    for (const [index, item] of this.pageSizes.entries()) {
      if (item === this.row && this.row !== this.pageSizes[0]) {
        this.row = this.pageSizes[index - 1];
        this.roundNo = Math.ceil((this.totalRecords / this.row));
        if (this.pageNumber <= this.roundNo) {
          this.callParentMethod.emit({ pageNumber: this.pageNumber, pageSizes: this.row, paginationName: this.paginationName });
        }
        break;
      }
    }
  }
}
