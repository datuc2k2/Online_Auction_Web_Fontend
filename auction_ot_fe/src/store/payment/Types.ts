
export interface PaymentState {
  listPayment?: { paymentList: PointTransaction[]; allRecords: number };
  loading?: boolean;
  error?: string;
}

export interface SortSetting {
  key: string;
  direction: string;
}

export interface DisplayCount {
  displayCount: number;
  pageCount: number;
  sortSettings: SortSetting[];
}

export interface PaymentListParams {
  // displayCount: DisplayCount;
  displayCount: number;
  pageCount: number;
  searchName: string;
  startDate: string | null;
  endDate: string | null;
}

export interface AddPaymentModel {
  userId: number;
  auctionId: number;
  paymentAmount: number;
  currency: string;
  paymentTime: Date;
  description: string;
  callback: () => void;
}

// Interface cho UserProfile
export interface UserProfile {
  $id: string; // Đây là ID của UserProfile, có thể là một chuỗi
  fullName: string;
}

// Interface cho User
export interface User {
  $id: string; // ID của User
  userId: number;
  username: string;
  userProfile: UserProfile; // Liên kết tới UserProfile
}

// Interface cho PaymentHistory
export interface PointTransaction {
  $id: string; // ID của giao dịch
  transactionId: number; // ID của giao dịch
  userId: number; // ID của người dùng
  amount: string; // Số tiền giao dịch
  currency: string; // Loại tiền tệ
  transactionTime: string; // Thời gian giao dịch (ISO string)
  description: string; // Mô tả giao dịch
  transactionCode: string; // Mã giao dịch
  user: User; // Liên kết tới User
}

// Interface cho PaymentHistories
export interface PointTransactions {
  $id: string; // ID của PointTransactions
  $values: PointTransaction[]; // Mảng chứa các giao dịch
}

// Interface cho FetchMyPaymentsModel (để mô tả cấu trúc dữ liệu chính)
export interface FetchPointTransactionsModel {
  $id: string; // ID của FetchPointTransactionsModel
  pointTransactions: PointTransactions; // Liên kết tới PointTransactions
  allRecords: number; // Tổng số bản ghi
  resultCd: number; // Mã kết quả
  messages: string | null; // Thông báo, nếu có
  exception: string | null; // Lỗi, nếu có
}
export const FETCH_LIST_PAYMENT = "FETCH_LIST_PAYMENT";
export const FETCH_LIST_PAYMENT_SUCCESS = "FETCH_LIST_PAYMENT_SUCCESS";
export const FETCH_LIST_PAYMENT_ERR = "FETCH_LIST_PAYMENT_ERR";

export const ADD_PAYMENT = "ADD_PAYMENT";
export const ADD_PAYMENT_SUCCESS = "ADD_PAYMENT_SUCCESS";
export const ADD_PAYMENT_ERR = "ADD_PAYMENT_ERR";

export interface FetchListPaymentAction {
  type: typeof FETCH_LIST_PAYMENT;
  payload: PaymentListParams;
}
export interface FetchListPaymentSuccessAction {
  type: typeof FETCH_LIST_PAYMENT_SUCCESS;
  //   payload: FetchMyPaymentsModel;
  payload: { paymentList: PointTransaction[]; allRecords: number };
}
export interface FetchListPaymentErrorAction {
    type: typeof FETCH_LIST_PAYMENT_ERR;
    payload: string;
}

export interface AddPaymentAction {
    type: typeof ADD_PAYMENT;
    payload: AddPaymentModel;
}
export interface AddPaymentSuccessAction {
    type: typeof ADD_PAYMENT_SUCCESS;
}
export interface AddPaymentErrorAction {
    type: typeof ADD_PAYMENT_ERR;
    payload: string;
}

export type PaymentActionTypes =
    | FetchListPaymentAction
    | FetchListPaymentSuccessAction
    | FetchListPaymentErrorAction
    | AddPaymentAction
    | AddPaymentSuccessAction
    | AddPaymentErrorAction
