export enum ErrorCodesEnum {
  // TABLE
  ITEM_NOT_FOUND = 'item_not_found',
  ITEM_ALREADY_EXISTS = 'item_already_exists',
  QUERY_TABLE = 'query_table_failed',
  GET_ITEM_FAILED = 'get_item_from_table_failed',
  ADD_ITEM_TO_TABLE = 'add_item_to_table_failed',
  UPDATE_ITEM_TABLE = 'update_item_table_failed',
  DELETE_ITEM_TABLE = 'delete_item_from_table_failed',
  BATCH_DELETE_TABLE = 'batch_delete_from_table_failed',

  // SERVICES
  REQUEST_FAILED = 'request_failed',
  SCHEMA_VALIDATION_FAILED = 'schema_validation_failed',

  // DOMAIN - USER SERVICE
  USER_NOT_FOUND = 'user_not_found',
  USER_ALREADY_EXISTS = 'user_already_exists',
  USER_REGISTER_FAILED = 'user_register_failed',
  USER_LOGIN_FAILED = 'user_login_failed',
  USER_UPDATE_FAILED = 'user_update_failed',
  USER_DELETE_FAILED = 'user_delete_failed',
  USER_GET_FAILED = 'user_get_failed',
  USER_LIST_FAILED = 'user_list_failed',
  USER_LOGOUT_FAILED = 'user_logout_failed',
  USER_REFRESH = 'user_refresh_failed',
  USER_CONFIRM_EMAIL = 'user_confirm_email_failed',
  USER_CHANGE_PASSWORD = 'user_change_password_failed',
  USER_CONFIRM_CHANGE_PASSWORD = 'user_confirm_change_password_failed',
  USER_FORGOT_PASSWORD = 'user_forgot_password_failed',
  USER_RESET_PASSWORD = 'user_reset_password_failed',
  USER_UPDATE_PROFILE = 'user_update_profile_failed',
  USER_UPDATE_ROLE = 'user_update_role_failed',

  // DOMAIN - LICENSE SERVICE
  LICENSE_NOT_FOUND = 'license_not_found',
  LICENSE_ALREADY_EXISTS = 'license_already_exists',
  LICENSE_ADD_FAILED = 'license_add_failed',
  LICENSE_GET_FAILED = 'license_get_failed',
  LICENSE_UPDATE_FAILED = 'license_update_failed',
  LICENSE_DELETE_FAILED = 'license_delete_failed',
  LICENSE_RENEW_FAILED = 'license_renew_failed',
  LICENSE_REVOKE_FAILED = 'license_revoke_failed',
}
