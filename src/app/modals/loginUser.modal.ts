export class LoginUser {
    constructor(
        public ssoToken: string = '',
        public loginname: string = '',
        public password: string = '',
        public deviceToken: string = '',
        public deviceType : string = '',
        public isAdmin: boolean = true,
    ) { }
}
