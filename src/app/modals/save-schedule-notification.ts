export class SaveScheduleNotification {
    constructor(
        public scheduleId: number = 0,
        public notificationid: number = 0,
        public reminderwindow: number = 0,
        public reminderwindowunit: string = '',
        public beforeduedate: boolean = false,
        public isActive: boolean = true,
        public notifyfacilityadmin: boolean = false,
        public listOfAssignments: any = [],
        public isUpdate: boolean = false,
    ) { }
}
