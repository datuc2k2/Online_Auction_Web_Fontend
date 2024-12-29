/*
 * This file is part of OrangeHRM
 *
 * Copyright (C) 2020 onwards OrangeHRM (https://www.orangehrm.com/)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { AuthState, AuthActionTypes, LOGIN, LOGOUT, LOGIN_SUCCESS, LOGIN_ERR, CHANGE_PASSWORD, UPDATE_ACCOUNT_INFORMATION, REGISTER, REGISTER_SUCCESS, REGISTER_ERR, VERIFY, VERIFY_SUCCESS, VERIFY_ERR, FETCH_MY_INFO, FETCH_MY_INFO_SUCCESS, FETCH_MY_INFO_ERR, UPDATE_PROFILE, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_ERR, RESET_PASSWORD, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERR, CONFIRM_RESET_PASSWORD, CONFIRM_RESET_PASSWORD_SUCCESS, CONFIRM_RESET_PASSWORD_ERR, CREATE_NEW_PASSWORD, CREATE_NEW_PASSWORD_SUCCESS, CREATE_NEW_PASSWORD_ERR, CHANGE_MY_PASSWORD, CHANGE_MY_PASSWORD_SUCCESS, CHANGE_MY_PASSWORD_ERR, MINUS_POINT_MYINFO, MyInfo, SET_PROFILE } from './Types';
import { WithLogoutAction } from '../../types/Global';
import { useRouter } from 'next/navigation';

const initialState: AuthState = {

};

const authReducer = (state = initialState, action: WithLogoutAction<AuthActionTypes>): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ACCOUNT_INFORMATION:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      // Set the access token as a cookie
      document.cookie = `accessTokenAuction=${action.payload.accessToken}; path=/; secure; samesite=strict`;
      return {
        ...state,
        // shortName: action.payload.ShortName,
        access_token: action.payload.accessToken,
        // myInfo: action.payload.User,
        // className: action.payload.ClassName,
        loading: false,
      };
    case LOGIN_ERR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case REGISTER:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case REGISTER_ERR:
      return {
        ...state,
        loading: false,
      };
    case VERIFY:
      return {
        ...state,
        loading: true,
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case VERIFY_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_MY_INFO:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MY_INFO_SUCCESS:
      // Set the my info as a cookie
      const objSetToCookie = {
        userRoleId: action.payload?.userRoleId,
        userRoleName: action.payload?.userRoleName,
      }
      document.cookie = `myInfo=${JSON.stringify(objSetToCookie)}; path=/; secure; samesite=strict`;
      // localStorage.setItem('myInfo', JSON.stringify(action.payload))
      return {
        ...state,
        loading: false,
        myInfo: action.payload
      };

    case SET_PROFILE:
      console.log('action.payload: ',action.payload);
      
      return {
        ...state,
        myInfo: action.payload
      };

    case FETCH_MY_INFO_ERR:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_PROFILE_ERR:
      return {
        ...state,
        loading: false,
      };
    case RESET_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case RESET_PASSWORD_ERR:
      return {
        ...state,
        loading: false,
      };
    case CONFIRM_RESET_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case CONFIRM_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CONFIRM_RESET_PASSWORD_ERR:
      return {
        ...state,
        loading: false,
      };
    case CREATE_NEW_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case CREATE_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_NEW_PASSWORD_ERR:
      return {
        ...state,
        loading: false,
      };
    case CHANGE_MY_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_MY_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CHANGE_MY_PASSWORD_ERR:
      return {
        ...state,
        loading: false,
      };
    case MINUS_POINT_MYINFO:
      console.log('action.payloadNINUS: ', action.payload);

      return {
        ...state,
        myInfo: {
          ...(state.myInfo || {}),
          point: action.payload,
        } as MyInfo,
      };
    case LOGOUT:
      // Remove cookies by setting them to expire in the past
      document.cookie = "accessTokenAuction=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "myInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.setItem('reduxState', '{}');
      localStorage.removeItem("accessTokenAuction");
      localStorage.removeItem("myInfo");
      // action.callback();
      window.location.href = '/';
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default authReducer;
