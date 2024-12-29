import { $PropertyType } from 'utility-types';

export interface AuthState {
  access_token?: string;
  shortName?: string;
  myInfo?: MyInfo;
  loading?: boolean;
  className?: string;
  error?: string;
}

export interface LoginResponse {
  accessToken: string;
  // ShortName: string;
  // User: MyInfo;
  // ClassName?: string;
}

export interface ChangePasswordModel {
  Password: string;
  NewPassword: string;
}

export interface UpdateAccountInformationModel {
  Email: string;
  Name: string;
  Birthday: string;
  PhoneNumber: string;
  Gender: number;
  Address: string;
}

export interface MyInfo {
  id: string;
  userId: number;
  username: string;
  userRoleId: string;
  userRoleName: string;
  isActive: boolean;
  userProfile: UserProfile;
  point: number | null;
  isEkyc: boolean;
}

interface UserProfile {
  id: string;
  userId: number;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  avatar: string | null;
  cccd: string | null;
  dob: string | null;
  frontIdCard: string | null;
  backIdCard: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface LoginState {
  Email: string;
  Password: string;
  isRemember: boolean | null;
}

export interface RegisterModel {
  email: string;
  userName: string;
  password: string;
  callback: () => void;
}

export interface VerifyModel {
  email: string;
  code: string;
  callback: () => void;
}

export interface UpdateProfileModel {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  cccd: string;
  dob: string;
}
export interface UpdateAccoutManagerModel {
  accountId: string;
  roleNew: string;
  isActive: string;
}

export interface ResetPasswordModel {
  email: string;
  callback?: () => void;
}

export interface ConfirmResetPasswordModel {
  email: string;
  code: string;
  callback?: () => void;
}

export interface CreateNewPasswordModel {
  email: string;
  password: string;
  callback?: () => void;
}

export interface ChangeMyPasswordModel {
  oldPassword: string;
  newPassword: string;
  callback?: () => void;
}

// export const LOGIN = 'LOGIN';
// export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
// export const LOGIN_ERR = 'LOGIN_ERR';
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_ERR = "LOGOUT_ERR";
export const FETCH_MY_INFO = "FETCH_MY_INFO";
export const FETCH_MY_INFO_SUCCESS = "FETCH_MY_INFO_SUCCESS";
export const FETCH_MY_INFO_ERR = "FETCH_MY_INFO_ERR";
export const FETCH_ACCOUNT_MANAGER = "FETCH_MY_INFO";
export const FETCH_ACCOUNT_MANAGER_SUCCESS = "FETCH_MY_INFO_SUCCESS";
export const FETCH_ACCOUNT_MANAGER_ERR = "FETCH_MY_INFO_ERR";
export const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const UPDATE_ACCOUNT_INFORMATION = "UPDATE_ACCOUNT_INFORMATION";

export const LOGIN = "LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERR = "LOGIN_ERR";

export const REGISTER = "REGISTER";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_ERR = "REGISTER_ERR";

export const VERIFY = "VERIFY";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";
export const VERIFY_ERR = "VERIFY_ERR";

export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_ERR = "UPDATE_PROFILE_ERR";

export const UPDATE_ACCOUNTMANAGER = "UPDATE_ACCOUNTMANAGER";
export const UPDATE_ACCOUNTMANAGER_SUCCESS = "UPDATE_ACCOUNTMANAGER_SUCCESS";
export const UPDATE_ACCOUNTMANAGER_ERR = "UPDATE_ACCOUNTMANAGER_ERR";

export const RESET_PASSWORD = "RESET_PASSWORD";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";
export const RESET_PASSWORD_ERR = "RESET_PASSWORD_ERR";

export const CONFIRM_RESET_PASSWORD = "CONFIRM_RESET_PASSWORD";
export const CONFIRM_RESET_PASSWORD_SUCCESS = "CONFIRM_RESET_PASSWORD_SUCCESS";
export const CONFIRM_RESET_PASSWORD_ERR = "CONFIRM_RESET_PASSWORD_ERR";

export const CREATE_NEW_PASSWORD = "CREATE_NEW_PASSWORD";
export const CREATE_NEW_PASSWORD_SUCCESS = "CREATE_NEW_PASSWORD_SUCCESS";
export const CREATE_NEW_PASSWORD_ERR = "CREATE_NEW_PASSWORD_ERR";

export const CHANGE_MY_PASSWORD = "CHANGE_MY_PASSWORD";
export const CHANGE_MY_PASSWORD_SUCCESS = "CHANGE_MY_PASSWORD_SUCCESS";
export const CHANGE_MY_PASSWORD_ERR = "CHANGE_MY_PASSWORD_ERR";

export const MINUS_POINT_MYINFO = 'MINUS_POINT_MYINFO';
export const SET_PROFILE = 'SET_PROFILE';
export interface SetProfileAction {
  type: typeof SET_PROFILE;
  payload: any;
}
export interface LoginAction {
  type: typeof LOGIN;
  payload: LoginState;
  callback(): void;
}

export interface ChangePasswordAction {
  type: typeof CHANGE_PASSWORD;
  payload: ChangePasswordModel;
}

export interface UpdateAccountInformationAction {
  type: typeof UPDATE_ACCOUNT_INFORMATION;
  payload: UpdateAccountInformationModel;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: LoginResponse;
}

export interface LoginErrorAction {
  type: typeof LOGIN_ERR;
  payload: string;
}

export interface ForgotPasswordAction {
  type: typeof FORGOT_PASSWORD;
  payload: $PropertyType<LoginState, "Email">;
}

export interface LogoutAction {
  type: typeof LOGOUT;
  callback(): void;
}

export interface FetchMyInfoAction {
  type: typeof FETCH_MY_INFO;
}
export interface FetchMyInfoSuccessAction {
  type: typeof FETCH_MY_INFO_SUCCESS;
  payload: MyInfo;
}
export interface FetchMyInfoErrorAction {
  type: typeof FETCH_MY_INFO_ERR;
}

export interface RegisterAction {
  type: typeof REGISTER;
  payload: RegisterModel;
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

export interface RegisterErrorAction {
  type: typeof REGISTER_ERR;
  payload: string;
}

export interface VerifyAction {
  type: typeof VERIFY;
  payload: VerifyModel;
}
export interface VerifySuccessAction {
  type: typeof VERIFY_SUCCESS;
}
export interface VerifyErrorAction {
  type: typeof VERIFY_ERR;
  payload: string;
}
export interface UpdateProfileAction {
  type: typeof UPDATE_PROFILE;
  payload: UpdateProfileModel;
}
export interface UpdateProfileSuccessAction {
  type: typeof UPDATE_PROFILE_SUCCESS;
}
export interface UpdateProfileErrorAction {
  type: typeof UPDATE_PROFILE_ERR;
  payload: string;
}
export interface UpdateAccoutManagerAction {
  type: typeof UPDATE_ACCOUNTMANAGER;
  payload: UpdateAccoutManagerModel;
}
export interface UpdateAccoutManagerSuccessAction {
  type: typeof UPDATE_ACCOUNTMANAGER_SUCCESS;
}
export interface UpdateAccoutManagerErrorAction {
  type: typeof UPDATE_ACCOUNTMANAGER_ERR;
  payload: string;
}
export interface ResetPasswordAction {
  type: typeof RESET_PASSWORD;
  payload: ResetPasswordModel;
}
export interface ResetPasswordSuccessAction {
  type: typeof RESET_PASSWORD_SUCCESS;
}
export interface ResetPasswordErrorAction {
  type: typeof RESET_PASSWORD_ERR;
  payload: string;
}
export interface ConfirmResetPasswordAction {
  type: typeof CONFIRM_RESET_PASSWORD;
  payload: ConfirmResetPasswordModel;
}
export interface ConfirmResetPasswordSuccessAction {
  type: typeof CONFIRM_RESET_PASSWORD_SUCCESS;
}
export interface ConfirmResetPasswordErrorAction {
  type: typeof CONFIRM_RESET_PASSWORD_ERR;
  payload: string;
}

export interface CreateNewPasswordAction {
  type: typeof CREATE_NEW_PASSWORD;
  payload: CreateNewPasswordModel;
}
export interface CreateNewPasswordSuccessAction {
  type: typeof CREATE_NEW_PASSWORD_SUCCESS;
}
export interface CreateNewPasswordErrorAction {
  type: typeof CREATE_NEW_PASSWORD_ERR;
  payload: string;
}

export interface ChangeMyPasswordAction {
  type: typeof CHANGE_MY_PASSWORD;
  payload: ChangeMyPasswordModel;
}
export interface ChangeMyPasswordSuccessAction {
  type: typeof CHANGE_MY_PASSWORD_SUCCESS;
}
export interface ChangeMyPasswordErrorAction {
  type: typeof CHANGE_MY_PASSWORD_ERR;
  payload: string;
}


export interface MinusPointMyInfoAction {
  type: typeof MINUS_POINT_MYINFO;
  payload: number;
}

export type AuthActionTypes =
  | LoginAction
  | LoginSuccessAction
  | LoginErrorAction
  | LogoutAction
  | ForgotPasswordAction
  | FetchMyInfoAction
  | FetchMyInfoSuccessAction
  | FetchMyInfoErrorAction
  | ChangePasswordAction
  | UpdateAccountInformationAction
  | RegisterAction
  | RegisterSuccessAction
  | RegisterErrorAction
  | VerifyAction
  | VerifySuccessAction
  | VerifyErrorAction
  | UpdateProfileAction
  | UpdateProfileSuccessAction
  | UpdateProfileErrorAction
  | UpdateAccoutManagerAction
  | UpdateAccoutManagerSuccessAction
  | UpdateAccoutManagerErrorAction
  | ResetPasswordAction
  | ResetPasswordSuccessAction
  | ResetPasswordErrorAction
  | ConfirmResetPasswordAction
  | ConfirmResetPasswordSuccessAction
  | ConfirmResetPasswordErrorAction
  | CreateNewPasswordAction
  | CreateNewPasswordSuccessAction
  | CreateNewPasswordErrorAction
  | ChangeMyPasswordAction
  | ChangeMyPasswordSuccessAction
  | ChangeMyPasswordErrorAction
  | MinusPointMyInfoAction
  | SetProfileAction
