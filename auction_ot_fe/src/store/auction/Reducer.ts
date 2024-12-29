import { WithLogoutAction } from "@/types/Global";
import {
  ADD_CHAT_MESSAGE,
  AuctionActionTypes,
  AuctionState,
  BID_TO_AUCTION,
  BID_TO_AUCTION_ERR,
  BID_TO_AUCTION_SUCCESS,
  CREATE_AUCTION_REVIEW,
  CREATE_AUCTION_REVIEW_ERR,
  CREATE_AUCTION_REVIEW_SUCCESS,
  CREATE_AUTO_BID,
  CREATE_AUTO_BID_ERR,
  CREATE_AUTO_BID_SUCCESS,
  CREATE_CHAT_MESSAGE,
  CREATE_CHAT_MESSAGE_ERR,
  CREATE_CHAT_MESSAGE_SUCCESS,
  DELETE_AUTO_BID,
  DELETE_AUTO_BID_ERR,
  DELETE_AUTO_BID_SUCCESS,
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
  REQUEST_AN_AUCTION,
  REQUEST_AN_AUCTION_ERR,
  REQUEST_AN_AUCTION_SUCCESS,
} from "./Types";

const initialState: AuctionState = {};

const auctionReducer = (
  state = initialState,
  action: WithLogoutAction<AuctionActionTypes>
): AuctionState => {
  switch (action.type) {
    case CREATE_AUCTION_REVIEW:
      return {
        ...state,
        loading: true,
      };
    case CREATE_AUCTION_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_AUCTION_REVIEW_ERR:
      return {
        ...state,
        loading: false,
      };

    case FETCH_AUCTION_REVIEW:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionReviewList: action.payload,
      };
    case FETCH_AUCTION_REVIEW_ERR:
      return {
        ...state,
        loading: false,
      };

    case FETCH_AUCTION_INVITATION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_INVITATION_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionInvitationList: action.payload,
      };
    case FETCH_AUCTION_INVITATION_ERR:
      return {
        ...state,
        loading: false,
      };

    case REQUEST_AN_AUCTION:
      return {
        ...state,
        loading: true,
      };
    case REQUEST_AN_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case REQUEST_AN_AUCTION_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_CATEGORY:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryData: action.payload,
      };
    case FETCH_CATEGORY_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_LIST_STATUS_AUCTION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_LIST_STATUS_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionStatusList: action.payload,
      };
    case FETCH_LIST_STATUS_AUCTION_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_MY_AUCTIONS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MY_AUCTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        myAuctions: action.payload,
      };
    case FETCH_MY_AUCTIONS_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_AUCTION_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionDetailForEdit: action.payload,
      };
    case FETCH_AUCTION_DETAIL_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_STATUS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionStatus: action.payload,
      };
    case FETCH_STATUS_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_AUCTION_BID:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_BID_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionBids: action.payload,
      };
    case FETCH_AUCTION_BID_ERR:
      return {
        ...state,
        loading: false,
      };
    case BID_TO_AUCTION:
      return {
        ...state,
        loading: true,
      };
    case BID_TO_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case BID_TO_AUCTION_ERR:
      return {
        ...state,
        loading: false,
      };
    case CREATE_AUTO_BID:
      return {
        ...state,
        loading: true,
      };
    case CREATE_AUTO_BID_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_AUTO_BID_ERR:
      return {
        ...state,
        loading: false,
      };
    case CREATE_CHAT_MESSAGE:
      return {
        ...state,
        loading: true,
      };
    case CREATE_CHAT_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_CHAT_MESSAGE_ERR:
      return {
        ...state,
        loading: false,
      };
    case ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), action.payload],
      };
    case DELETE_AUTO_BID:
      return {
        ...state,
        loading: true,
      };
    case DELETE_AUTO_BID_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case DELETE_AUTO_BID_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_AUTO_BID:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUTO_BID_SUCCESS:
      return {
        ...state,
        autoBid: action.payload,
        loading: false,
      };
    case FETCH_AUTO_BID_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_CHAT_MESSAGE:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CHAT_MESSAGE_SUCCESS:
      return {
        ...state,
        chatMessages: action.payload,
        loading: false,
      };
    case FETCH_CHAT_MESSAGE_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_AUCTION_ISACCEPTED:
      return {
        ...state,
        loading: true,
      };
    case FETCH_AUCTION_ISACCEPTED_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case FETCH_AUCTION_ISACCEPTED_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_INACTIVE_AUCTION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_INACTIVE_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case FETCH_INACTIVE_AUCTION_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_LIST_AUCTION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_LIST_AUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionList: action.payload,
      };

    case FETCH_LIST_AUCTION_ERR:
      return {
        ...state,
        loading: false,
      };
    case FETCH_LIST_AUCTION_ADMIN:
      return {
        ...state,
        loading: true,
      };
    case FETCH_LIST_AUCTION_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        auctionListAdmin: action.payload,
      };

    case FETCH_LIST_AUCTION_ADMIN_ERR:
      return {
        ...state,
        loading: false,
      };

    case FETCH_WINNER_LIST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_WINNER_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        winnerList: action.payload,
      };

    case FETCH_WINNER_LIST_ERR:
      return {
        ...state,
        loading: false,
      };

    case FETCH_BIDDED_LIST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_BIDDED_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        biddedList: action.payload,
      };

    case FETCH_BIDDED_LIST_ERR:
      return {
        ...state,
        loading: false,
      };

    case FETCH_DISPUTE_LIST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DISPUTE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        disputeList: action.payload,
      };

    case FETCH_DISPUTE_LIST_ERR:
      return {
        ...state,
        loading: false,
      };

    case FETCH_DISPUTE_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DISPUTE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        disputeDetail: action.payload,
      };

    case FETCH_DISPUTE_DETAIL_ERR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default auctionReducer;
