import { combineReducers } from "redux";
import authReducer from "./auth/Reducer";
import layoutReducer from "./theme-layout/Reducer";
import {
  accountReducer,
} from "./account/Reducer";
import auctionReducer from "./auction/Reducer";
import paymentReducer from "./payment/Reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  account: accountReducer,
  auction: auctionReducer,
  payment: paymentReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
