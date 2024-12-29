import {
  AccountActionTypes,
  AccountState,
  FETCH_LIST_ACCOUNT,
  FETCH_LIST_ACCOUNT_ERR,
  FETCH_LIST_ACCOUNT_SUCCESS,
  Model,
  ModelAccountDetailsManagerment,
  User,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR,
  AccountDetail,
  FETCH_LIST_ACCOUNT_INVITE,
  FETCH_LIST_ACCOUNT_INVITE_SUCCESS,
  FETCH_LIST_ACCOUNT_INVITE_ERR,
  AccountInviteModel,
} from "./Types";

export const fetchListAccount = (payload: Model): AccountActionTypes => {
  return {
    type: FETCH_LIST_ACCOUNT,
    payload,
  };
};

export const fetchListAccountSuccess = (payload: {
  users: User[];
  allRecords: number;
}): AccountActionTypes => {
  return {
    type: FETCH_LIST_ACCOUNT_SUCCESS,
    payload,
  };
};

export const fetchListAccountErr = (payload: string): AccountActionTypes => {
  return {
    type: FETCH_LIST_ACCOUNT_ERR,
    payload,
  };
};

export const fetchListInviteAccount = (): AccountActionTypes => {
  return {
    type: FETCH_LIST_ACCOUNT_INVITE,
  };
};

export const fetchListAccountInviteSuccess = (payload: AccountInviteModel[]): AccountActionTypes => {
  return {
    type: FETCH_LIST_ACCOUNT_INVITE_SUCCESS,
    payload,
  };
};

export const fetchListAccountInviteErr = (payload: string): AccountActionTypes => {
  return {
    type: FETCH_LIST_ACCOUNT_INVITE_ERR,
    payload,
  };
};

export const fetchAccountDetailsManagerment = (
  payload: ModelAccountDetailsManagerment
): AccountActionTypes => {
  return {
    type: FETCH_ACCOUNT_DETAILS_MANAGERMENT,
    payload,
  };
};

export const fetchAccountDetailsManagermentSuccess = (payload: {
  users: AccountDetail;
}): AccountActionTypes => {
  return {
    type: FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS,
    payload,
  };
};

export const fetchAccountDetailsManagermentErr = (
  payload: string
): AccountActionTypes => {
  return {
    type: FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR,
    payload,
  };
};
