import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpWrapperService } from 'src/app/shared/services/Http-services/http-wrapper.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { APIResources, Actions, Assets, Frequency, Modal, Screens, projectConstants } from 'src/app/app.constant';
import { GetSchedule } from 'src/app/modals/get-schedule';
import { GlobalErrorHandlerService } from 'src/app/shared/services/global-error-handler.service';
import { CreateSchedule } from 'src/app/modals/create-schedule';
import dayjs from 'dayjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { ModalStateService } from 'src/app/shared/services/modal-state.service';
import { SaveScheduleNotification } from 'src/app/modals/save-schedule-notification';
@Component({
  selector: 'app-facilites-popup',
  templateUrl: './facilites-popup.component.html',
  styleUrls: ['./facilites-popup.component.scss'],
})
export class FacilitesPopupComponent implements OnInit {

  public customBsDatepickerConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  dueByDate: any;
  scheduleInspectionModalRef?: BsModalRef;
  manageNotificationModalRef?: BsModalRef;
  createNotificationModalRef?: BsModalRef;
  config: ModalOptions = {
    class: 'modal-dialog-centered modal-lg',
    backdrop: 'static',
    ignoreBackdropClick: true,
  }
  isDueByDateSelected: boolean = true;

  selectedFrequency: any;
  showDropDown: boolean = false;

  @Input('modalRef') modalRef: BsModalRef;
  @Input('formDetails') formDetails: any;

  checkedList: any = [];
  checkedWeekValue: any = [];
  selectedOptions: any;
  formScheduleList: any = [];
  calendarStrings: any = [];
  modeType?: string;
  dateArray: any = [];
  numCheckedList: any = [];
  selectedNumOptions: any;
  startDate: any;
  endDate: any;
  timeSchedule: Date = new Date();
  earliestSubmissionUnit: String;
  earliestHoursOrDays: number[];
  earliestSubmission: string;
  earliestHourOrDaySelected: any;
  newReminder: any = {};
  reminderArray: any = [];
  reminderHoursOrDays: number[];
  stringValues: any;


  freqArrowIcon: string;
  ESD1arrowIcon: string;
  ESD2arrowIcon: string;
  remainder1arrowIcon: string;
  remainder2arrowIcon: string;
  weekDayArrowIcon: string;
  monthDayArrowIcon: string;
  earlyStartDateFreqArrowIcon: string;
  remainderFreqArrowIcon: string;


  frequencies = [];
  totalFormRecords: number = 0;
  pageNumber: number = 1;
  userGroupPageNumber: number = 1;
  notificationPageNumber: number = 1;
  pageSizes: number[] = [5, 10, 15, 20, 50, 100];
  scheduleRows: number = projectConstants.USER_DEFAULT_PAGE_SIZE;
  notificationRows: number = projectConstants.USER_DEFAULT_PAGE_SIZE;
  facilityName: string = '';
  frequencyDays: any[] = [];
  earliestSubmissionAllowedBeforeDueDate: number = 1;
  earlySubmitUnit: string = 'Hours';
  reminder: number = 0;
  subscription = new Subscription();
  subscriptionDelete = new Subscription();
  facilityTimeZone: string = '';

  WeekDayList: any[] = [{ name: 'Select All', checked: false }, { name: 'Sunday', value: 0, checked: false }, { name: 'Monday', value: 1, checked: false }, { name: 'Tuesday', value: 2, checked: false }, { name: 'Wednesday', value: 3, checked: false },
  { name: 'Thursday', value: 4, checked: false }, { name: 'Friday', value: 5, checked: false }, { name: 'Saturday', value: 6, checked: false },
  ];

  MonthDayList: any[] = [{ value: 'Select All', checked: false }, { value: 1, checked: false }, { value: 2, checked: false }, { value: 3, checked: false }, { value: 4, checked: false }, { value: 5, checked: false }, { value: 6, checked: false }, { value: 7, checked: false }, { value: 8, checked: false }, { value: 9, checked: false }, { value: 10, checked: false },
  { value: 11, checked: false }, { value: 12, checked: false }, { value: 13, checked: false }, { value: 14, checked: false }, { value: 15, checked: false },
  { value: 16, checked: false }, { value: 17, checked: false }, { value: 18, checked: false }, { value: 19, checked: false }, { value: 20, checked: false },
  { value: 21, checked: false }, { value: 22, checked: false }, { value: 23, checked: false }, { value: 24, checked: false }, { value: 25, checked: false },
  { value: 26, checked: false }, { value: 27, checked: false }, { value: 28, checked: false }, { value: 29, checked: false }, { value: 30, checked: false },
  { value: 31, checked: false }
  ]

  weekDayCheckedList: any[]
  monthDayCheckList: any[]
  currentWeekDaySelected: {};
  currentMonthDaySelected: {};

  isEndDateRequired: boolean = false;
  isStartDateRequired: boolean = false;
  isShowPreviewSchedule: boolean = false;
  isEarliestSubmission: boolean = false;

  isReminderUnitSelected: boolean = true;
  isReminderValueSelected: boolean = true;
  isStartDateSelected: boolean = true;
  isDayOfMonthSelected?: boolean = true;
  isDayOfWeekSelected?: boolean = true;

  isCheckedWeekValueSelected?: boolean;
  minStartDate: Date = new Date();
  minEndDate: any = new Date();
  deleteScheduleRecord: any;
  scheduleId: any;
  saveBtnText: string = '';
  paginationName: string;
  notificationTypes = [];
  selectedNotification: string;
  userList: any = [];
  userListPlaceHolder: string = 'Select Users';
  isFacilityAdmin: boolean = false;
  isObserver: boolean = false;
  reminderWindow: number = 0;
  notificationList: any = [];
  totalNotification: any = [];
  scheduleIdForNotification: number;
  listOfAssignments: any = [];
  isReminderWindowRequired: boolean = false;
  isListOfAssignment: boolean = false;
  subscriptionNotificationDelete = new Subscription();
  notificationRecord: any;
  notificationId: number = 0;
  selectedListItems: any[] = [];


  constructor(private commonService: CommonService, private modalService: BsModalService,
    private httpService: HttpWrapperService, private modalStateService: ModalStateService,
    private globalErrorHandlerService: GlobalErrorHandlerService,
    private dataStorageService: DataStorageService, private cdr: ChangeDetectorRef) {
    this.getStringResources();
    this.getFrequencies();
    this.weekDayCheckedList = [];
    this.monthDayCheckList = [];
    this.paginationName = "facilityPopup"
    this.getNotificationTypes();
  }

  triggerFromPaginationEmit(data: any) {
    this.pageNumber = data.pageNumber;
    this.scheduleRows = data.pageSizes;
    this.getSchedule();
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

  getNotificationTypes() {
    this.notificationTypes = [{
      name: 'before due date'
    }, {
      name: 'overdue'
    },
    {
      name: 'parameter exceedance'
    }]
  }


  async getFrequencies() {
    try {
      this.frequencies = await this.dataStorageService.getLocalData("scheduleFrequency");
      if (this.frequencies.length > 0) {
        this.frequencies.forEach((frequency: any) => {
          switch (frequency.frequencyCode) {
            case 'ONE_TIME':
              frequency.name = Frequency.ONE_TIME;
              break;
            case Frequency.DAILY.toUpperCase():
              frequency.name = Frequency.DAILY;
              break;
            case Frequency.WEEKLY.toUpperCase():
              frequency.name = Frequency.WEEKLY;
              break;
            case Frequency.MONTHLY.toUpperCase():
              frequency.name = Frequency.MONTHLY;
              break;
          }

        });
        this.setSelectFrequency(this.frequencies[0])
      }
    } catch (e) {
      console.log('error', e);
    }
  }


  ngOnInit() {
    this.timeSchedule.setHours(this.timeSchedule.getHours() + 2);
    this.getSchedule();
    this.freqArrowIcon = Assets.ARROW_DOWN;
    this.ESD1arrowIcon = Assets.ARROW_DOWN;
    this.ESD2arrowIcon = Assets.ARROW_DOWN;
    this.remainder1arrowIcon = Assets.ARROW_DOWN;
    this.remainder2arrowIcon = Assets.ARROW_DOWN;
    this.weekDayArrowIcon = Assets.ARROW_DOWN
    this.monthDayArrowIcon = Assets.ARROW_DOWN
    this.earlyStartDateFreqArrowIcon = Assets.ARROW_DOWN
    this.remainderFreqArrowIcon = Assets.ARROW_DOWN

    this.subscription = this.commonService.getRefreshScheduleList().subscribe((isScheduleAdded: boolean) => {
      if (isScheduleAdded) {
        this.getSchedule();
      }
    });
    this.subscriptionDelete = this.commonService.getDeleteSchedule().subscribe((isDeleteSchedule: boolean) => {
      if (isDeleteSchedule) {
        this.deleteSchedule();
      }
    });
    this.subscriptionNotificationDelete = this.commonService.getDeleteNotification().subscribe((isNotificationDelete: boolean) => {
      if (isNotificationDelete) {
        this.deleteNotificationAPI();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionDelete.unsubscribe();
    //  this.subscriptionNotificationDelete.unsubscribe();
  }

  openScheduleInspectionModal(template: TemplateRef<any>, mode: any, schedule: any) {
    this.getDates();
    this.modalRef?.hide();
    this.scheduleInspectionModalRef = this.modalService.show(template, this.config);
    if (schedule?.scheduleId !== undefined && schedule?.scheduleId !== null && schedule?.scheduleId > 0) {
      // update
      this.scheduleId = schedule?.scheduleId;
      this.selectedFrequency = this.getFrequencyValue(schedule?.frequency);
      this.startDate = new Date(schedule?.startDate);
      this.endDate = new Date(schedule?.endDate);
      this.minStartDate = new Date(this.startDate.setDate(this.startDate.getDate()));
      this.minEndDate = new Date(this.endDate.setDate(this.endDate.getDate()));
      this.saveBtnText = this.stringValues?.UPDATE;
    } else {
      this.saveBtnText = this.stringValues?.SAVE;
      this.refreshForm();

    }
    this.cdr.markForCheck()
  }

  getDates() {
    this.dateArray = [];
    let i = 1;
    this.dateArray.push({ name: this.stringValues.SCHEDULE_INSPECTION_SELECT_ALL, checked: false });
    while (i <= 31) {
      const number = {
        name: i,
        checked: false,
      };
      this.dateArray.push(number);
      i++;
    }
  }

  hideModal() {
    this.modalService.hide();
  }

  //Api call to get schedules
  async getSchedule() {
    let getSchedules = new GetSchedule();
    getSchedules.FormId = this.formDetails.formid;
    getSchedules.FacilityId = this.formDetails.facilityid;
    getSchedules.pageNumber = this.pageNumber;
    getSchedules.pageSize = this.scheduleRows;
    const url = `${APIResources.getSchedules}?FormId=${getSchedules.FormId}&FacilityId=${getSchedules.FacilityId}&pageNumber=${getSchedules.pageNumber}&pageSize=${getSchedules.pageSize}`;
    this.httpService.get(url).subscribe({
      next: (data) => {
        this.totalFormRecords = data.totalRecords;
        if (this.totalFormRecords > 0) {
          this.formScheduleList = data.schedules;
        } else {
          this.formScheduleList = [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Handle the error
        this.globalErrorHandlerService.openErrorModal(error.message);
      },
      complete: () => {
        this.getFacilityName(this.formDetails.facilityid)
      }
    })
  }

  async getFacilityName(facilityId: number) {
    try {
      let facilityData = await this.dataStorageService.getLocalData("myFacility");
      if (facilityData.length > 0) {
        let facility = facilityData.find((facility: any) => facility.id === facilityId);
        if (facility) {
          this.facilityName = facility.facilityName;
          this.facilityTimeZone = facility.displayTimezone || facility.timeZone;
        }
      }
    } catch (e) {
      console.log('error', e);
    }

  }


  onDropdownOpen(entityName: string) {
    const arrowIcons = {
      frequency: this.freqArrowIcon,
      weekDay: this.weekDayArrowIcon,
      monthDay: this.monthDayArrowIcon,
      ESD1: this.ESD1arrowIcon,
      ESD2: this.ESD2arrowIcon,
      remainder1: this.remainder1arrowIcon,
      remainder2: this.remainder2arrowIcon,
      ESDFreq: this.earlyStartDateFreqArrowIcon,
      RemainderFreq: this.remainderFreqArrowIcon,
    };

    if (arrowIcons.hasOwnProperty(entityName)) {
      arrowIcons[entityName] = Assets.ARROW_COLLAPSE;
    }
  }

  onDropdownClose(entityName: string) {
    const arrowIcons = {
      frequency: this.freqArrowIcon,
      weekDay: this.freqArrowIcon, // Assuming this should also be 'freqArrowIcon'
      monthDay: this.freqArrowIcon, // Assuming this should also be 'freqArrowIcon'
      ESD1: this.ESD1arrowIcon,
      ESD2: this.ESD2arrowIcon,
      remainder1: this.remainder1arrowIcon,
      remainder2: this.remainder2arrowIcon,
      ESDFreq: this.earlyStartDateFreqArrowIcon,
      RemainderFreq: this.remainderFreqArrowIcon,
    };

    if (arrowIcons.hasOwnProperty(entityName)) {
      arrowIcons[entityName] = Assets.ARROW_DOWN;
    }
  }

  //sets and populates the day of month checked in UI in dropdown box
  getSelectedValueDate(status: Boolean, value: String) {
    if (status) {
      this.isDayOfMonthSelected = true;
    }
    if (value === this.stringValues.SCHEDULE_INSPECTION_SELECT_ALL) {
      this.numCheckedList = [];
      if (status) {
        this.dateArray.forEach((elem: any) => {
          if (elem.checked === false) {
            elem.checked = true;
          }
          this.numCheckedList.push(elem.name);
        });
        this.numCheckedList.splice(0, 1);
      } else {
        this.dateArray.forEach((elem: any) => {
          if (elem.checked === true) {
            elem.checked = false;
          }
        });
        this.selectedNumOptions = '';
        this.numCheckedList = [];
      }
    } else {
      if (!status) {
        this.dateArray[0].checked = false;
        var index = this.numCheckedList.indexOf(value);
        this.numCheckedList.splice(index, 1);
      } else {
        this.numCheckedList.push(value);
      }
    }
    this.selectedNumOptions = this.numCheckedList.join(', ');
    if (this.selectedNumOptions.length > 28) {
      this.selectedNumOptions = this.selectedNumOptions?.slice(0, 20) + '...';
    }
  }

  closeModal() {
    this.selectedFrequency = Frequency.ONE_TIME; // Set first frequency on modal cancel
    this.MonthDayList.forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.WeekDayList.forEach((checkbox) => {
      checkbox.checked = false;
    });
    this.weekDayCheckedList = [];
    this.monthDayCheckList = [];
    this.scheduleInspectionModalRef?.hide();
  }

  //sets frequency value
  setSelectFrequency(frequency: any) {
    this.selectedFrequency = frequency.name;
    this.refreshForm();
    this.frequencyDays = [];
    switch (frequency.frequencyCode) {
      case Frequency.WEEKLY:
        this.WeekDayList.forEach((checkbox) => {
          checkbox.checked = false;
        });
        this.weekDayCheckedList = [];
        break;
      case Frequency.MONTHLY:
        this.MonthDayList.forEach((checkbox) => {
          checkbox.checked = false;
        });
        this.monthDayCheckList = [];
        break;
    }
    this.cdr.markForCheck()
  }

  //sets frequency value
  setSelectNotification(notificationType: any) {
    this.selectedNotification = notificationType.name;

  }


  // sets the earliest submission unit and fills the earliest submmission values based on "Hours" or 'Days'
  earliestSubmissionUnitSelected(selectedUnit: String) {
    this.earliestSubmissionUnit = selectedUnit;
    if (this.earliestSubmissionUnit === this.stringValues.SCHEDULE_INSPECTION_HOURS) {
      this.earliestHoursOrDays = Array(23).fill(0).map((x, i) => i + 1);
    }
    else if (this.earliestSubmissionUnit === this.stringValues.SCHEDULE_INSPECTION_DAYS) {
      this.earliestHoursOrDays = Array(31).fill(0).map((x, i) => i + 1);
    }
  }

  //sets the earliest submission value
  earliestSubmissionSelected(earliestSubmission: any) {
    this.earliestHourOrDaySelected = earliestSubmission;
  }

  //helps to open or close the tabel based on preview button click
  previewSchedule() {
    this.isShowPreviewSchedule = !this.isShowPreviewSchedule;
  }

  //sets reminder unit or value based on the parameter 'selectionType' recieved
  selectReminder(selectionType: string, reminderWindow: any) {
    if (selectionType.toLocaleLowerCase() === 'reminderunits') {
      this.newReminder.reminderUnit = reminderWindow;
      this.isReminderUnitSelected = true;
      if (this.newReminder.reminderUnit === this.stringValues.SCHEDULE_INSPECTION_HOURS) {
        this.reminderHoursOrDays = Array(23).fill(0).map((x, i) => i + 1);
      } else if (this.newReminder.reminderUnit === this.stringValues.SCHEDULE_INSPECTION_DAYS) {
        this.reminderHoursOrDays = Array(31).fill(0).map((x, i) => i + 1);
      }
    } else if (selectionType.toLocaleLowerCase() === 'remindervalue') {
      this.newReminder.reminderValue = reminderWindow;
      this.isReminderValueSelected = true
    }
  }

  //adds the the reminder unit and respective value to the reminder array table
  addReminder() {
    if (this.newReminder.reminderValue !== this.stringValues.SCHEDULE_INSPECTION_SELECT && this.newReminder.reminderUnit !== this.stringValues.SCHEDULE_INSPECTION_SELECT) {
      this.reminderHoursOrDays = [];
      this.reminderArray.push(this.newReminder);
      this.reminderArray.forEach(element => {
        element.IsActive = true;
      });
      this.newReminder = {
        "reminderValue": this.stringValues.SCHEDULE_INSPECTION_SELECT,
        "reminderUnit": this.stringValues.SCHEDULE_INSPECTION_SELECT
      };
    }
    else if (this.newReminder.reminderUnit === this.stringValues.SCHEDULE_INSPECTION_SELECT) {
      this.isReminderUnitSelected = false;
    }
    else if (this.newReminder.reminderValue === this.stringValues.SCHEDULE_INSPECTION_SELECT) {
      this.isReminderValueSelected = false;
    }
  }

  //removed reminder from the array
  removeReminder(index: number) {
    if (index !== -1) {
      this.reminderArray.splice(index, 1);
    }
  }


  getSelectedValue(status: Boolean, value: String, valuesFor: string) {
    const weekDayCheckboxList = this.WeekDayList;
    const monthDayCheckboxList = this.MonthDayList;
    if (valuesFor === Frequency.WEEKLY) {
      if (status === false && value === 'Select All') {
        weekDayCheckboxList.forEach((checkbox) => {
          checkbox.checked = false;
        });
        this.weekDayCheckedList = [];
      } else if (status) {
        const shouldSelectAllChecked = weekDayCheckboxList.slice(1).every((checkbox) => checkbox.checked);

        if (status && value === 'Select All' || shouldSelectAllChecked) {
          if (shouldSelectAllChecked) {
            weekDayCheckboxList[0].checked = true;
          }

          this.weekDayCheckedList = [];
          weekDayCheckboxList.slice(1).forEach((checkbox) => {
            checkbox.checked = true;
            this.weekDayCheckedList.push(checkbox.name);
          });
        } else {
          weekDayCheckboxList.slice(1).forEach((checkbox) => {
            if (checkbox.name === value && checkbox.checked) {
              this.weekDayCheckedList.push(checkbox.name);
            }
          });
        }
      } else {
        weekDayCheckboxList[0].checked = false;
        const index = this.weekDayCheckedList.indexOf(value);
        this.weekDayCheckedList.splice(index, 1);
      }
      this.frequencyDays = [];
      this.weekDayCheckedList.forEach((item) => {
        const foundDay = this.WeekDayList.find(day => day.name === item);
        this.frequencyDays.push(foundDay.value);
      });
      this.currentWeekDaySelected = { checked: status, name: value };
      this.weekDayCheckedList.length === 0 ? this.isDayOfWeekSelected = true : this.isDayOfWeekSelected = false;

    } else if (valuesFor === Frequency.MONTHLY) {
      if (status === false && value === 'Select All') {
        monthDayCheckboxList.forEach((checkbox) => {
          checkbox.checked = false;
        });
        this.monthDayCheckList = [];
      } else if (status) {
        const shouldSelectAllChecked = monthDayCheckboxList.slice(1).every((checkbox) => checkbox.checked);

        if (status && value === 'Select All' || shouldSelectAllChecked) {
          if (shouldSelectAllChecked) {
            monthDayCheckboxList[0].checked = true;
          }

          this.monthDayCheckList = [];
          monthDayCheckboxList.slice(1).forEach((checkbox) => {
            checkbox.checked = true;
            this.monthDayCheckList.push(checkbox.value);
          });
        } else {
          this.monthDayCheckList.push(value);
        }
      } else {
        monthDayCheckboxList[0].checked = false;
        const index = this.monthDayCheckList.indexOf(value);
        this.monthDayCheckList.splice(index, 1);
      }

      this.frequencyDays = this.monthDayCheckList;
      this.currentMonthDaySelected = { checked: status, value: value };
      this.monthDayCheckList.length === 0 ? this.isDayOfMonthSelected = true : this.isDayOfMonthSelected = false;
    }
  }

  selectSubmissionUnit(data: string) {
    this.earlySubmitUnit = data;
  }

  earliestSubmissionAllowedBeforeDueDateChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).valueAsNumber;
    if (inputValue < 1) {
      this.earliestSubmissionAllowedBeforeDueDate = 1;
    } else {
      this.earliestSubmissionAllowedBeforeDueDate = inputValue;
    }
  }

  onDateChange(event: any, key: string) {
    switch (key) {
      case 'startDate':
        if (event) {
          this.startDate = event;
          this.isStartDateRequired = false;
          this.minEndDate = new Date(this.minEndDate.setDate(this.startDate.getDate() + 1));
        }
        break;
      case 'endDate':
        if (event) {
          this.endDate = event;
          this.isEndDateRequired = false;
        }
        break;
    }
  }

  formScheduleValidation() {
    let isValid = true;
    if (!this.startDate && !this.endDate) {
      this.isStartDateRequired = true;
      this.isEndDateRequired = true;
      isValid = false;
    }
    if (!this.startDate && this.selectedFrequency !== this.stringValues?.ONE_TIME) {
      this.isStartDateRequired = true;
      isValid = false;
    }
    if (!this.endDate) {
      this.isEndDateRequired = true;
      isValid = false;
    }
    if (this.weekDayCheckedList.length === 0 && this.selectedFrequency === this.stringValues?.WEEKLY) {
      this.isDayOfWeekSelected = true;
      isValid = false;
    }

    if (this.monthDayCheckList.length === 0 && this.selectedFrequency === this.stringValues?.MONTHLY) {
      this.isDayOfMonthSelected = true;
      isValid = false;
    }
    if (this.earliestSubmissionAllowedBeforeDueDate < 1) {
      this.isEarliestSubmission = true;
      isValid = false;
    } else {
      this.isEarliestSubmission = false;
    }

    return isValid;
  }

  refreshForm() {
    this.startDate = '';
    this.endDate = '';
    this.minEndDate = new Date();
    this.timeSchedule = new Date();
    this.timeSchedule.setHours(this.timeSchedule.getHours() + 2);
    this.isDayOfWeekSelected = false;
    this.isDayOfMonthSelected = false
    this.isEndDateRequired = false;
    this.isStartDateRequired = false;
    this.isEarliestSubmission = false;
    this.earliestSubmissionAllowedBeforeDueDate = 1;
    this.earlySubmitUnit = 'Hours';
  }


  getFrequencyCode(frequency: string): string {
    switch (frequency) {
      case Frequency.ONE_TIME:
        return 'ONE_TIME';
      case Frequency.DAILY:
        return 'DAILY';
      case Frequency.WEEKLY:
        return 'WEEKLY';
      case Frequency.MONTHLY:
        return 'MONTHLY';
      default:
        return 'INVALID_FREQUENCY';
    }
  }

  getFrequencyValue(frequency: string): string {
    switch (frequency) {
      case 'ONE_TIME':
        return Frequency.ONE_TIME;
        break;
      case 'DAILY':
        return Frequency.DAILY;
        break;
      case 'WEEKLY':
        return Frequency.WEEKLY;
        break;
      case 'MONTHLY':
        return Frequency.MONTHLY;
        break;
      default:
        return '';
    }
  }


  saveSchedule() {
    if (this.formScheduleValidation()) {
      let scheduleData = new CreateSchedule();
      scheduleData.formId = this.formDetails.formid;
      scheduleData.facilityId = this.formDetails.facilityid;
      scheduleData.frequency = this.getFrequencyCode(this.selectedFrequency);
      scheduleData.frequencyDays = this.frequencyDays;
      scheduleData.startDate = this.selectedFrequency === "One Time" ? this.endDate ? dayjs(this.endDate).format('MM/DD/YYYY') : '' : this.startDate ? dayjs(this.startDate).format('MM/DD/YYYY') : '';
      scheduleData.endDate = this.endDate ? dayjs(this.endDate).format('MM/DD/YYYY') : '';
      scheduleData.dueTime = this.timeSchedule ? dayjs(this.timeSchedule).format('HH:mm:ss') : '';
      scheduleData.earlySubmitWindow = Number(this.earliestSubmissionAllowedBeforeDueDate);
      scheduleData.earlySubmitUnit = this.earlySubmitUnit.toUpperCase();

      this.httpService.post(APIResources.createSchedule, scheduleData)
        .subscribe({
          next: (data) => {
            if (data) {
              this.closeModal();
              this.commonService.refreshScheduleList(true); // for refresh schedule list.
              this.commonService.openMessageModal(projectConstants.SCHEDULE_ADDED_SUCCESSFULLY, Screens.FACILITY, Modal.SUCCESS);

            } else {
              this.globalErrorHandlerService.openErrorModal(); // show internal server error if result return false
            }
          },
          error: (error) => {
            // Handle the error
            this.globalErrorHandlerService.openErrorModal(error.message);
          },
          complete: () => {
            // Handle the completion of the observable if needed
          }
        })
    }
  }

  delete(schedule: any) {
    this.deleteScheduleRecord = schedule;
    this.commonService.openMessageModal(projectConstants.DELETE_SCHEDULE_CONFIRMATION_MSG, Screens.FACILITY, Modal.CONFIRMATION, Actions.DELETE_SCHEDULE)
  }

  deleteSchedule() {
    let schedule = this.deleteScheduleRecord;
    const url = `${APIResources.deleteSchedule}?scheduleId=${schedule.scheduleId}`;
    this.httpService.delete(url)
      .subscribe({
        next: (data) => {
          if (data) {
            // this.commonService.refreshScheduleList(true); // for refresh schedule list.
            this.commonService.hideMessageModal();
          }
        },
        error: (error) => {
          // Handle the error
          this.globalErrorHandlerService.openErrorModal(error.message);
        },
        complete: () => {
          // Handle the completion of the observable if needed
          const totalMinusOne: number = this.totalFormRecords - 1;
          const scheduleRow = Math.trunc(totalMinusOne % this.scheduleRows)
          if (this.pageNumber == 1) {
            this.getSchedule();
            return
          }
          this.pageNumber = scheduleRow !== 0 ? Math.trunc(totalMinusOne / this.scheduleRows) + 1 : totalMinusOne / this.scheduleRows;
          this.getSchedule();
        }
      })
  }

  openNotificationModal(template: TemplateRef<any>, scheduleId: number): any {
    this.scheduleIdForNotification = scheduleId;
    this.modalStateService.closeModal(); // hide manage schedule modal
    this.getNotificationList(scheduleId);
    this.manageNotificationModalRef = this.modalService.show(template, this.config);
  }

  hideManageNotificationModal() {
    this.manageNotificationModalRef.hide();
  }
  hideCreateNotificationModal() {
    this.createNotificationModalRef.hide();
  }

  openCreateNotificationModal(template: TemplateRef<any>): any {
    this.saveBtnText = this.stringValues?.SAVE;
    this.getUsers();
    this.refreshCreateNotificationForm();
    let config: ModalOptions = {
      class: 'modal-dialog-centered modal-lg modal-create-notification',
      backdrop: 'static',
      ignoreBackdropClick: true,
    }
    this.selectedNotification = this.notificationTypes[0].name;
    this.createNotificationModalRef = this.modalService.show(template, config);
  }

  receiveData(event: any) {
    this.listOfAssignments = event.map((item: any) => ({
      key: 'USER',
      value: item.userid
    }));
  }

  //Api call to get schedules
  async getNotificationList(scheduleId: number) {
    const url = `${APIResources.getScheduleNotificationsList}?scheduleId=${scheduleId}&PageNumber=${this.notificationPageNumber}&PageSize=${this.notificationRows}`;
    this.httpService.get(url).subscribe({
      next: (data) => {
        this.totalNotification = data.totalRecords;
        this.notificationList = data.schedulereminderResultList;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.globalErrorHandlerService.openErrorModal(error.message);
      },
      complete: () => {
        //this.getFacilityName(this.formDetails.facilityid)
      }
    })
  }

  triggerNotificationPaginationEmit(data: any) {
    this.notificationPageNumber = data.pageNumber;
    this.notificationRows = data.pageSizes;
    this.getNotificationList(this.scheduleIdForNotification);
  }

  editNotification(notification: any, template: TemplateRef<any>) {
    this.getNotificationById(notification, template);
  }


  async getUsers() {
    if (this.isObserver) {
      let data = {
        "divisionId": 0,
        "businessId": 0,
        "facilityId": 0,
        "pageNumber": 1,
        "pageSize": 99999,
        "searchKeyword": ""
      };
      try {
        const result: any = await this.httpService.post(APIResources.getUserByAccess, data).toPromise();
        this.userList = result.usersByAccess;
        this.userList.map(a => {
          a["name"] = a.firstname + " " + a.lastName;
          a["checked"] = false;
          a['id'] = a.userid
        })
      }
      catch (err) {
        this.globalErrorHandlerService.openErrorModal(err.message);
      }
    }
  }

  saveScheduleNotification() {
    if (this.formCreateNotificationValidation()) {
      let notificationData = new SaveScheduleNotification();
      notificationData.scheduleId = this.scheduleIdForNotification;
      notificationData.notificationid = this.notificationId;
      notificationData.isUpdate = this.notificationId > 0 ? true : false;
      notificationData.reminderwindow = this.selectedNotification === 'overdue' ? 0 : this.reminderWindow,
        notificationData.reminderwindowunit = this.selectedNotification === 'overdue' ? '' : this.earlySubmitUnit,
        notificationData.notifyfacilityadmin = this.isFacilityAdmin,
        notificationData.listOfAssignments = this.listOfAssignments,
        notificationData.beforeduedate = this.selectedNotification === 'overdue' ? false : true,
        this.httpService.post(APIResources.saveScheduleNotification, notificationData)
          .subscribe({
            next: (data) => {
              if (data) {
                this.createNotificationModalRef.hide();
                if (this.notificationId > 0) {
                  this.commonService.openMessageModal(projectConstants.NOTIFICATION_UPDATED_SUCCESSFULLY, Screens.FACILITY, Modal.SUCCESS);
                } else {
                  this.commonService.openMessageModal(projectConstants.NOTIFICATION_ADDED_SUCCESSFULLY, Screens.FACILITY, Modal.SUCCESS);
                }

              } else {
                this.globalErrorHandlerService.openErrorModal(); // show internal server error if result return false
              }
            },
            error: (error) => {
              // Handle the error
              this.globalErrorHandlerService.openErrorModal(error.message);
            },
            complete: () => {
              this.refreshCreateNotificationForm();
              this.getNotificationList(this.scheduleIdForNotification);
            }
          })
    }
  }



  refreshCreateNotificationForm() {
    this.selectedNotification = this.notificationTypes[0].name;
    this.reminderWindow = 0;
    this.notificationId = 0;
    this.earlySubmitUnit = 'Hours';
    this.isFacilityAdmin = false;
    this.isObserver = false;
    this.listOfAssignments = [];
    this.isReminderWindowRequired = false;
    this.isListOfAssignment = false;
  }



  formCreateNotificationValidation() {
    let isValid = true;
    if (this.selectedNotification === 'before due date') {
      if (this.reminderWindow === null || this.reminderWindow === 0 || this.reminderWindow < 0) {
        this.isReminderWindowRequired = true;
        isValid = false;
        return false;
      } else {
        this.isReminderWindowRequired = false;
      }
    }

    if (this.listOfAssignments.length === 0 && this.isObserver) {
      this.isListOfAssignment = true;
      isValid = false;
      return false;
    } else {
      this.isListOfAssignment = false;
    }
    return isValid;
  }

  deleteNotification(notification: any) {
    this.notificationRecord = notification;
    this.commonService.openMessageModal(projectConstants.DELETE_NOTIFICATION_CONFIRMATION_MSG, Screens.FACILITY, Modal.CONFIRMATION, Actions.DELETE_NOTIFICATION)
  }

  deleteNotificationAPI() {
    let notification = this.notificationRecord;
    const url = `${APIResources.deleteScheduleNotification}?scheduleId=${notification.scheduleid}&scheduleNotificationId=${notification.notificationId}`;
    this.httpService.delete(url)
      .subscribe({
        next: (data) => {
          if (data) {
            this.commonService.refreshScheduleList(true); // for refresh schedule list.
            this.commonService.hideMessageModal();
          }
        },
        error: (error) => {
          // Handle the error
          this.globalErrorHandlerService.openErrorModal(error.message);
        },
        complete: () => {
          //refresh notification list
          const totalMinusOne = this.totalNotification - 1;
          const notificationRow = Math.round(totalMinusOne % this.notificationRows)
          if (this.notificationPageNumber == 1) {
            this.getNotificationList(notification.scheduleid);
            return
          }
          this.notificationPageNumber = notificationRow !== 0 ? Math.floor(totalMinusOne / this.notificationRows) + 1 : totalMinusOne / this.notificationRows;
          this.getNotificationList(notification.scheduleid);
        }
      })
  }

  getNotificationById(notification: any, template: TemplateRef<any>) {
    const url = `${APIResources.getNotificationDetailsById}?scheduleId=${notification.scheduleid}&scheduleNotificationId=${notification.notificationId}`;
    this.httpService.get(url)
      .subscribe({
        next: async (data) => {
          if (data) {
            if (data.notificationid > 0) {
              this.saveBtnText = this.stringValues?.UPDATE;
              this.earlySubmitUnit = data.reminderwindowunit === 'HOURS' ? 'Hours' : 'Days';
              this.reminderWindow = data.reminderwindow;
              this.isFacilityAdmin = data.notifyfacilityadmin;
              this.notificationId = data.notificationid;
              if (data.listOfAssignments.length > 0) {
                this.isObserver = true;
                this.listOfAssignments = data.listOfAssignments.map((item: any) => ({
                  key: 'USER',
                  value: item.value
                }));
                this.selectedListItems = data.listOfAssignments;
                await this.getUsers();
              }
              else {
                this.selectedListItems = [];
              }
              let config: ModalOptions = {
                class: 'modal-dialog-centered modal-lg modal-create-notification',
                backdrop: 'static',
                ignoreBackdropClick: true,
              }
              this.selectedNotification = this.notificationTypes[0].name;
              this.createNotificationModalRef = this.modalService.show(template, config);
            }
          }
        },
        error: (error) => {
          // Handle the error
          this.globalErrorHandlerService.openErrorModal(error.message);
        },
        complete: () => {
        }
      })
  }



}


