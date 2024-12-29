import {
  API_ENDPOINT_FETCH_LIST_ACCOUNT,
  API_ENDPOINT_FETCH_ACCOUNT_DETAILS_MANAGERMENT,
  API_ENDPOINT_FETCH_LIST_ACCOUNT_INVITE,
  prepare,
} from "@/services/Endpoints";
import { apiCall, apiGetCall, apiPostCall, ApiResponse } from "../saga-effects/api";
import {
  FETCH_LIST_ACCOUNT,
  FETCH_ACCOUNT_DETAILS_MANAGERMENT,
  FetchListAccountAction,
  FetchAccountDetailsManagermentAction,
  FETCH_LIST_ACCOUNT_INVITE,
} from "./Types";
import {
  fetchListAccountErr,
  fetchListAccountSuccess,
  fetchAccountDetailsManagermentErr,
  fetchAccountDetailsManagermentSuccess,
  fetchAccountDetailsManagerment,
  fetchListAccountInviteSuccess,
  fetchListAccountInviteErr,
} from "./Actions";
import { notifyErrorFromApiCommon, openNotification } from "@/utility/Utility";
import { put, takeEvery, takeLatest } from "redux-saga/effects";

function* fetchListAccountSaga(action: FetchListAccountAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_LIST_ACCOUNT,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchUserName: action.payload.searchUserName,
        searchEmail: action.payload.searchEmail,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        status: action.payload.status,
      }
    );
    if (response.data.resultCd === 1) {
      const data = {
        users: response.data.users.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchListAccountSuccess(data));
    } else {
      yield put(fetchListAccountErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(fetchListAccountErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchListAccountInviteSaga() {
  try {
    const response: ApiResponse<any> = yield apiCall(apiGetCall, prepare(API_ENDPOINT_FETCH_LIST_ACCOUNT_INVITE, {}, {}));
    if (response.data.resultCd === 1) {
      yield put(
        fetchListAccountInviteSuccess(response.data?.accountInvites?.$values)
      );
    } else {
      yield put(fetchListAccountInviteErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListAccountInviteErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchAccountDetailsManagermentSaga(
  action: FetchAccountDetailsManagermentAction
) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_ACCOUNT_DETAILS_MANAGERMENT,
      {
        accountId: action.payload.accountId,
        roleNew: 0,
        isActive: true,
      }
    );
    if (response.data.resultCd === 1) {
      const data = {
        users: response.data,
      };
      console.log("data: ", data);
      yield put(fetchAccountDetailsManagermentSuccess(data));
    } else {
      const errorMessage = notifyErrorFromApiCommon(response);
      yield put(fetchAccountDetailsManagermentErr(errorMessage));
      openNotification("error", "", errorMessage);
    }
  } catch (error) {
    const errorMessage = notifyErrorFromApiCommon(error);
    openNotification("error", "", errorMessage);
    yield put(fetchAccountDetailsManagermentErr(errorMessage));
  }
}

export function* watchAccountActions() {
  yield takeEvery(FETCH_LIST_ACCOUNT, fetchListAccountSaga);
  yield takeEvery(FETCH_ACCOUNT_DETAILS_MANAGERMENT, fetchAccountDetailsManagermentSaga);
  yield takeEvery(FETCH_LIST_ACCOUNT_INVITE, fetchListAccountInviteSaga);
}
