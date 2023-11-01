export enum Screens {
  LOGIN = 'LOGIN',
  USER_GROUP = 'USERGROUP' ,
  FACILITY = 'FACILITY'
}

export const APIResources = {
  Login: "Account/Login",
  preLogin: "Account/PreLoginData",
  logout: "Account/Logout",
  Save: 'User/save',
  availability: 'User/Availability',
  getUserByAccess: 'User/GetUserByAccess',
  getUserGroupByAccess: 'Usergroup/GetUserGroupByAccess',
  log: 'ErrorLog',
  getForms: 'Form',
  getFormAssignments :"Form/GetFormAssignments",
  saveFormAssignment :"Form/SaveFormAssignment",
  deleteFormAssignment :"Form/DeleteFormAssignment",
  getSchedules: 'Schedule/GetByForm',
  createSchedule: 'Schedule/Create',
  deleteSchedule: 'Schedule',
  saveUserGroup:'Usergroup/SaveUserGroup',
  deleteUserGroup:'Usergroup/DeleteUserFromUserGroup',
  getScheduleNotificationsList: 'schedule/GetScheduleNotificationsList',
  saveScheduleNotification: 'schedule/SaveScheduleNotification',
  deleteScheduleNotification: 'schedule/DeleteScheduleNotification',
  getNotificationDetailsById: 'schedule/GetNotificationDetailsbyId'
}



export enum CommonMessage {
  COMMON_ERROR = 'An unexpected error occurred. Please try again later. If the problem persists, please contact the support team for assistance.',
  ERROR = 'Error',
  CLOSE = 'Close' 
}


export enum projectConstants {
  AUTHORITY_URL = "SSO_Authority_URL",
  CLIENT_ID = "SSO_Client_ID",
  REDIRECT_URI = "SSO_Redirect_URI",
  METADATA_AUTH_ENDPOINT = "SSO_MetaData_Auth_endpoint",
  METADATA_ENDSESSION_ENDPOINT = "SSO_MetaData_End_Session_Endpoint",
  METADATA_TOKEN_ENDPOINT = "SSO_MetaData_Token_Endpoint",
  POST_LOGOUT_URI = "SSO_Post_Logout_Redirect_URI",
  ERR_SESSION_EXPIRED = "ERR_SESSION_EXPIRED",
  ERR_USER_ALREADY_EXISTS = 'ERR_USER_ALREADY_EXISTS',
  USER = "USER",
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  VIEWONLYADMIN = 'VIEWONLYADMIN',
  SSO_USER = 'SSO',
  CONTRACTOR = 'CONTRACTOR',
  USER_ADDED_SUCCESSFULLY = 'USER_ADDED_SUCCESSFULLY',
  USER_UPDATED_SUCCESSFULLY = 'USER_UPDATED_SUCCESSFULLY',
  USER_GROUP_UPDATED_SUCCESSFULLY = 'USER_GROUP_UPDATED_SUCCESSFULLY',
  USER_ASSIGNED_TO_FORM_SUCCESSFULLY = "USER_ASSIGNED_TO_FORM_SUCCESSFULLY",
  USER_GROUP_ASSIGNED_TO_FORM_SUCCESSFULLY = "USER_GROUP_ASSIGNED_TO_FORM_SUCCESSFULLY",
  DELETE_CONFIRM_FORM_ASSIGNMENT = "DELETE_CONFIRM_FORM_ASSIGNMENT",
  SSOCODE = "SSO",
  USER_DEFAULT_PAGE_SIZE = 5,
  USERGROUP = "USERGROUP",
  LOGOUT = "LOGOUT",
  LOGIN = "LOGIN",
  DIVISION = 'DIVISION',
  BUSINESS = 'BUSINESS',
  FACILITY = 'FACILITY',
  LOGOUT_CONFIRMATION = "LOGOUT_CONFIRMATION",
  UNAUTHORIZED = "Unauthorized",
  ERR_BAD_REQUEST = 'ERR_BAD_REQUEST',
  SCHEDULE_ADDED_SUCCESSFULLY =  'SCHEDULE_ADDED_SUCCESSFULLY',
  SCHEDULE_DELETED_SUCCESSFULLY= 'SCHEDULE_DELETED_SUCCESSFULLY',
  REMOVE_USER_FROM_GROUP_CONFIRMATION_MSG = "REMOVE_USER_FROM_GROUP_CONFIRMATION_MSG",
  DELETE_SCHEDULE_CONFIRMATION_MSG = "DELETE_SCHEDULE_CONFIRMATION_MSG",
  NOTIFICATION_ADDED_SUCCESSFULLY =  'NOTIFICATION_ADDED_SUCCESSFULLY',
  DELETE_NOTIFICATION_CONFIRMATION_MSG= 'DELETE_NOTIFICATION_CONFIRMATION_MSG',
  NOTIFICATION_UPDATED_SUCCESSFULLY = 'NOTIFICATION_UPDATED_SUCCESSFULLY'
} 

export enum Modal {
  CONFIRMATION = "CONFIRMATION",
  SUCCESS = "SUCCESS",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  FORGOT_PWD_MSG = "FORGOT_PASSWORD_MSG"
}

export enum Filepath {
    ERROR_JSON = '../assets/animations/error.json',
    SUCCESS_JSON = '../assets/animations/Success.json',
    CONFIRM_JSON = '../assets/animations/confirmation.json',
    FORGOT_PASSWORD_JSON = '../assets/animations/forgot_password.json',
}

export enum Assets {
  ARROW_DOWN = "../assets/icons/arrow_down.svg",
  ARROW_COLLAPSE = "../assets/icons/arrow_collapse.svg",
  CHEVRON_UP = "../assets/icons/chevron-up.svg",
  CHEVRON_DOWN = "../assets/icons/chevron-down.svg",
  USERGROUP = "../assets/icons/usergroup.svg",
  ARROWFIRSTACTIVE = "../assets/icons/arrow-firstactive.svg",
  ARROWPREVIOUSACTIVE = "../assets/icons/arrow-previousactive.svg",
  ARROWLASTACTIVE = "../assets/icons/arrow-lastactive.svg",
  ARROWNEXTACTIVE = "../assets/icons/arrow-nextactive.svg",
  ARROWFIRSTINACTIVE = "../assets/icons/arrow-firstinactive.svg",
  ARROWPREVIOUSINACTIVE = "../assets/icons/arrow-previousinactive.svg",
  ARROWLASTINACTIVE = "../assets/icons/arrow-lastinactive.svg",
  ARROWNEXTINACTIVE = "../assets/icons/arrow-nextinactive.svg",
}


export enum Roles {
  BUSINESS = "BUSINESS",
  DIVISION = "DIVISION",
  FACILITY = "FACILITY"
}

export const Frequency = {
  ONE_TIME: 'One Time',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly'
}

export const Actions = {
  DELETE_USER_FROM_USERGROUP: 'DELETE_USER_FROM_USERGROUP',
  DELETE_SCHEDULE: 'DELETE_SCHEDULE',
  DELETE_FORM_ASSIGNMENT: 'DELETE_FORM_ASSIGNMENT',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION'
}