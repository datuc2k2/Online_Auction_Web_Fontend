import { WithLogoutAction } from "@/types/Global";
import { ADD_PAYMENT, ADD_PAYMENT_ERR, ADD_PAYMENT_SUCCESS, FETCH_LIST_PAYMENT, FETCH_LIST_PAYMENT_ERR, FETCH_LIST_PAYMENT_SUCCESS, PaymentActionTypes, PaymentState } from "./Types";

const initialState: PaymentState = {};

const paymentReducer = (state = initialState, action: WithLogoutAction<PaymentActionTypes>): PaymentState => {
    switch (action.type) {
        case ADD_PAYMENT:
            return {
                ...state,
                loading: true,
            };
        case ADD_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case ADD_PAYMENT_ERR:
            return {
                ...state,
                loading: false,
            };
        case FETCH_LIST_PAYMENT:
            return {
                ...state,
                loading: true,
            };
        case FETCH_LIST_PAYMENT_SUCCESS:
            return {
              ...state,
              loading: false,
              listPayment: action.payload,
            };
            
        case FETCH_LIST_PAYMENT_ERR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export default paymentReducer;
