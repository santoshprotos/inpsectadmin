export class CreateSchedule {
    constructor(
        public formId: number = 0,
        public facilityId: number = 0,
        public frequency: string = '',
        public frequencyDays: any[] = [],
        public startDate: any = '',
        public endDate: any = '',
        public dueTime: any = '',
        public earlySubmitWindow: number = 0,
        public earlySubmitUnit: string = '',
    ) { }
}
