import { notifyErrorFromApiCommon, openNotification } from "@/utility/Utility";
import { apiCall, apiPostCall, ApiResponse } from "../saga-effects/api";
import {
  ADD_PAYMENT,
  AddPaymentAction,
  FETCH_LIST_PAYMENT,
  FetchListPaymentAction,
} from "./Types";
import { put, takeEvery } from "redux-saga/effects";
import {
  addPaymentErr,
  fetchListPaymentErr,
  fetchListPaymentSuccess,
} from "./Actions";
import {
  API_ENDPOINT_ADD_PAYMENT,
  API_ENDPOINT_FETCH_LIST_PAYMENT,
} from "@/services/Endpoints";
import { fetchMyInfo } from "../auth/Actions";

function* addPaymentSaga(action: AddPaymentAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_ADD_PAYMENT,
      {
        ...action.payload,
      }
    );
    if (response.data.resultCd === 1) {
      if(action.payload.auctionId === 0) {
        openNotification(
          "success",
          "Thành công",
          "Bạn đã nạp tiền vào hệ thống thành công"
        );
      } else {
        openNotification(
          "success",
          "Thành công",
          "Thanh toán phiên thành công"
        );
      }
      action.payload.callback();
      yield put(fetchMyInfo());
    } else {
      yield put(addPaymentErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchListPaymentSaga(action: FetchListPaymentAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_LIST_PAYMENT,
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
        searchName: action.payload.searchName,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    );

    if (response.data.resultCd === 1) {
      const data = {
        paymentList: response.data.pointTransactions.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchListPaymentSuccess(data));
    } else {
      yield put(fetchListPaymentErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListPaymentErr(notifyErrorFromApiCommon(error)));
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}


export function* watchPaymentActions() {
    yield takeEvery(ADD_PAYMENT, addPaymentSaga);
    yield takeEvery(FETCH_LIST_PAYMENT, fetchListPaymentSaga);
}
