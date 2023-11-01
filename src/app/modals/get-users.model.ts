export class GetUsers {
    constructor(
        public divisionId: number = null,
        public facilityId: number = null,
        public businessId: number = null,
        public pageNumber: number = 1,
        public pageSize : number = 1,
        public searchKeyword: string = '',
    ) { }
}

export interface PagingConfig {
    itemsPerPage : number,
    currentPage : number,
    totalItems : number
}