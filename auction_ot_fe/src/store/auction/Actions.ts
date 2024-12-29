import {
  ADD_CHAT_MESSAGE,
  Auction,
  Auction1,
  AuctionActionTypes,
  AuctionDetailModel,
  AuctionInvitation,
  AuctionIsAcceptedParams,
  AuctionRequest1,
  AuctionReview,
  AutoBid,
  Bid,
  BID_TO_AUCTION,
  BID_TO_AUCTION_ERR,
  BID_TO_AUCTION_SUCCESS,
  BiddedListModel,
  BidToAuctionParams,
  CategoryModel,
  ChatMessageModel,
  CREATE_AUCTION_REVIEW,
  CREATE_AUCTION_REVIEW_ERR,
  CREATE_AUCTION_REVIEW_SUCCESS,
  CREATE_AUTO_BID,
  CREATE_AUTO_BID_ERR,
  CREATE_AUTO_BID_SUCCESS,
  CREATE_CHAT_MESSAGE,
  CREATE_CHAT_MESSAGE_ERR,
  CREATE_CHAT_MESSAGE_SUCCESS,
  CreateAuctionReviewParams,
  CreateAutoBidParams,
  CreateChatMessageParams,
  DELETE_AUTO_BID,
  DELETE_AUTO_BID_ERR,
  DELETE_AUTO_BID_SUCCESS,
  deleteAutoBidParams,
  DisputeAuctionDetailModel,
  DisputeListModel,
  FETCH_AUCTION_BID,
  FETCH_AUCTION_BID_ERR,
  FETCH_AUCTION_BID_SUCCESS,
  FETCH_AUCTION_DETAIL,
  FETCH_AUCTION_DETAIL_ERR,
  FETCH_AUCTION_DETAIL_SUCCESS,
  FETCH_AUCTION_INVITATION,
  FETCH_AUCTION_INVITATION_ERR,
  FETCH_AUCTION_INVITATION_SUCCESS,
  FETCH_AUCTION_ISACCEPTED,
  FETCH_AUCTION_ISACCEPTED_ERR,
  FETCH_AUCTION_ISACCEPTED_SUCCESS,
  FETCH_AUCTION_REVIEW,
  FETCH_AUCTION_REVIEW_ERR,
  FETCH_AUCTION_REVIEW_SUCCESS,
  FETCH_AUTO_BID,
  FETCH_AUTO_BID_ERR,
  FETCH_AUTO_BID_SUCCESS,
  FETCH_BIDDED_LIST,
  FETCH_BIDDED_LIST_ERR,
  FETCH_BIDDED_LIST_SUCCESS,
  FETCH_CATEGORY,
  FETCH_CATEGORY_ERR,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CHAT_MESSAGE,
  FETCH_CHAT_MESSAGE_ERR,
  FETCH_CHAT_MESSAGE_SUCCESS,
  FETCH_DISPUTE_DETAIL,
  FETCH_DISPUTE_DETAIL_ERR,
  FETCH_DISPUTE_DETAIL_SUCCESS,
  FETCH_DISPUTE_LIST,
  FETCH_DISPUTE_LIST_ERR,
  FETCH_DISPUTE_LIST_SUCCESS,
  FETCH_INACTIVE_AUCTION,
  FETCH_INACTIVE_AUCTION_ERR,
  FETCH_INACTIVE_AUCTION_SUCCESS,
  FETCH_LIST_AUCTION,
  FETCH_LIST_AUCTION_ADMIN,
  FETCH_LIST_AUCTION_ADMIN_ERR,
  FETCH_LIST_AUCTION_ADMIN_SUCCESS,
  FETCH_LIST_AUCTION_ERR,
  FETCH_LIST_AUCTION_SUCCESS,
  FETCH_LIST_STATUS_AUCTION,
  FETCH_LIST_STATUS_AUCTION_ERR,
  FETCH_LIST_STATUS_AUCTION_SUCCESS,
  FETCH_MY_AUCTIONS,
  FETCH_MY_AUCTIONS_ERR,
  FETCH_MY_AUCTIONS_SUCCESS,
  FETCH_STATUS,
  FETCH_STATUS_ERR,
  FETCH_STATUS_SUCCESS,
  FETCH_WINNER_LIST,
  FETCH_WINNER_LIST_ERR,
  FETCH_WINNER_LIST_SUCCESS,
  FetchAutoBidParams,
  FetchMyAuctionsModel,
  GetStatus,
  GetStatusModel,
  InActiveAuctionParams,
  ListAuctionAdminParams,
  ListAuctionParams,
  MyAuctionsParams,
  REQUEST_AN_AUCTION,
  REQUEST_AN_AUCTION_ERR,
  REQUEST_AN_AUCTION_SUCCESS,
  RequestAnAuctionModel,
  StatusAdminListModel,
  WinnerListModel,
  WinnerListParams,
} from "./Types";

export const createAuctionReview = (
  payload: CreateAuctionReviewParams
): AuctionActionTypes => {
  return {
    type: CREATE_AUCTION_REVIEW,
    payload,
  };
};

export const createAuctionReviewSuccess = (): AuctionActionTypes => {
  return {
    type: CREATE_AUCTION_REVIEW_SUCCESS,
  };
};

export const createAuctionReviewErr = (payload: string): AuctionActionTypes => {
  return {
    type: CREATE_AUCTION_REVIEW_ERR,
    payload,
  };
};

export const fetchAuctionReview = (payload: number): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_REVIEW,
    payload,
  };
};

export const fetchAuctionReviewSuccess = (payload: AuctionReview[]
): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_REVIEW_SUCCESS,
    payload,
  };
};

export const fetchAuctionReviewErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_REVIEW_ERR,
    payload,
  };
};

export const fetchAuctionInvitation = (payload: number): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_INVITATION,
    payload,
  };
};

export const fetchAuctionInvitationSuccess = (payload: AuctionInvitation[]
): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_INVITATION_SUCCESS,
    payload,
  };
};

export const fetchAuctionInvitationErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_INVITATION_ERR,
    payload,
  };
};

export const requestAnAuction = (
  payload: RequestAnAuctionModel
): AuctionActionTypes => {
  return {
    type: REQUEST_AN_AUCTION,
    payload,
  };
};

export const requestAnAuctionSuccess = (): AuctionActionTypes => {
  return {
    type: REQUEST_AN_AUCTION_SUCCESS,
  };
};

export const requestAnAuctionErr = (payload: string): AuctionActionTypes => {
  return {
    type: REQUEST_AN_AUCTION_ERR,
    payload,
  };
};

export const fetchCategory = (): AuctionActionTypes => {
  return {
    type: FETCH_CATEGORY,
  };
};

export const fetchCategorySuccess = (
  payload: CategoryModel
): AuctionActionTypes => {
  return {
    type: FETCH_CATEGORY_SUCCESS,
    payload,
  };
};

export const fetchCategoryErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_CATEGORY_ERR,
    payload,
  };
};

export const fetchMyAutions = (
  payload: MyAuctionsParams
): AuctionActionTypes => {
  return {
    type: FETCH_MY_AUCTIONS,
    payload,
  };
};

export const fetchMyAutionsSuccess = (
  payload: FetchMyAuctionsModel
): AuctionActionTypes => {
  return {
    type: FETCH_MY_AUCTIONS_SUCCESS,
    payload,
  };
};

export const fetchMyAutionsErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_MY_AUCTIONS_ERR,
    payload,
  };
};

export const fetchAuctionDetail = (payload: number): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_DETAIL,
    payload,
  };
};

export const fetchAuctionDetailSuccess = (
  payload: AuctionDetailModel
): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_DETAIL_SUCCESS,
    payload,
  };
};

export const fetchAuctionDetailErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_DETAIL_ERR,
    payload,
  };
};

export const fetchStatus = (): AuctionActionTypes => {
  return {
    type: FETCH_STATUS,
  };
};

export const fetchStatusSuccess = (
  payload: GetStatusModel
): AuctionActionTypes => {
  return {
    type: FETCH_STATUS_SUCCESS,
    payload,
  };
};

export const fetchStatusErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_STATUS_ERR,
    payload,
  };
};

export const fetchAuctionBid = (payload: number): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_BID,
    payload,
  };
};

export const fetchAuctionBidSuccess = (payload: Bid[]): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_BID_SUCCESS,
    payload,
  };
};

export const fetchAuctionBidErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_BID_ERR,
    payload,
  };
};

export const fetchChatMessage = (payload: number): AuctionActionTypes => {
  return {
    type: FETCH_CHAT_MESSAGE,
    payload,
  };
};

export const fetchChatMessageSuccess = (
  payload: ChatMessageModel[]
): AuctionActionTypes => {
  return {
    type: FETCH_CHAT_MESSAGE_SUCCESS,
    payload,
  };
};

export const fetchChatMessageErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_CHAT_MESSAGE_ERR,
    payload,
  };
};

export const bidToAuction = (
  payload: BidToAuctionParams
): AuctionActionTypes => {
  return {
    type: BID_TO_AUCTION,
    payload,
  };
};

export const bidToAuctionSuccess = (): AuctionActionTypes => {
  return {
    type: BID_TO_AUCTION_SUCCESS,
  };
};

export const bidToAuctionErr = (payload: string): AuctionActionTypes => {
  return {
    type: BID_TO_AUCTION_ERR,
    payload,
  };
};

export const createAutoBid = (
  payload: CreateAutoBidParams
): AuctionActionTypes => {
  return {
    type: CREATE_AUTO_BID,
    payload,
  };
};

export const createAutoBidSuccess = (): AuctionActionTypes => {
  return {
    type: CREATE_AUTO_BID_SUCCESS,
  };
};

export const createAutoBidErr = (payload: string): AuctionActionTypes => {
  return {
    type: CREATE_AUTO_BID_ERR,
    payload,
  };
};

export const createChatMessage = (
  payload: CreateChatMessageParams
): AuctionActionTypes => {
  return {
    type: CREATE_CHAT_MESSAGE,
    payload,
  };
};

export const createChatMessageSuccess = (): AuctionActionTypes => {
  return {
    type: CREATE_CHAT_MESSAGE_SUCCESS,
  };
};

export const createChatMessageErr = (payload: string): AuctionActionTypes => {
  return {
    type: CREATE_CHAT_MESSAGE_ERR,
    payload,
  };
};

export const addChatMessage = (
  payload: ChatMessageModel
): AuctionActionTypes => {
  return {
    type: ADD_CHAT_MESSAGE,
    payload,
  };
};

export const deleteAutoBid = (
  payload: deleteAutoBidParams
): AuctionActionTypes => {
  return {
    type: DELETE_AUTO_BID,
    payload,
  };
};

export const deleteAutoBidSuccess = (): AuctionActionTypes => {
  return {
    type: DELETE_AUTO_BID_SUCCESS,
  };
};

export const deleteAutoBidErr = (payload: string): AuctionActionTypes => {
  return {
    type: DELETE_AUTO_BID_ERR,
    payload,
  };
};

export const fetchAutoBid = (
  payload: FetchAutoBidParams
): AuctionActionTypes => {
  return {
    type: FETCH_AUTO_BID,
    payload,
  };
};

export const fetchAutoBidSuccess = (payload: AutoBid): AuctionActionTypes => {
  return {
    type: FETCH_AUTO_BID_SUCCESS,
    payload,
  };
};

export const fetchAutoBidErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_AUTO_BID_ERR,
    payload,
  };
};

export const auctionIsAccepted = (
  payload: AuctionIsAcceptedParams
): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_ISACCEPTED,
    payload,
  };
};

export const auctionIsAcceptedSuccess = (): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_ISACCEPTED_SUCCESS,
  };
};

export const auctionIsAcceptedErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_AUCTION_ISACCEPTED_ERR,
    payload,
  };
};

export const inActiveAuction = (
  payload: InActiveAuctionParams
): AuctionActionTypes => {
  return {
    type: FETCH_INACTIVE_AUCTION,
    payload,
  };
};

export const inActiveAuctionSuccess = (): AuctionActionTypes => {
  return {
    type: FETCH_INACTIVE_AUCTION_SUCCESS,
  };
};

export const inActiveAuctionErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_INACTIVE_AUCTION_ERR,
    payload,
  };
};

export const fetchListAuction = (
  payload: ListAuctionParams
): AuctionActionTypes => {
  return {
    type: FETCH_LIST_AUCTION,
    payload,
  };
};
export const fetchListAuctionSuccess = (payload: {
  auctionList: AuctionRequest1[];
  allRecords: number;
}): AuctionActionTypes => {
  return {
    type: FETCH_LIST_AUCTION_SUCCESS,
    payload,
  };
};

export const fetchListAuctionErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_LIST_AUCTION_ERR,
    payload,
  };
};

export const fetchWinnerList = (
  payload: WinnerListParams
): AuctionActionTypes => {
  return {
    type: FETCH_WINNER_LIST,
    payload,
  };
};
export const fetchWinnerListSuccess = (payload: WinnerListModel): AuctionActionTypes => {
  return {
    type: FETCH_WINNER_LIST_SUCCESS,
    payload,
  };
};

export const fetchWinnerListErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_WINNER_LIST_ERR,
    payload,
  };
};

export const fetchBiddedList = (
  payload: WinnerListParams
): AuctionActionTypes => {
  return {
    type: FETCH_BIDDED_LIST,
    payload,
  };
};
export const fetchBiddedListSuccess = (payload: BiddedListModel): AuctionActionTypes => {
  return {
    type: FETCH_BIDDED_LIST_SUCCESS,
    payload,
  };
};

export const fetchBiddedListErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_BIDDED_LIST_ERR,
    payload,
  };
};

export const fetchDisputeList = (
  payload: WinnerListParams
): AuctionActionTypes => {
  return {
    type: FETCH_DISPUTE_LIST,
    payload,
  };
};
export const fetchDisputeListSuccess = (payload: DisputeListModel): AuctionActionTypes => {
  return {
    type: FETCH_DISPUTE_LIST_SUCCESS,
    payload,
  };
};

export const fetchDisputeListErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_DISPUTE_LIST_ERR,
    payload,
  };
};

export const fetchDisputeDetail = (
  payload: number
): AuctionActionTypes => {
  return {
    type: FETCH_DISPUTE_DETAIL,
    payload,
  };
};
export const fetchDisputeDetailSuccess = (payload: DisputeAuctionDetailModel): AuctionActionTypes => {
  return {
    type: FETCH_DISPUTE_DETAIL_SUCCESS,
    payload,
  };
};

export const fetchDisputeDetailErr = (payload: string): AuctionActionTypes => {
  return {
    type: FETCH_DISPUTE_DETAIL_ERR,
    payload,
  };
};

export const fetchListAuctionAdmin = (
  payload: ListAuctionAdminParams
): AuctionActionTypes => {
  return {
    type: FETCH_LIST_AUCTION_ADMIN,
    payload,
  };
};
export const fetchListAuctionAdminSuccess = (payload: {
  auctionListAdmin: Auction[];
  allRecords: number;
}): AuctionActionTypes => {
  return {
    type: FETCH_LIST_AUCTION_ADMIN_SUCCESS,
    payload,
  };
};

export const fetchListAuctionAdminErr = (
  payload: string
): AuctionActionTypes => {
  return {
    type: FETCH_LIST_AUCTION_ADMIN_ERR,
    payload,
  };
};
export const fetchListStatusAuction = (): AuctionActionTypes => {
  return {
    type: FETCH_LIST_STATUS_AUCTION,
  };
};

export const fetchListStatusAuctionSuccess = (
  payload: StatusAdminListModel
): AuctionActionTypes => {
  return {
    type: FETCH_LIST_STATUS_AUCTION_SUCCESS,
    payload,
  };
};

export const fetchListStatusAuctionErr = (
  payload: string
): AuctionActionTypes => {
  return {
    type: FETCH_LIST_STATUS_AUCTION_ERR,
    payload,
  };
};
