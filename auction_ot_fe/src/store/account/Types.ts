
export interface AccountState {
  accountListData?: { users: User[]; allRecords: number };
  accountInvites?: AccountInviteModel[];
  loading?: boolean;
  error?: string;
  accountDetailManagermentData?: { users: AccountDetail };
}

export interface AccountDetail {
  id: string | null;
  account: Account | null;
  resultCd: number | null;
  messages: string | null;
  exception: string | null;
}

export interface Account {
  id: string | null;
  userId: number | null;
  username: string | null;
  password: string | null;
  isActive: boolean | null;
  lastLogin: string | null;
  verifyToken: string | null;
  verifyTokenExpiresAt: string | null;
  emailVerified: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  userProfile: UserProfile | null;
  auctionBids: AuctionBid[] | null;
  auctionInvitations: AuctionInvitation[] | null;
  auctionRequests: AuctionRequest[] | null;
  auctions: Auction[] | null;
  auditLogs: AuditLog[] | null;
  deposits: Deposit[] | null;
  notifications: Notification[] | null;
  passwordResetRequests: PasswordResetRequest[] | null;
  paymentHistories: PaymentHistory[] | null;
  pointTransactions: PointTransaction[] | null;
  points: Point[] | null;
  userRoles: UserRoles | null;
}
interface UserProfile {
  id: string | null;
  userId: number | null;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  avatar: string | null;
  cccd: string | null;
  frontIdCard: string | null;
  backIdCard: string | null;
  dob: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  updatedBy: number | null;
}
export interface AuctionBid {}
export interface AuctionInvitation {}
export interface AuctionRequest {}
export interface Auction {}
export interface AuditLog {}
export interface Deposit {}
export interface Notification {}
export interface PasswordResetRequest {}
export interface PaymentHistory {}
export interface PointTransaction {}
export interface Point {}
// export interface User {
//   $ref?: string;
// }

export interface UserRole {
  userId: number;
  roleId: number;
  assignedAt: string;
  assignedBy?: string | null;
  updatedAt: string;
  updatedBy?: string | null;
  role?: string;
  // user: User;
}

export interface UserRoles {
  id: string | null;
  $values: UserRole[];
}
export interface User {
  id: string | null;
  userId: number | null;
  username: string | null;
  password: string | null;
  isActive: boolean | null;
  lastLogin: string | null;
  verifyToken: string | null;
  verifyTokenExpiresAt: string | null;
  emailVerified: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  userProfile: UserProfile;
}

export interface Model {
  displayCount: number;
  pageCount: number;
  searchUserName: string;
  searchEmail: string;
  startDate: string | null;
  endDate: string | null;
  status: boolean | null;
}
export interface ModelAccountDetailsManagerment {
  accountId: string;
  roleNew: number;
  isActive: boolean;
}

export interface AccountInviteModel {
  userId: number;
  username: string;
  email: string;
}

export const FETCH_LIST_ACCOUNT = "FETCH_LIST_ACCOUNT";
export const FETCH_LIST_ACCOUNT_SUCCESS = "FETCH_LIST_ACCOUNT_SUCCESS";
export const FETCH_LIST_ACCOUNT_ERR = "FETCH_LIST_ACCOUNT_ERR";

export const FETCH_LIST_ACCOUNT_INVITE = "FETCH_LIST_ACCOUNT_INVITE";
export const FETCH_LIST_ACCOUNT_INVITE_SUCCESS = "FETCH_LIST_ACCOUNT_INVITE_SUCCESS";
export const FETCH_LIST_ACCOUNT_INVITE_ERR = "FETCH_LIST_ACCOUNT_INVITE_ERR";

export const FETCH_ACCOUNT_DETAILS_MANAGERMENT =
  "FETCH_ACCOUNT_DETAILS_MANAGERMENT";
export const FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS =
  "FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS";
export const FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR =
  "FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR";

export interface FetchListAccountAction {
  type: typeof FETCH_LIST_ACCOUNT;
  payload: Model;
}
export interface FetchListAccountSuccessAction {
  type: typeof FETCH_LIST_ACCOUNT_SUCCESS;
  payload: { users: User[]; allRecords: number };
}
export interface FetchListAccountErrorAction {
  type: typeof FETCH_LIST_ACCOUNT_ERR;
  payload: string;
}
export interface FetchListAccountInviteAction {
  type: typeof FETCH_LIST_ACCOUNT_INVITE;
}
export interface FetchListAccountInviteSuccessAction {
  type: typeof FETCH_LIST_ACCOUNT_INVITE_SUCCESS;
  payload: AccountInviteModel[];
}
export interface FetchListAccountInviteErrorAction {
  type: typeof FETCH_LIST_ACCOUNT_INVITE_ERR;
  payload: string;
}
export interface FetchAccountDetailsManagermentAction {
  type: typeof FETCH_ACCOUNT_DETAILS_MANAGERMENT;
  payload: ModelAccountDetailsManagerment;
}
export interface FetchAccountDetailsManagermentSuccessAction {
  type: typeof FETCH_ACCOUNT_DETAILS_MANAGERMENT_SUCCESS;
  payload: { users: AccountDetail };
}
export interface FetchAccountDetailsManagermentErrorAction {
  type: typeof FETCH_ACCOUNT_DETAILS_MANAGERMENT_ERR;
  payload: string;
}

export type AccountActionTypes =
  | FetchListAccountInviteAction
  | FetchListAccountSuccessAction
  | FetchListAccountErrorAction

  | FetchListAccountAction
  | FetchListAccountInviteSuccessAction
  | FetchListAccountInviteErrorAction

  | FetchAccountDetailsManagermentAction
  | FetchAccountDetailsManagermentSuccessAction
  | FetchAccountDetailsManagermentErrorAction;
