export enum ErrorMessagesEnum {
  // COGNITO
  COGNITO_USER_NOT_FOUND = 'Cognito User Not Found',
  COGNITO_USER_SUB_NOT_FOUND = 'Cognito User Sub Not Found',

  // DOMAIN - USER SERVICE
  USER_NOT_FOUND = 'User not Found',
  USER_ALREADY_EXISTS = 'User already exists',
  USER_REGISTER_FAILED = 'User register failed',
  USER_LOGIN_FAILED = 'User login failed',
  USER_UPDATE_FAILED = 'User update failed',
  USER_DELETE_FAILED = 'User delete failed',
  USER_GET_FAILED = 'User get failed',
  USER_LIST_FAILED = 'User List Failed',
  USER_LOGOUT_FAILED = 'User Logout Failed',
  USER_REFRESH = 'User Refresh Failed',
  USER_CONFIRM_EMAIL = 'User Confirm Email Failed',
  USER_CHANGE_PASSWORD = 'User Change Password Failed',
  USER_CONFIRM_CHANGE_PASSWORD = 'User Confirm Change Password Failed',
  USER_FORGOT_PASSWORD = 'User Forgot Password Failed',
  USER_RESET_PASSWORD = 'User Reset Password Failed',
  USER_UPDATE_PROFILE = 'User Update Profile Failed',
  USER_UPDATE_ROLE = 'User Update Role Failed',
  USER_ID_REQUIRED = 'user_id Required',

  // DOMAIN - LICENSE SERVICE
  LICENSE_NOT_FOUND = 'License Not Found',
  LICENSE_ALREADY_EXISTS = 'User already has a license',
  LICENSE_ADD_FAILED = 'License Add Failed',
  LICENSE_GET_FAILED = 'License Get Failed',
  LICENSE_UPDATE_FAILED = 'License Update Failed',
  LICENSE_DELETE_FAILED = 'License Delete Failed',
  LICENSE_RENEW_FAILED = 'License Renew Failed',
  LICENSE_REVOKE_FAILED = 'License Revoke Failed',
}
