export class UserGroupData {
    constructor(
        public userGroupId: number = 0,
        public userGroupName:string = '',
        public userid: number = 0,
        public usergroupmembers:any[] = [],
        public assignedLevel: string = '',
        public assignedRolesCodes:any[]= [],
        public assignedEntitieIds:any[] =[],
    ) { }
}
