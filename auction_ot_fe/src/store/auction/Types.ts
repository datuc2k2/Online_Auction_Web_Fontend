export interface AuctionState {
  categoryData?: CategoryModel;
  myAuctions?: FetchMyAuctionsModel;
  auctionDetailForEdit?: AuctionDetailModel;
  auctionStatus?: GetStatusModel;
  auctionBids?: Bid[];
  loading?: boolean;
  error?: string;
  auctionList?: { auctionList: AuctionRequest1[]; allRecords: number };
  auctionListAdmin?: { auctionListAdmin: Auction[]; allRecords: number };
  auctionIsAccepted?: FetchAuctionRequestsIsAccepted;
  autoBid?: AutoBid;
  chatMessages?: ChatMessageModel[];
  auctionStatusList?: StatusAdminListModel;
  auctionReviewList?: AuctionReview[];
  auctionInvitationList?: AuctionInvitation[];
  winnerList?: WinnerListModel;
  biddedList?: BiddedListModel;
  disputeList?: DisputeListModel;
  disputeDetail?: DisputeAuctionDetailModel;
}

export interface AuctionReview {
  reviewId: number;
  auctionId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userAvatar: string | null;
}

export interface RequestAnAuctionModel {
  userID: number;
  productName: string;
  categoryId?: number | null;
  startingPrice: number;
  currency: string;
  stepPrice: number;
  mode: string;
  description: string;
  isPrivate?: boolean | null;
  invitedIds?: number[] | null;
  depositAmount?: number | null;
  depositDeadline?: Date | null;
  startTime: Date;
  endTime: Date;
  images: File[];
}

interface Category {
  id: number;
  name: string;
  value: string;
}
interface Mode {
  id: number;
  name: string;
}
export interface CategoryModel {
  categories: Category[];
  modes: Mode[];
}

export interface AuctionIsAcceptedParams {
  auctionId: number | null;
  isAccepted: boolean;
  reason: string | null;
  callback: () => void;
}
export interface InActiveAuctionParams {
  auctionId: number | null;
  callback: () => void;
}

export interface MyAuctionsParams {
  displayCount: number;
  pageCount: number;
  searchText: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
}

export interface ListAuctionParams {
  // displayCount: DisplayCount;
  displayCount: number;
  pageCount: number;
  searchName: string;
  isProcessed: boolean;
  startDate: string | null;
  endDate: string | null;
}
export interface ListAuctionAdminParams {
  // displayCount: DisplayCount;
  displayCount: number;
  pageCount: number;
  searchText: string;
  startDate: string | null;
  endDate: string | null;
  status: number;
}

export interface AuctionRequest {
  requestId: number;
  auctionId: number;
  userId: number;
  type: boolean;
  requestDetails: string;
  isApproved: boolean;
}

export interface AuctionModel {
  auctionId: number;
  userId: number;
  productName: string;
  status: number;
  paymentStatus: number;
  fee: number;
  statusName: string;
  categoryId: number;
  startingPrice: number;
  currency: string;
  stepPrice: number;
  mode: string;
  description: string;
  isPrivate: boolean;
  depositAmount: number | null;
  depositDeadline: string | null; // Use `Date` if you parse it as a Date object
  startTime: string; // Use `Date` if you parse it as a Date object
  endTime: string; // Use `Date` if you parse it as a Date object
  isActive: boolean;
  createdAt: string; // Use `Date` if you parse it as a Date object
  updatedAt: string; // Use `Date` if you parse it as a Date object
  auctionRequests: AuctionRequest[];
}

export interface FetchMyAuctionsModel {
  data: AuctionModel[];
  allRecords: number;
}

export interface AuctionDetailModel {
  $id: string;
  userID: number;
  productName: string;
  categoryId: number;
  startingPrice: number;
  currency: string;
  stepPrice: number;
  mode: string;
  description: string;
  isPrivate: boolean;
  invitedIds: {
    id: string;
    $values: number[];
  };
  aucStatus: {
    id: number;
    name: string;
  };
  aucStatusPayment: {
    id: number;
    name: string;
  };
  depositAmount: number;
  depositDeadline: string;
  startTime: string;
  endTime: string;
  images: {
    id: string;
    $values: string[];
  };
  createrProfile: {
    name: string;
    avata: string;
    email: string;
    phone: string;
    location: string;
  },
  fee: number;
}

interface Status {
  id: number;
  name: string;
}

export interface GetStatusModel {
  status: Status[];
  paymentStatus: Status[];
}

export interface Bid {
  $id: string;
  bidId: number;
  auctionId: number;
  userId: number;
  bidAmount: number;
  currency: string;
  bidTime: string;
  userName: string;
  userAvatar: string | null;
}

export interface BidToAuctionParams {
  AuctionId: number;
  BidAmount: number;
  DepositeAmount: number;
  IsFetchMyInfo: boolean;
  UpdatePoint: number;
  callback: () => void;
}

// Interface cho AuctionImage1
export interface AuctionImage1 {
  $id: string; // ID của ảnh đấu giá
  imageUrl: string; // URL của ảnh
}

// Interface cho AuctionImages
export interface AuctionImages {
  $id: string; // ID của danh sách ảnh
  $values: AuctionImage1[]; // Mảng chứa các ảnh đấu giá
}

// Interface cho Auction
export interface Auction1 {
  $id: string; // ID của đấu giá
  productName: string; // Tên sản phẩm
  categoryId: number; // ID danh mục
  categoryName: string; // Tên sản phẩm
  startingPrice: string; // Giá khởi điểm
  currency: string; // Loại tiền tệ
  stepPrice: number; // Bước giá
  mode: number; // Chế độ đấu giá
  modeName: string; // Tên sản phẩm
  description: string; // Mô tả sản phẩm
  isPrivate: boolean; // Đấu giá có riêng tư hay không
  depositAmount: number | null; // Số tiền đặt cọc (nếu có)
  depositDeadline: string | null; // Hạn đặt cọc (nếu có)
  startTime: string | null; // Thời gian bắt đầu
  endTime: string | null; // Thời gian kết thúc
  isActive: boolean; // Đấu giá có đang hoạt động không
  createdAt: string; // Thời gian tạo
  updatedAt: string; // Thời gian cập nhật
  status: number; // Trạng thái đấu giá
  paymentStatus: number; // Trạng thái thanh toán
  auctionImages: AuctionImages; // Danh sách hình ảnh của đấu giá
}

// Interface cho User
export interface User1 {
  $id: string; // ID của người dùng
  username: string; // Tên đăng nhập của người dùng
}
export interface GetStatus {
  $id: string;
  id: number; // ID của trạng thái
  name: string; // Tên trạng thái
}

export interface PaymentStatus {
  $id: string;
  id: number; // ID của trạng thái thanh toán
  name: string; // Tên trạng thái thanh toán
}
export interface StatusAdminListModel {
  status: GetStatus[];
  paymentStatus: PaymentStatus[];
}

// export interface StatusAdmin {
//   $id: string;
//   status: StatusAdminList;
//   paymentStatus: {
//     $id: string;
//     $values: PaymentStatus[]; // Danh sách trạng thái thanh toán
//   };
//   resultCd: number; // Mã kết quả
//   messages: string | null; // Thông báo nếu có
//   exception: string | null; // Ngoại lệ nếu có
// }
// Interface cho AuctionRequest
export interface AuctionRequest1 {
  $id: string; // ID của yêu cầu đấu giá
  requestId: number; // ID của yêu cầu
  auctionId: number; // ID của đấu giá
  userId: number; // ID của người dùng
  type: boolean; // Loại yêu cầu
  requestDetails: string; // Chi tiết yêu cầu
  isApproved: boolean; // Yêu cầu có được phê duyệt không
  createdAt: string; // Thời gian tạo yêu cầu
  approvedAt: string | null; // Thời gian phê duyệt (nếu có)
  approvedBy: string | null; // Ai phê duyệt (nếu có)
  user: User1; // Thông tin người dùng
  auction: Auction1; // Thông tin đấu giá
}

// Interface cho AuctionRequests1
export interface AuctionRequests1 {
  $id: string; // ID của danh sách yêu cầu đấu giá
  $values: AuctionRequest[]; // Mảng chứa các yêu cầu đấu giá
}

// Interface chính cho dữ liệu trả về từ API
export interface FetchAuctionRequestsModel1 {
  $id: string; // ID của mô hình dữ liệu
  auctionRequests1: AuctionRequests1; // Danh sách các yêu cầu đấu giá
  allRecords: number; // Tổng số bản ghi
  resultCd: number; // Mã kết quả
  messages: string | null; // Thông báo, nếu có
  exception: string | null; // Lỗi, nếu có
}

export interface FetchAuctionRequestsIsAccepted {
  $id: string; // ID của mô hình dữ liệu
  resultCd: number; // Mã kết quả
  messages: string | null; // Thông báo, nếu có
  exception: string | null; // Lỗi, nếu có
}

export interface CreateAutoBidParams {
  AuctionId: number;
  UserId: number;
  MaxBidAmount: number;
  callback: () => void;
}

export interface FetchAutoBidParams {
  AuctionId: number;
  UserId: number;
}

export interface AutoBid {
  $id: string;
  autoBidId: number;
  auctionId: number;
  userId: number;
  maxBidAmount: number;
  currentBidAmount: number;
  currency: string;
  createdAt: string;
  auction: any | null;
}

export interface deleteAutoBidParams {
  autoBidId: number;
  callback: () => void;
}

export interface ChatMessageModel {
  messageId: number;
  chatId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  isDeleted: boolean;
  auctionId: number;
  avatar: string;
}

export interface CreateChatMessageParams {
  AuctionId: number;
  Message: string;
  SenderId: number;
}

export interface AuctionRequest {
  $id: string;
  requestId: number;
  auctionId: number;
  userId: number;
  type: boolean;
  requestDetails: string;
  isApproved: boolean;
  approvedAt: string | null;
}

export interface AuctionRequests {
  $id: string;
  $values: AuctionRequest[];
}
export interface Auction {
  $id: string;
  auctionId: number;
  userId: number;
  productName: string;
  status: number;
  statusName: string;
  paymentStatus: number;
  categoryId: number;
  startingPrice: number;
  currency: string;
  stepPrice: number;
  mode: number;
  description: string;
  isPrivate: boolean;
  depositAmount: number | null;
  depositDeadline: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  auctionRequests: AuctionRequests[];
}
export interface ListAuctionAdmin {
  $id: string;
  auction: {
    $id: string;
    $values: Auction[];
  };
  allRecords: number;
  resultCd: number;
  messages: string | null;
  exception: string | null;
}

export interface CreateAuctionReviewParams {
  auctionId: number;
  userId: number;
  rating: number;
  comment: string | null;
}

export interface AuctionInvitation {
  invitationId: number;
  auctionId: number;
  invitedUserId: number;
  isAccepted: boolean;
  invitedAt: string;
}

export interface WinnerListParams {
  displayCount: number;
  pageCount: number;
  searchText: string;
  startDate: string | null;
  endDate: string | null;
}

export interface AuctionWinner {
  $id: string;
  userId: number;
  productName: string;
  status: number;
  statusName: string;
  categoryId: number;
  categoryName: string;
  endPrice: number;
  currency: string;
  stepPrice: number;
  mode: number;
  isPrivate: boolean;
  depositDeadline: string;
  endTime: string;
  isActive: boolean;
  isWinner: boolean;
}

export interface Winner {
  $id: string;
  auctionId: number;
  userId: number;
  bidAmount: number;
  currency: string;
  bidTime: string;
  confirmStatus: string;
  depositDlStatus: string;
  auction: AuctionWinner;
}

export interface WinnerListModel {
  winnerList: Winner[];
  allRecords: number;
}

interface Bidded {
  $id: string;
  auctionId: number;
  userId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  endPrice: number;
  currency: string;
  depositDeadline: string;
  depositDlStatus: string;
  endTime: string;
  winnerID: number;
  winnerName: string;
  confirmStatus: string;
}

export interface BiddedListModel {
  biddedList: Bidded[];
  allRecords: number;
}

interface AuctionDispute {
  $id: string;
  auctionId: number;
  userId: number;
  productName: string;
  categoryId: number;
  categoryName: string | null;
  endPrice: number;
  currency: string;
  depositDeadline: string;
  endTime: string;
  winnerID: number;
  winnerName: string | null;
  confirmStatus: string | null;
}

interface Dispute {
  id: string;
  disputeId: number;
  auctionId: number;
  winnerId: number;
  winnerName: string;
  creatorId: number;
  creatorName: string;
  disputeReason: string | null;
  winnerConfirmed: boolean;
  creatorConfirmed: boolean | null;
  winnerEvidence: string;
  creatorEvidence: string | null;
  adminDecision: string | null;
  disputeStatusId: number;
  createdAt: string;
  auction: AuctionDispute;
}

export interface DisputeListModel {
  disputeList: Dispute[];
  allRecords: number;
}

interface AuctionDisputeDto {
  id: string; // Corresponds to "$id"
  auctionId: number;
  userId: number;
  productName: string;
  categoryId: number;
  categoryName: string | null;
  endPrice: number;
  currency: string;
  depositDeadline: string; // Use Date if you plan to parse this as a Date object
  endTime: string;         // Use Date if you plan to parse this as a Date object
  winnerID: number;
  winnerName: string | null;
  confirmStatus: string | null;
}

interface DisputeDto {
  id: string;
  disputeId: number;
  auctionId: number;
  winnerId: number;
  winnerName: string;
  creatorId: number;
  creatorName: string;
  disputeReason: string | null;
  winnerConfirmed: boolean;
  creatorConfirmed: boolean | null;
  winnerEvidence: string;
  creatorEvidence: string | null;
  adminDecision: string | null;
  disputeStatusId: number;
  createdAt: string;
  auction: AuctionDisputeDto;
}

interface WinnerEvidence {
  $id: string;
  evidenceId: number;
  disputeId: number;
  uploadedBy: number;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}


export interface DisputeAuctionDetailModel {
  disputeDto: DisputeDto;
  winnerEvidence: WinnerEvidence | null;
  creatorEvidence: WinnerEvidence | null;
}


export const CREATE_AUCTION_REVIEW = "CREATE_AUCTION_REVIEW";
export const CREATE_AUCTION_REVIEW_SUCCESS = "CREATE_AUCTION_REVIEW_SUCCESS";
export const CREATE_AUCTION_REVIEW_ERR = "CREATE_AUCTION_REVIEW_ERR";

export const FETCH_AUCTION_REVIEW = "FETCH_AUCTION_REVIEW";
export const FETCH_AUCTION_REVIEW_SUCCESS = "FETCH_AUCTION_REVIEW_SUCCESS";
export const FETCH_AUCTION_REVIEW_ERR = "FETCH_AUCTION_REVIEW_ERR";

export const FETCH_WINNER_LIST = "FETCH_WINNER_LIST";
export const FETCH_WINNER_LIST_SUCCESS = "FETCH_WINNER_LIST_SUCCESS";
export const FETCH_WINNER_LIST_ERR = "FETCH_WINNER_LIST_ERR";

export const FETCH_BIDDED_LIST = "FETCH_BIDDED_LIST";
export const FETCH_BIDDED_LIST_SUCCESS = "FETCH_BIDDED_LIST_SUCCESS";
export const FETCH_BIDDED_LIST_ERR = "FETCH_BIDDED_LIST_ERR";

export const FETCH_DISPUTE_LIST = "FETCH_DISPUTE_LIST";
export const FETCH_DISPUTE_LIST_SUCCESS = "FETCH_DISPUTE_LIST_SUCCESS";
export const FETCH_DISPUTE_LIST_ERR = "FETCH_DISPUTE_LIST_ERR";

export const FETCH_DISPUTE_DETAIL = "FETCH_DISPUTE_DETAIL";
export const FETCH_DISPUTE_DETAIL_SUCCESS = "FETCH_DISPUTE_DETAIL_SUCCESS";
export const FETCH_DISPUTE_DETAIL_ERR = "FETCH_DISPUTE_DETAIL_ERR";

export const FETCH_AUCTION_INVITATION = "FETCH_AUCTION_INVITATION";
export const FETCH_AUCTION_INVITATION_SUCCESS = "FETCH_AUCTION_INVITATION_SUCCESS";
export const FETCH_AUCTION_INVITATION_ERR = "FETCH_AUCTION_INVITATION_ERR";

export const REQUEST_AN_AUCTION = "REQUEST_AN_AUCTION";
export const REQUEST_AN_AUCTION_SUCCESS = "REQUEST_AN_AUCTION_SUCCESS";
export const REQUEST_AN_AUCTION_ERR = "REQUEST_AN_AUCTION_ERR";

export const FETCH_CATEGORY = "FETCH_CATEGORY";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS";
export const FETCH_CATEGORY_ERR = "FETCH_CATEGORY_ERR";

export const FETCH_MY_AUCTIONS = "FETCH_MY_AUCTIONS";
export const FETCH_MY_AUCTIONS_SUCCESS = "FETCH_MY_AUCTIONS_SUCCESS";
export const FETCH_MY_AUCTIONS_ERR = "FETCH_MY_AUCTIONS_ERR";

export const FETCH_AUCTION_DETAIL = "FETCH_AUCTION_DETAIL";
export const FETCH_AUCTION_DETAIL_SUCCESS = "FETCH_AUCTION_DETAIL_SUCCESS";
export const FETCH_AUCTION_DETAIL_ERR = "FETCH_AUCTION_DETAIL_ERR";

export const FETCH_STATUS = "FETCH_STATUS";
export const FETCH_STATUS_SUCCESS = "FETCH_STATUS_SUCCESS";
export const FETCH_STATUS_ERR = "FETCH_STATUS_ERR";

export const FETCH_AUCTION_BID = "FETCH_AUCTION_BID";
export const FETCH_AUCTION_BID_SUCCESS = "FETCH_AUCTION_BID_SUCCESS";
export const FETCH_AUCTION_BID_ERR = "FETCH_AUCTION_BID_ERR";

export const BID_TO_AUCTION = "BID_TO_AUCTION";
export const BID_TO_AUCTION_SUCCESS = "BID_TO_AUCTION_SUCCESS";
export const BID_TO_AUCTION_ERR = "BID_TO_AUCTION_ERR";

export const CREATE_AUTO_BID = "CREATE_AUTO_BID";
export const CREATE_AUTO_BID_SUCCESS = "CREATE_AUTO_BID_SUCCESS";
export const CREATE_AUTO_BID_ERR = "CREATE_AUTO_BID_ERR";

export const CREATE_CHAT_MESSAGE = "CREATE_CHAT_MESSAGE";
export const CREATE_CHAT_MESSAGE_SUCCESS = "CREATE_CHAT_MESSAGE_SUCCESS";
export const CREATE_CHAT_MESSAGE_ERR = "CREATE_CHAT_MESSAGE_ERR";

export const ADD_CHAT_MESSAGE = "ADD_CHAT_MESSAGE";

export const DELETE_AUTO_BID = "DELETE_AUTO_BID";
export const DELETE_AUTO_BID_SUCCESS = "DELETE_AUTO_BID_SUCCESS";
export const DELETE_AUTO_BID_ERR = "DELETE_AUTO_BID_ERR";

export const FETCH_LIST_AUCTION = "FETCH_LIST_AUCTION";
export const FETCH_LIST_AUCTION_SUCCESS = "FETCH_LIST_AUCTION_SUCCESS";
export const FETCH_LIST_AUCTION_ERR = "FETCH_LIST_AUCTION_ERR";

export const FETCH_LIST_AUCTION_ADMIN = "FETCH_LIST_AUCTION_ADMIN";
export const FETCH_LIST_AUCTION_ADMIN_SUCCESS =
  "FETCH_LIST_AUCTION_ADMIN_SUCCESS";
export const FETCH_LIST_AUCTION_ADMIN_ERR = "FETCH_LIST_AUCTION_ADMIN_ERR";

export const FETCH_LIST_STATUS_AUCTION = "FETCH_LIST_STATUS_AUCTION";
export const FETCH_LIST_STATUS_AUCTION_SUCCESS =
  "FETCH_LIST_STATUS_AUCTION_SUCCESS";
export const FETCH_LIST_STATUS_AUCTION_ERR = "FETCH_LIST_STATUS_AUCTION_ERR";

export const FETCH_AUTO_BID = "FETCH_AUTO_BID";
export const FETCH_AUTO_BID_SUCCESS = "FETCH_AUTO_BID_SUCCESS";
export const FETCH_AUTO_BID_ERR = "FETCH_AUTO_BID_ERR";

export const FETCH_CHAT_MESSAGE = "FETCH_CHAT_MESSAGE";
export const FETCH_CHAT_MESSAGE_SUCCESS = "FETCH_CHAT_MESSAGE_SUCCESS";
export const FETCH_CHAT_MESSAGE_ERR = "FETCH_CHAT_MESSAGE_ERR";

export const FETCH_AUCTION_ISACCEPTED = "FETCH_AUCTION_ISACCEPTED";
export const FETCH_AUCTION_ISACCEPTED_SUCCESS =
  "FETCH_AUCTION_ISACCEPTED_SUCCESS";
export const FETCH_AUCTION_ISACCEPTED_ERR = "FETCH_AUCTION_ISACCEPTED_ERR";

export interface CreateAuctionReviewAction {
  type: typeof CREATE_AUCTION_REVIEW;
  payload: CreateAuctionReviewParams;
}
export interface CreateAuctionReviewSuccessAction {
  type: typeof CREATE_AUCTION_REVIEW_SUCCESS;
}
export interface CreateAuctionReviewErrorAction {
  type: typeof CREATE_AUCTION_REVIEW_ERR;
  payload: string;
}

export interface FetchAuctionReviewAction {
  type: typeof FETCH_AUCTION_REVIEW;
  payload: number;
}
export interface FetchAuctionReviewSuccessAction {
  type: typeof FETCH_AUCTION_REVIEW_SUCCESS;
  payload: AuctionReview[];
}
export interface FetchAuctionReviewErrorAction {
  type: typeof FETCH_AUCTION_REVIEW_ERR;
  payload: string;
}

export interface FetchWinnerListAction {
  type: typeof FETCH_WINNER_LIST;
  payload: WinnerListParams;
}
export interface FetchWinnerListSuccessAction {
  type: typeof FETCH_WINNER_LIST_SUCCESS;
  payload: WinnerListModel;
}
export interface FetchWinnerListErrorAction {
  type: typeof FETCH_WINNER_LIST_ERR;
  payload: string;
}

export interface FetchBiddedListAction {
  type: typeof FETCH_BIDDED_LIST;
  payload: WinnerListParams;
}
export interface FetchBiddedListSuccessAction {
  type: typeof FETCH_BIDDED_LIST_SUCCESS;
  payload: BiddedListModel;
}
export interface FetchBiddedListErrorAction {
  type: typeof FETCH_BIDDED_LIST_ERR;
  payload: string;
}

export interface FetchDisputeListAction {
  type: typeof FETCH_DISPUTE_LIST;
  payload: WinnerListParams;
}
export interface FetchDisputeListSuccessAction {
  type: typeof FETCH_DISPUTE_LIST_SUCCESS;
  payload: DisputeListModel;
}
export interface FetchDisputeListErrorAction {
  type: typeof FETCH_DISPUTE_LIST_ERR;
  payload: string;
}

export interface FetchDisputeDetailAction {
  type: typeof FETCH_DISPUTE_DETAIL;
  payload: number;
}
export interface FetchDisputeDetailSuccessAction {
  type: typeof FETCH_DISPUTE_DETAIL_SUCCESS;
  payload: DisputeAuctionDetailModel;
}
export interface FetchDisputeDetailErrorAction {
  type: typeof FETCH_DISPUTE_DETAIL_ERR;
  payload: string;
}

export interface FetchAuctionInvitationAction {
  type: typeof FETCH_AUCTION_INVITATION;
  payload: number;
}
export interface FetchAuctionInvitationSuccessAction {
  type: typeof FETCH_AUCTION_INVITATION_SUCCESS;
  payload: AuctionInvitation[];
}
export interface FetchAuctionInvitationErrorAction {
  type: typeof FETCH_AUCTION_INVITATION_ERR;
  payload: string;
}

export const FETCH_INACTIVE_AUCTION = "FETCH_INACTIVE_AUCTION";
export const FETCH_INACTIVE_AUCTION_SUCCESS = "FETCH_INACTIVE_AUCTION_SUCCESS";
export const FETCH_INACTIVE_AUCTION_ERR = "FETCH_INACTIVE_AUCTION_ERR";

export interface RequestAnAuctionAction {
  type: typeof REQUEST_AN_AUCTION;
  payload: RequestAnAuctionModel;
}
export interface RequestAnAuctionSuccessAction {
  type: typeof REQUEST_AN_AUCTION_SUCCESS;
}
export interface RequestAnAuctionErrorAction {
  type: typeof REQUEST_AN_AUCTION_ERR;
  payload: string;
}
export interface FetchCategoryAction {
  type: typeof FETCH_CATEGORY;
}
export interface FetchCategorySuccessAction {
  type: typeof FETCH_CATEGORY_SUCCESS;
  payload: CategoryModel;
}
export interface FetchCategoryErrorAction {
  type: typeof FETCH_CATEGORY_ERR;
  payload: string;
}
export interface FetchMyAuctionsAction {
  type: typeof FETCH_MY_AUCTIONS;
  payload: MyAuctionsParams;
}
export interface FetchMyAuctionsSuccessAction {
  type: typeof FETCH_MY_AUCTIONS_SUCCESS;
  payload: FetchMyAuctionsModel;
}
export interface FetchMyAuctionsErrorAction {
  type: typeof FETCH_MY_AUCTIONS_ERR;
  payload: string;
}
export interface FetchAuctionDetailAction {
  type: typeof FETCH_AUCTION_DETAIL;
  payload: number;
}
export interface FetchAuctionDetailSuccessAction {
  type: typeof FETCH_AUCTION_DETAIL_SUCCESS;
  payload: AuctionDetailModel;
}
export interface FetchAuctionDetailErrorAction {
  type: typeof FETCH_AUCTION_DETAIL_ERR;
  payload: string;
}
export interface FetchStatusAction {
  type: typeof FETCH_STATUS;
}
export interface FetchStatusSuccessAction {
  type: typeof FETCH_STATUS_SUCCESS;
  payload: GetStatusModel;
}
export interface FetchStatusErrorAction {
  type: typeof FETCH_STATUS_ERR;
  payload: string;
}
export interface FetchAuctionBidAction {
  type: typeof FETCH_AUCTION_BID;
  payload: number;
}
export interface FetchAuctionBidSuccessAction {
  type: typeof FETCH_AUCTION_BID_SUCCESS;
  payload: Bid[];
}
export interface FetchAuctionBidErrorAction {
  type: typeof FETCH_AUCTION_BID_ERR;
  payload: string;
}

export interface FetchChatMessageAction {
  type: typeof FETCH_CHAT_MESSAGE;
  payload: number;
}
export interface FetchChatMessageSuccessAction {
  type: typeof FETCH_CHAT_MESSAGE_SUCCESS;
  payload: ChatMessageModel[];
}
export interface FetchChatMessageErrorAction {
  type: typeof FETCH_CHAT_MESSAGE_ERR;
  payload: string;
}

export interface BidToAuctionAction {
  type: typeof BID_TO_AUCTION;
  payload: BidToAuctionParams;
}
export interface BidToAuctionSuccessAction {
  type: typeof BID_TO_AUCTION_SUCCESS;
}
export interface BidToAuctionErrorAction {
  type: typeof BID_TO_AUCTION_ERR;
  payload: string;
}

export interface CreateAutoBidAction {
  type: typeof CREATE_AUTO_BID;
  payload: CreateAutoBidParams;
}
export interface CreateAutoBidSuccessAction {
  type: typeof CREATE_AUTO_BID_SUCCESS;
}
export interface CreateAutoBidErrorAction {
  type: typeof CREATE_AUTO_BID_ERR;
  payload: string;
}
export interface CreateChatMessageAction {
  type: typeof CREATE_CHAT_MESSAGE;
  payload: CreateChatMessageParams;
}
export interface CreateChatMessageSuccessAction {
  type: typeof CREATE_CHAT_MESSAGE_SUCCESS;
}
export interface CreateChatMessageErrorAction {
  type: typeof CREATE_CHAT_MESSAGE_ERR;
  payload: string;
}
export interface DeleteAutoBidAction {
  type: typeof DELETE_AUTO_BID;
  payload: deleteAutoBidParams;
}
export interface DeleteAutoBidSuccessAction {
  type: typeof DELETE_AUTO_BID_SUCCESS;
}
export interface DeleteAutoBidErrorAction {
  type: typeof DELETE_AUTO_BID_ERR;
  payload: string;
}
export interface FetchAutoBidAction {
  type: typeof FETCH_AUTO_BID;
  payload: FetchAutoBidParams;
}
export interface FetchAutoBidSuccessAction {
  type: typeof FETCH_AUTO_BID_SUCCESS;
  payload: AutoBid;
}
export interface FetchAutoBidErrorAction {
  type: typeof FETCH_AUTO_BID_ERR;
  payload: string;
}

export interface AuctionIsAcceptedAction {
  type: typeof FETCH_AUCTION_ISACCEPTED;
  payload: AuctionIsAcceptedParams;
}
export interface AuctionIsAcceptedSuccessAction {
  type: typeof FETCH_AUCTION_ISACCEPTED_SUCCESS;
}
export interface AuctionIsAcceptednErrorAction {
  type: typeof FETCH_AUCTION_ISACCEPTED_ERR;
  payload: string;
}
export interface InActiveAuctionAction {
  type: typeof FETCH_INACTIVE_AUCTION;
  payload: InActiveAuctionParams;
}
export interface InActiveAuctionSuccessAction {
  type: typeof FETCH_INACTIVE_AUCTION_SUCCESS;
}
export interface InActiveAuctionErrorAction {
  type: typeof FETCH_INACTIVE_AUCTION_ERR;
  payload: string;
}
export interface ListAuctionAction {
  type: typeof FETCH_LIST_AUCTION;
  payload: ListAuctionParams;
}
export interface ListAuctionSuccessAction {
  type: typeof FETCH_LIST_AUCTION_SUCCESS;
  payload: { auctionList: AuctionRequest1[]; allRecords: number };
}
export interface ListAuctionErrorAction {
  type: typeof FETCH_LIST_AUCTION_ERR;
  payload: string;
}
export interface ListStatusAuctionAction {
  type: typeof FETCH_LIST_STATUS_AUCTION;
}
export interface ListStatusAuctionSuccessAction {
  type: typeof FETCH_LIST_STATUS_AUCTION_SUCCESS;
  payload: StatusAdminListModel;
}
export interface ListStatusAuctionErrorAction {
  type: typeof FETCH_LIST_STATUS_AUCTION_ERR;
  payload: string;
}

export interface ListAuctionAdminAction {
  type: typeof FETCH_LIST_AUCTION_ADMIN;
  payload: ListAuctionAdminParams;
}
export interface ListAuctionAdminSuccessAction {
  type: typeof FETCH_LIST_AUCTION_ADMIN_SUCCESS;
  payload: { auctionListAdmin: Auction[]; allRecords: number };
}
export interface ListAuctionAdminErrorAction {
  type: typeof FETCH_LIST_AUCTION_ADMIN_ERR;
  payload: string;
}

export interface AddChatMessageAction {
  type: typeof ADD_CHAT_MESSAGE;
  payload: ChatMessageModel;
}

export type AuctionActionTypes =
  | RequestAnAuctionAction
  | RequestAnAuctionSuccessAction
  | RequestAnAuctionErrorAction
  | FetchCategoryAction
  | FetchCategorySuccessAction
  | FetchCategoryErrorAction
  | FetchMyAuctionsAction
  | FetchMyAuctionsSuccessAction
  | FetchMyAuctionsErrorAction
  | FetchAuctionDetailAction
  | FetchAuctionDetailSuccessAction
  | FetchAuctionDetailErrorAction
  | FetchStatusAction
  | FetchStatusSuccessAction
  | FetchStatusErrorAction
  | FetchAuctionBidAction
  | FetchAuctionBidSuccessAction
  | FetchAuctionBidErrorAction
  | BidToAuctionAction
  | BidToAuctionSuccessAction
  | BidToAuctionErrorAction
  | CreateAutoBidAction
  | CreateAutoBidSuccessAction
  | CreateAutoBidErrorAction
  | CreateChatMessageAction
  | CreateChatMessageSuccessAction
  | CreateChatMessageErrorAction
  | AddChatMessageAction
  | DeleteAutoBidAction
  | DeleteAutoBidSuccessAction
  | DeleteAutoBidErrorAction
  | FetchAutoBidAction
  | FetchAutoBidSuccessAction
  | FetchAutoBidErrorAction
  | FetchChatMessageAction
  | FetchChatMessageSuccessAction
  | FetchChatMessageErrorAction
  | AuctionIsAcceptedAction
  | AuctionIsAcceptedSuccessAction
  | AuctionIsAcceptednErrorAction
  | ListAuctionAction
  | ListAuctionSuccessAction
  | ListAuctionErrorAction
  | ListAuctionAdminAction
  | ListAuctionAdminSuccessAction
  | ListAuctionAdminErrorAction
  | InActiveAuctionAction
  | InActiveAuctionSuccessAction
  | InActiveAuctionErrorAction
  | ListStatusAuctionAction
  | ListStatusAuctionSuccessAction
  | ListStatusAuctionErrorAction

  | CreateAuctionReviewAction
  | CreateAuctionReviewSuccessAction
  | CreateAuctionReviewErrorAction

  | FetchAuctionReviewAction
  | FetchAuctionReviewSuccessAction
  | FetchAuctionReviewErrorAction

  | FetchAuctionInvitationAction
  | FetchAuctionInvitationSuccessAction
  | FetchAuctionInvitationErrorAction

  | FetchWinnerListAction
  | FetchWinnerListSuccessAction
  | FetchWinnerListErrorAction
  
  | FetchBiddedListAction
  | FetchBiddedListSuccessAction
  | FetchBiddedListErrorAction

  | FetchDisputeListAction
  | FetchDisputeListSuccessAction
  | FetchDisputeListErrorAction

  | FetchDisputeDetailAction
  | FetchDisputeDetailSuccessAction
  | FetchDisputeDetailErrorAction