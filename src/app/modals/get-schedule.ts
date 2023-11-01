export class GetSchedule {
    constructor(
        public FormId: number = null,
        public FacilityId: number = null,
        public pageNumber: number = 1,
        public pageSize:number = 1,
    ) { }
}  