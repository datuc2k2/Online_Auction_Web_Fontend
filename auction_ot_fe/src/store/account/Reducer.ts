import { WithLogoutAction } from "@/types/Global";
import {
  AccountActionTypes,
  AccountState,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS,
  FETCH_LIST_ACCOUNT,
  FETCH_LIST_ACCOUNT_ERR,
  FETCH_LIST_ACCOUNT_INVITE,
  FETCH_LIST_ACCOUNT_INVITE_ERR,
  FETCH_LIST_ACCOUNT_INVITE_SUCCESS,
  FETCH_LIST_ACCOUNT_SUCCESS,
} from "./Types";

const initialAccountState: AccountState = {};

const accountReducer = (
  state = initialAccountState,
  action: WithLogoutAction<AccountActionTypes>
): AccountState => {
  switch (action.type) {
    case FETCH_LIST_ACCOUNT:
      return {
        ...state,
        loading: true,
      };
    case FETCH_LIST_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        accountListData: action.payload,
      };
    case FETCH_LIST_ACCOUNT_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_ACCOUNT_DETAILS_MANAGERMENT:
      return {
        ...state,
        loading: true,
      };

    case FETCH_LIST_ACCOUNT_INVITE:
      return {
        ...state,
        loading: false,
      };
    case FETCH_LIST_ACCOUNT_INVITE_SUCCESS:
      return {
        ...state,
        loading: false,
        accountInvites: action.payload,
      };
    case FETCH_LIST_ACCOUNT_INVITE_ERR:
      return {
        ...state,
        loading: true,
      };

    case FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        accountDetailManagermentData: action.payload,
      };
    case FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};


export { accountReducer };
