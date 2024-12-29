import {
  ADD_PAYMENT,
  ADD_PAYMENT_ERR,
  ADD_PAYMENT_SUCCESS,
  AddPaymentModel,
  FETCH_LIST_PAYMENT,
  FETCH_LIST_PAYMENT_ERR,
  FETCH_LIST_PAYMENT_SUCCESS,
  FetchPointTransactionsModel,
  PaymentActionTypes,
  PointTransaction,
  PaymentListParams,
} from "./Types";

export const addPayment = (payload: AddPaymentModel): PaymentActionTypes => {
  return {
    type: ADD_PAYMENT,
    payload,
  };
};

export const addPaymentSuccess = (): PaymentActionTypes => {
  return {
    type: ADD_PAYMENT_SUCCESS,
  };
};

export const addPaymentErr = (payload: string): PaymentActionTypes => {
  return {
    type: ADD_PAYMENT_ERR,
    payload,
  };
};

export const fetchListPayment = (
  payload: PaymentListParams
): PaymentActionTypes => {
  return {
    type: FETCH_LIST_PAYMENT,
    payload,
  };
};
export const fetchListPaymentSuccess = (payload: {
  paymentList: PointTransaction[];
  allRecords: number;
}): PaymentActionTypes => {
  return {
    type: FETCH_LIST_PAYMENT_SUCCESS,
    payload,
  };
};

export const fetchListPaymentErr = (payload: string): PaymentActionTypes => {
  return {
    type: FETCH_LIST_PAYMENT_ERR,
    payload,
  };
};

