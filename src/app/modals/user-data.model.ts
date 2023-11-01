export class UserData {
    constructor(
        public userId: number = 0,
        public userCategoryCode = '',
        public loginName: string = '',
        public firstName: string = '',
        public lastName: string = '',
        public shortName: string = '',
        public email: string = '',
        public assignedLevel: string = '',
        public assignedRolesCodes:any[]= [],
        public assignedEntitieIds:any[] =[],
    ) { }
}
