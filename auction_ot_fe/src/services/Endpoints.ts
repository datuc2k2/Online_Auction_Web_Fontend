import { EndpointError } from "./errors/Endpoints";

// authen
// export const API_ENDPOINT_LOGIN = '/api/Home/loginWeb';
export const API_ENDPOINT_FORGOT_PASSWORD = '/api/forgot-password';
export const API_ENDPOINT_LOGOUT = '/api/logout';
export const API_ENDPOINT_MY_INFO = '/api/User/accountInformation';
export const API_CHANGE_PASSWORD = '/api/User/changePassword';
export const API_UPDATE_ACCOUNT_INFORMATION = '/api/User/updateMyInfomation';


//Auth
export const API_ENDPOINT_LOGIN = '/api/Auth/Login';
export const API_ENDPOINT_REGISTER = '/api/Auth/Register';
export const API_ENDPOINT_VERIFY = '/api/Auth/confirm';
export const API_CHANGE_MY_PASSWORD = '/api/Auth/changePassword';


//account
export const API_ENDPOINT_FETCH_LIST_ACCOUNT = '/api/Account/GetAccounts';
export const API_ENDPOINT_FETCH_LIST_ACCOUNT_INVITE = '/api/Account/GetAccountInvites';
export const API_ENDPOINT_FETCH_ACCOUNT_DETAILS_MANAGERMENT =
  "/api/AccountDetails";

//profile
export const API_ENDPOINT_FETCH_MYINFO = '/api/PersonalAccount/GetProfile';
export const API_ENDPOINT_UPDATE_PROFILE = '/api/PersonalAccount/EditProfile';

export const API_ENDPOINT_RESET_PASSWORD = '/api/Auth/resetPassword';
export const API_ENDPOINT_CONFIRM_RESET_PASSWORD = '/api/Auth/confirmResetPassword';
export const API_ENDPOINT_CREATE_NEW_PASSWORD = '/api/Auth/createNewPassword';

//Auction
export const API_ENDPOINT_REQUEST_AN_AUCTION = '/api/Auction/requestCreateAuction';
export const API_ENDPOINT_FETCH_CATEGORY = '/api/Auction/getAuctionCategory';
export const API_ENDPOINT_FETCH_STATUS_AUCTION = "/api/ListAuction/GetStatus";
export const API_ENDPOINT_FETCH_MY_AUCTIONS = "/api/ListAuction/ListMyAuction";
export const API_ENDPOINT_FETCH_AUCTION_DETAIL =
  "/api/Auction/getAuctionDetails";
export const API_ENDPOINT_FETCH_AUCTION_FILTER =   "/api/ListAuction/GetList";

export const API_ENDPOINT_FETCH_STATUS = "/api/ListAuction/GetStatus";
export const API_ENDPOINT_FETCH_AUCTION_REVIEW = "/api/JoinTheAuction/getAllAuctionReviewByAuctionId";
export const API_ENDPOINT_FETCH_AUCTION_INVITATION = "/api/JoinTheAuction/getAllAuctionInvitationByAuctionId";
export const API_ENDPOINT_CREATE_AUCTION_REVIEW = "/api/JoinTheAuction/createAuctionReview";
export const API_ENDPOINT_FETCH_AUCTION_BID =
  "/api/JoinTheAuction/getAllAuctionBidByAuctionId";
export const API_ENDPOINT_BID_TO_AUCTION = "/api/JoinTheAuction/bidToAuction";
export const API_ENDPOINT_CREATE_CHAT_MESSAGE =
  "/api/JoinTheAuction/createChatMessage";
export const API_ENDPOINT_FETCH_CHAT_MESSAGE =
  "/api/JoinTheAuction/getAllChatMessageByAuctionId";
export const API_ENDPOINT_FETCH_LIST_AUCTION = "/api/AuctionRequest/List";
export const API_ENDPOINT_FETCH_LIST_AUCTION_ADMIN =
  "/api/ListAuction/ListAuctionAdmin";
export const API_ENDPOINT_AUCTION_ISACCEPTED = "/api/AuctionRequest/IsAccepted";
export const API_ENDPOINT_INACTIVE_AUCTION = "/api/ListAuction/InactiveAuction";

export const API_ENDPOINT_CREATE_AUTO_BID = '/api/JoinTheAuction/createAutoBid';
export const API_ENDPOINT_DELETE_AUTO_BID = '/api/JoinTheAuction/deleteAutoBid';
export const API_ENDPOINT_FETCH_AUTO_BID = '/api/JoinTheAuction/getAutoBid';

export const API_ENDPOINT_FETCH_WINNER_LIST = '/api/PaymentConfirmation/ListWinnedAuc';
export const API_ENDPOINT_FETCH_BIDDED_LIST = '/api/PaymentConfirmation/ListBiddedAuc';
export const API_ENDPOINT_FETCH_DISPUTE_LIST = '/api/PaymentConfirmation/ListDispute';
export const API_ENDPOINT_FETCH_DISPUTE_DETAIL = '/api/PaymentConfirmation/DisputeDetail';

//Payment
export const API_ENDPOINT_ADD_PAYMENT = '/api/Payment/AddPayment';
export const API_ENDPOINT_FETCH_LIST_PAYMENT = '/api/Payment/List';

export const prepare = (
  endpoint: string,
  params: { [key: string]: string | number } = {},
  query: { [key: string]: string | number | boolean | string[] | undefined | null } = {},
) => {
  let preparedEndpoint = endpoint;
  Object.keys(params).forEach((param) => {
    const paramPlaceholder = `{${param}}`;
    if (preparedEndpoint.includes(paramPlaceholder)) {
      let paramValue = params[param];
      if (typeof paramValue === 'number') {
        paramValue = paramValue.toString();
      }
      preparedEndpoint = preparedEndpoint.replace(paramPlaceholder, paramValue);
    } else {
      throw new EndpointError('Invalid parameter.');
    }
  });
  let preparedQueryString = '?';
  const queryKeys = Object.keys(query);
  queryKeys.forEach((queryKey, index) => {
    if (index !== 0) {
      preparedQueryString += '&';
    }
    const queryValue = query[queryKey];
    if (Array.isArray(queryValue)) {
      queryValue.forEach((queryValueItem, itemIndex) => {
        if (itemIndex !== 0) {
          preparedQueryString += '&';
        }
        preparedQueryString += `${queryKey}[]=${queryValueItem}`;
      });
    } else {
      if(queryValue !== undefined && queryValue !== null) {
        preparedQueryString += `${queryKey}=${queryValue}`;
      } 
    }
  });
  return encodeURI(
    preparedEndpoint + (queryKeys.length === 0 ? '' : preparedQueryString),
  );
};

