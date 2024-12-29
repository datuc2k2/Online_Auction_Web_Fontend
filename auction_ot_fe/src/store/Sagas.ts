import { all, call } from "redux-saga/effects";
import { watchAuthActions } from "./auth/Sagas";
import { watchAccountActions } from "./account/Sagas";
import { watchAuctionActions } from "./auction/Sagas";
import { watchPaymentActions } from "./payment/Sagas";

export default function* rootSaga() {
  yield all([
    call(watchAuthActions),
    call(watchAccountActions),
    call(watchAuctionActions),
    call(watchPaymentActions),
  ]);
}
