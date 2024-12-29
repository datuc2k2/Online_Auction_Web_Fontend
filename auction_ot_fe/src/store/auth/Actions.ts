import { $PropertyType } from 'utility-types';
import {
  AuthActionTypes,
  ChangePasswordModel,
  FETCH_MY_INFO,
  FORGOT_PASSWORD,
  LOGIN,
  LOGIN_ERR,
  LOGIN_SUCCESS,
  LOGOUT,
  LoginResponse,
  LoginState,
  CHANGE_PASSWORD,
  UpdateAccountInformationModel,
  UPDATE_ACCOUNT_INFORMATION,
  RegisterAction,
  REGISTER,
  RegisterModel,
  REGISTER_SUCCESS,
  REGISTER_ERR,
  VerifyModel,
  VERIFY,
  VERIFY_SUCCESS,
  VERIFY_ERR,
  FETCH_MY_INFO_SUCCESS,
  FETCH_MY_INFO_ERR,
  FETCH_ACCOUNT_MANAGER,
  FETCH_ACCOUNT_MANAGER_SUCCESS,
  FETCH_ACCOUNT_MANAGER_ERR,
  MyInfo,
  UpdateProfileModel,
  UpdateAccoutManagerModel,
  UPDATE_ACCOUNTMANAGER,
  UPDATE_ACCOUNTMANAGER_ERR,
  UPDATE_ACCOUNTMANAGER_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERR,
  ResetPasswordModel,
  ConfirmResetPasswordModel,
  CONFIRM_RESET_PASSWORD,
  CONFIRM_RESET_PASSWORD_SUCCESS,
  CONFIRM_RESET_PASSWORD_ERR,
  CreateNewPasswordAction,
  CREATE_NEW_PASSWORD,
  CreateNewPasswordModel,
  CREATE_NEW_PASSWORD_SUCCESS,
  CREATE_NEW_PASSWORD_ERR,
  ChangeMyPasswordAction,
  CHANGE_MY_PASSWORD,
  CHANGE_MY_PASSWORD_SUCCESS,
  CHANGE_MY_PASSWORD_ERR,
  ChangeMyPasswordModel,
  MINUS_POINT_MYINFO,
  SET_PROFILE,
} from "./Types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = (
  payload: LoginState,
  callback: () => void
): AuthActionTypes => {
  return {
    type: LOGIN,
    payload,
    callback,
  };
};

export const loginSuccess = (payload: LoginResponse): AuthActionTypes => {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
};

export const loginErr = (payload: string): AuthActionTypes => {
  return {
    type: LOGIN_ERR,
    payload,
  };
};

export const changePassword = (
  payload: ChangePasswordModel
): AuthActionTypes => {
  return {
    type: CHANGE_PASSWORD,
    payload,
  };
};

export const updateAccountInformation = (
  payload: UpdateAccountInformationModel
): AuthActionTypes => {
  return {
    type: UPDATE_ACCOUNT_INFORMATION,
    payload,
  };
};

export const logout = (callback: () => void): AuthActionTypes => {
  return {
    type: LOGOUT,
    callback,
  };
};

export const fetchMyInfo = (): AuthActionTypes => {
  console.log('vaof actions');
  
  return {
    type: FETCH_MY_INFO,
  };
};

export const fetchAccoutManager = (): AuthActionTypes => {
  return {
    type: FETCH_ACCOUNT_MANAGER,
  };
};

export const fetchAccoutManagerSuccess = (payload: MyInfo): AuthActionTypes => {
  return {
    type: FETCH_MY_INFO_SUCCESS,
    payload,
  };
};

export const fetchAccoutManagerError = (): AuthActionTypes => {
  return {
    type: FETCH_MY_INFO_ERR,
  };
};

export const fetchMyInfoSuccess = (payload: MyInfo): AuthActionTypes => {
  return {
    type: FETCH_MY_INFO_SUCCESS,
    payload,
  };
};

export const fetchMyInfoError = (): AuthActionTypes => {
  return {
    type: FETCH_MY_INFO_ERR,
  };
};
export const forgotPassword = (
  payload: $PropertyType<LoginState, "Email">
): AuthActionTypes => {
  return {
    type: FORGOT_PASSWORD,
    payload,
  };
};

export const register = (payload: RegisterModel): AuthActionTypes => {
  return {
    type: REGISTER,
    payload,
  };
};

export const registerSuccess = (): AuthActionTypes => {
  return {
    type: REGISTER_SUCCESS,
  };
};

export const registerErr = (payload: string): AuthActionTypes => {
  return {
    type: REGISTER_ERR,
    payload,
  };
};

export const verify = (payload: VerifyModel): AuthActionTypes => {
  return {
    type: VERIFY,
    payload,
  };
};

export const verifySuccess = (): AuthActionTypes => {
  return {
    type: VERIFY_SUCCESS,
  };
};

export const verifyErr = (payload: string): AuthActionTypes => {
  return {
    type: VERIFY_ERR,
    payload,
  };
};

export const updateProfile = (payload: UpdateProfileModel): AuthActionTypes => {
  return {
    type: UPDATE_PROFILE,
    payload,
  };
};

export const updateProfileSuccess = (): AuthActionTypes => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
  };
};

export const updateProfileErr = (payload: string): AuthActionTypes => {
  return {
    type: UPDATE_PROFILE_ERR,
    payload,
  };
};

export const updateAccountManager = (
  payload: UpdateAccoutManagerModel
): AuthActionTypes => {
  return {
    type: UPDATE_ACCOUNTMANAGER,
    payload,
  };
};

export const updateAccountManagerSuccess = (): AuthActionTypes => {
  return {
    type: UPDATE_ACCOUNTMANAGER_SUCCESS,
  };
};

export const updateAccountManagerErr = (payload: string): AuthActionTypes => {
  return {
    type: UPDATE_ACCOUNTMANAGER_ERR,
    payload,
  };
};

export const resetPassword = (payload: ResetPasswordModel): AuthActionTypes => {
  return {
    type: RESET_PASSWORD,
    payload,
  };
};

export const resetPasswordSuccess = (): AuthActionTypes => {
  return {
    type: RESET_PASSWORD_SUCCESS,
  };
};

export const resetPasswordErr = (payload: string): AuthActionTypes => {
  return {
    type: RESET_PASSWORD_ERR,
    payload,
  };
};

export const confirmResetPassword = (
  payload: ConfirmResetPasswordModel
): AuthActionTypes => {
  return {
    type: CONFIRM_RESET_PASSWORD,
    payload,
  };
};

export const confirmResetPasswordSuccess = (): AuthActionTypes => {
  return {
    type: CONFIRM_RESET_PASSWORD_SUCCESS,
  };
};

export const confirmResetPasswordErr = (payload: string): AuthActionTypes => {
  return {
    type: CONFIRM_RESET_PASSWORD_ERR,
    payload,
  };
};

export const createNewPassword = (
  payload: CreateNewPasswordModel
): AuthActionTypes => {
  return {
    type: CREATE_NEW_PASSWORD,
    payload,
  };
};

export const createNewPasswordSuccess = (): AuthActionTypes => {
  return {
    type: CREATE_NEW_PASSWORD_SUCCESS,
  };
};

export const createNewPassworddErr = (payload: string): AuthActionTypes => {
  return {
    type: CREATE_NEW_PASSWORD_ERR,
    payload,
  };
};

export const changeMyPassword = (
  payload: ChangeMyPasswordModel
): AuthActionTypes => {
  return {
    type: CHANGE_MY_PASSWORD,
    payload,
  };
};

export const changeMyPasswordSuccess = (): AuthActionTypes => {
  return {
    type: CHANGE_MY_PASSWORD_SUCCESS,
  };
};

export const changeMyPassworddErr = (payload: string): AuthActionTypes => {
  return {
    type: CHANGE_MY_PASSWORD_ERR,
    payload,
  };
};

export const resendVerificationCode = createAsyncThunk(
  "auth/resendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/resend-code", { email });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Kiểm tra nếu là lỗi Axios và có response
        return rejectWithValue(error.response.data);
      }
      // Trường hợp khác không phải lỗi Axios
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const minusPointMyInfo = (payload: number): AuthActionTypes => {
  return {
      type: MINUS_POINT_MYINFO,
      payload,
  };
};

export const setProfile = (payload: any): AuthActionTypes => {
  return {
    type: SET_PROFILE,
    payload,
  };
};