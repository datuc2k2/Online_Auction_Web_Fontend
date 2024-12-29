import { notifyErrorFromApiCommon, openNotification } from "@/utility/Utility";
import {
  apiCall,
  apiDeleteCall,
  apiGetCall,
  apiGetCallNoToken,
  apiPostCall,
  apiPostCallAuthen,
  apiPutCall,
  ApiResponse,
} from "../saga-effects/api";
import {
  AuctionIsAcceptedAction,
  BID_TO_AUCTION,
  BidToAuctionAction,
  CREATE_AUCTION_REVIEW,
  CREATE_AUTO_BID,
  CREATE_CHAT_MESSAGE,
  CreateAuctionReviewAction,
  CreateAutoBidAction,
  CreateChatMessageAction,
  DELETE_AUTO_BID,
  DeleteAutoBidAction,
  FETCH_AUCTION_BID,
  FETCH_AUCTION_DETAIL,
  FETCH_AUCTION_INVITATION,
  FETCH_AUCTION_ISACCEPTED,
  FETCH_AUCTION_REVIEW,
  FETCH_AUTO_BID,
  FETCH_BIDDED_LIST,
  FETCH_CATEGORY,
  FETCH_CHAT_MESSAGE,
  FETCH_DISPUTE_DETAIL,
  FETCH_DISPUTE_LIST,
  FETCH_INACTIVE_AUCTION,
  FETCH_LIST_AUCTION,
  FETCH_LIST_AUCTION_ADMIN,
  FETCH_LIST_STATUS_AUCTION,
  FETCH_MY_AUCTIONS,
  FETCH_STATUS,
  FETCH_WINNER_LIST,
  FetchAuctionBidAction,
  FetchAuctionDetailAction,
  FetchAuctionInvitationAction,
  FetchAuctionReviewAction,
  FetchAutoBidAction,
  FetchBiddedListAction,
  FetchCategoryAction,
  FetchChatMessageAction,
  FetchDisputeDetailAction,
  FetchDisputeListAction,
  FetchMyAuctionsAction,
  FetchStatusAction,
  FetchWinnerListAction,
  ListAuctionAction,
  ListAuctionAdminAction,
  ListStatusAuctionAction,
  REQUEST_AN_AUCTION,
  RequestAnAuctionAction,
} from "./Types";
import {
  auctionIsAcceptedErr,
  bidToAuctionErr,
  createAuctionReviewErr,
  createAuctionReviewSuccess,
  createAutoBidErr,
  createAutoBidSuccess,
  createChatMessageErr,
  createChatMessageSuccess,
  deleteAutoBidErr,
  deleteAutoBidSuccess,
  fetchAuctionBidErr,
  fetchAuctionBidSuccess,
  fetchAuctionDetailErr,
  fetchAuctionDetailSuccess,
  fetchAuctionInvitationErr,
  fetchAuctionInvitationSuccess,
  fetchAuctionReview,
  fetchAuctionReviewErr,
  fetchAuctionReviewSuccess,
  fetchAutoBidErr,
  fetchAutoBidSuccess,
  fetchBiddedListErr,
  fetchBiddedListSuccess,
  fetchCategoryErr,
  fetchCategorySuccess,
  fetchChatMessageErr,
  fetchChatMessageSuccess,
  fetchDisputeDetailErr,
  fetchDisputeDetailSuccess,
  fetchDisputeListErr,
  fetchDisputeListSuccess,
  fetchListAuctionAdminErr,
  fetchListAuctionAdminSuccess,
  fetchListAuctionErr,
  fetchListAuctionSuccess,
  fetchListStatusAuctionErr,
  fetchListStatusAuctionSuccess,
  fetchMyAutionsErr,
  fetchMyAutionsSuccess,
  fetchStatusErr,
  fetchStatusSuccess,
  fetchWinnerListErr,
  fetchWinnerListSuccess,
  requestAnAuctionErr,
} from "./Actions";
import { put, takeEvery } from "redux-saga/effects";
import {
  API_ENDPOINT_AUCTION_ISACCEPTED,
  API_ENDPOINT_BID_TO_AUCTION,
  API_ENDPOINT_CREATE_AUCTION_REVIEW,
  API_ENDPOINT_CREATE_AUTO_BID,
  API_ENDPOINT_CREATE_CHAT_MESSAGE,
  API_ENDPOINT_DELETE_AUTO_BID,
  API_ENDPOINT_FETCH_AUCTION_BID,
  API_ENDPOINT_FETCH_AUCTION_DETAIL,
  API_ENDPOINT_FETCH_AUCTION_INVITATION,
  API_ENDPOINT_FETCH_AUCTION_REVIEW,
  API_ENDPOINT_FETCH_AUTO_BID,
  API_ENDPOINT_FETCH_BIDDED_LIST,
  API_ENDPOINT_FETCH_CATEGORY,
  API_ENDPOINT_FETCH_CHAT_MESSAGE,
  API_ENDPOINT_FETCH_DISPUTE_DETAIL,
  API_ENDPOINT_FETCH_DISPUTE_LIST,
  API_ENDPOINT_FETCH_LIST_AUCTION,
  API_ENDPOINT_FETCH_LIST_AUCTION_ADMIN,
  API_ENDPOINT_FETCH_MY_AUCTIONS,
  API_ENDPOINT_FETCH_STATUS,
  API_ENDPOINT_FETCH_STATUS_AUCTION,
  API_ENDPOINT_FETCH_WINNER_LIST,
  API_ENDPOINT_INACTIVE_AUCTION,
  API_ENDPOINT_REQUEST_AN_AUCTION,
  prepare,
} from "@/services/Endpoints";
import { fetchMyInfo, minusPointMyInfo } from "../auth/Actions";

function* requestAnAuctionSaga(action: RequestAnAuctionAction) {
  try {
    console.log("vaoffff");

    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_REQUEST_AN_AUCTION,
      {
        Auction: {
          UserID: action.payload.userID,
          ProductName: action.payload.productName,
          CategoryId: action.payload.categoryId,
          IsPrivate: action.payload.isPrivate,
          Mode: action.payload.mode,
          Currency: action.payload.currency,
          StartingPrice: action.payload.startTime,
          StepPrice: action.payload.stepPrice,
          DepositAmount: action.payload.depositAmount,
          StartTime: action.payload.startTime,
          EndTime: action.payload.endTime,
        },
        Images: [...action.payload.images],
      }
    );
    console.log("response: ", response);

    if (response.data.resultCd === 1) {
      openNotification(
        "success",
        "Thành công",
        "Tạo yêu cầu phiên đấu giá thành công"
      );
    } else {
      yield put(requestAnAuctionErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* bidToAuctionSaga(action: BidToAuctionAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_BID_TO_AUCTION +
      `?AuctionId=${action.payload.AuctionId}&BidAmount=${action.payload.BidAmount}&DepositeAmount=${action.payload.DepositeAmount}`,
      {}
    );
    if (response) {
      if (response.data === "Bid first time successfully") {
        openNotification("success", "Thành công", "Đấu giá thành công");
        action.payload.callback();
      }
      if (action.payload.IsFetchMyInfo) {
        yield put(minusPointMyInfo(action.payload.UpdatePoint));
      }
    } else {
      yield put(bidToAuctionErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* createChatMessageSaga(action: CreateChatMessageAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_CREATE_CHAT_MESSAGE +
      `?AuctionId=${action.payload.AuctionId}&Message=${action.payload.Message}&SenderId=${action.payload.SenderId}`,
      {}
    );

    if (response) {
      yield put(createChatMessageSuccess());
    } else {
      yield put(createChatMessageErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchCategorySaga(action: FetchCategoryAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(API_ENDPOINT_FETCH_CATEGORY, {}, {})
    );
    if (response.data.resultCd === 1) {
      yield put(
        fetchCategorySuccess({
          categories: response?.data?.categories?.$values,
          modes: response?.data?.modes?.$values,
        })
      );
    } else {
      yield put(fetchCategoryErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchCategoryErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchStatusAuctionSaga(action: ListStatusAuctionAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCall,
      prepare(API_ENDPOINT_FETCH_STATUS_AUCTION, {}, {})
    );
    if (response.data.resultCd === 1) {
      yield put(
        fetchListStatusAuctionSuccess({
          status: response.data.status.$values,
          paymentStatus: response.data.paymentStatus.$values,
        })
      );
    } else {
      yield put(fetchListStatusAuctionErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListStatusAuctionErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchAuctionDetailSaga(action: FetchAuctionDetailAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(
        API_ENDPOINT_FETCH_AUCTION_DETAIL,
        {},
        {
          aucId: action.payload,
        }
      )
    );
    if (response.data.resultCd === 1) {
      const objSet = {
        ...response.data.auction,
        createrProfile: {
          ...response.data.createrProfile
        },
        fee: response.data.fee
      }
      yield put(fetchAuctionDetailSuccess(objSet));
    } else {
      yield put(fetchAuctionDetailErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchAuctionDetailErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchAuctionBidSaga(action: FetchAuctionBidAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(API_ENDPOINT_FETCH_AUCTION_BID + `/${action.payload}`, {}, {})
    );
    if (response?.data?.$values) {
      yield put(fetchAuctionBidSuccess(response.data.$values));
    } else {
      yield put(fetchAuctionBidErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchAuctionBidErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchChatMessageSaga(action: FetchChatMessageAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(API_ENDPOINT_FETCH_CHAT_MESSAGE + `/${action.payload}`, {}, {})
    );
    if (response?.data?.$values) {
      yield put(fetchChatMessageSuccess(response.data.$values));
    } else {
      yield put(fetchChatMessageErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchChatMessageErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchStatusSaga(action: FetchStatusAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCall,
      prepare(API_ENDPOINT_FETCH_STATUS, {}, {})
    );
    if (response.data.resultCd === 1) {
      yield put(
        fetchStatusSuccess({
          status: response.data.status.$values,
          paymentStatus: response.data.paymentStatus.$values,
        })
      );
    } else {
      yield put(fetchStatusErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchStatusErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchAuctionReviewSaga(action: FetchAuctionReviewAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(API_ENDPOINT_FETCH_AUCTION_REVIEW + `/${action.payload}`, {}, {})
    );
    if (response) {
      yield put(
        fetchAuctionReviewSuccess(response.data.$values)
      );
    } else {
      yield put(fetchAuctionReviewErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchAuctionReviewErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchAuctionInvitationSaga(action: FetchAuctionInvitationAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(API_ENDPOINT_FETCH_AUCTION_INVITATION + `/${action.payload}`, {}, {})
    );
    if (response) {
      yield put(
        fetchAuctionInvitationSuccess(response.data.$values)
      );
    } else {
      yield put(fetchAuctionInvitationErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchAuctionInvitationErr(notifyErrorFromApiCommon(error)));
  }
}

function* createAuctionReviewSaga(action: CreateAuctionReviewAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_CREATE_AUCTION_REVIEW,
      { ...action.payload }
    );
    if (response) {
      openNotification("success", "Thành công", "Gửi đánh giá thành công");
      yield put(fetchAuctionReview(action.payload.auctionId));
      yield put(createAuctionReviewSuccess());
    } else {
      yield put(createAuctionReviewErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(createAuctionReviewErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchMyAuctionsSaga(action: FetchMyAuctionsAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_MY_AUCTIONS,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchText: action.payload.searchText,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        status: action.payload.status,
      }
    );
    if (response.data.resultCd === 1) {
      const data = {
        data: response.data.auction.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchMyAutionsSuccess(data));
    } else {
      yield put(fetchMyAutionsErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(fetchMyAutionsErr(notifyErrorFromApiCommon(error)));
  }
}

function* createAutoBid(action: CreateAutoBidAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_CREATE_AUTO_BID +
      `?AuctionId=${action.payload.AuctionId}&UserId=${action.payload.UserId}&MaxBidAmount=${action.payload.MaxBidAmount}`,
      {}
    );
    if (response) {
      openNotification("success", "Thành công", "Tạo đấu tự động thành công");
      action.payload.callback();
      yield put(createAutoBidSuccess());
    } else {
      yield put(createAutoBidErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(createAutoBidErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchAutoBid(action: FetchAutoBidAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCallNoToken,
      prepare(
        API_ENDPOINT_FETCH_AUTO_BID +
        `/${action.payload.AuctionId}/${action.payload.UserId}`,
        {},
        {}
      )
    );
    if (response) {
      yield put(fetchAutoBidSuccess(response.data));
    } else {
      yield put(fetchAutoBidErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(fetchAutoBidErr(notifyErrorFromApiCommon(error)));
  }
}

function* deleteAutoBid(action: DeleteAutoBidAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiDeleteCall,
      API_ENDPOINT_DELETE_AUTO_BID + `/${action.payload.autoBidId}`,
      {}
    );
    if (response) {
      action.payload.callback();
      openNotification("success", "Thành công", "Hủy đấu tự động thành công");
      yield put(deleteAutoBidSuccess());
    } else {
      yield put(deleteAutoBidErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(deleteAutoBidErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchListAuctionSaga(action: ListAuctionAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_LIST_AUCTION,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchName: action.payload.searchName,
        isProcessed: action.payload.isProcessed,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    );

    if (response.data.resultCd === 1) {
      const data = {
        auctionList: response.data.auctionRequests.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchListAuctionSuccess(data));
    } else {
      yield put(fetchListAuctionErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListAuctionErr(notifyErrorFromApiCommon(error)));
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchListAuctionAdminSaga(action: ListAuctionAdminAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_LIST_AUCTION_ADMIN,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchText: action.payload.searchText,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        status: action.payload.status,
      }
    );
    console.log("res1 : ", response);
    if (response.data.resultCd === 1) {
      const data = {
        auctionListAdmin: response.data.auction.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchListAuctionAdminSuccess(data));
    } else {
      yield put(fetchListAuctionAdminErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchListAuctionAdminErr(notifyErrorFromApiCommon(error)));
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchWinnerListSaga(action: FetchWinnerListAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_WINNER_LIST,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchText: action.payload.searchText,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    );
    if (response.data.resultCd === 1) {
      const data = {
        winnerList: response.data.auctionBidDtos.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchWinnerListSuccess(data));
    } else {
      yield put(fetchWinnerListErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchWinnerListErr(notifyErrorFromApiCommon(error)));
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchBiddedListSaga(action: FetchBiddedListAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_BIDDED_LIST,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchText: action.payload.searchText,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    );
    if (response.data.resultCd === 1) {
      const data = {
        biddedList: response.data.auction.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchBiddedListSuccess(data));
    } else {
      yield put(fetchBiddedListErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchBiddedListErr(notifyErrorFromApiCommon(error)));
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchDisputeListSaga(action: FetchDisputeListAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_FETCH_DISPUTE_LIST,
      {
        displayCount: {
          displayCount: action.payload.displayCount,
          pageCount: action.payload.pageCount,
          sortSettings: [
            {
              key: "string",
              direction: "string",
            },
          ],
        },
        searchText: action.payload.searchText,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      }
    );
    if (response.data.resultCd === 1) {
      const data = {
        disputeList: response.data.disputeDtos.$values,
        allRecords: response.data.allRecords,
      };
      yield put(fetchDisputeListSuccess(data));
    } else {
      yield put(fetchDisputeListErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchDisputeListErr(notifyErrorFromApiCommon(error)));
    openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchDisputeDetailSaga(action: FetchDisputeDetailAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiGetCall,
      prepare(API_ENDPOINT_FETCH_DISPUTE_DETAIL+`/${action.payload}`, {}, {})
    );
    if (response.data.resultCd === 1) {
      yield put(
        fetchDisputeDetailSuccess(response.data)
      );
    } else {
      yield put(fetchDisputeDetailErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error) {
    console.log(error);
    yield put(fetchDisputeDetailErr(notifyErrorFromApiCommon(error)));
  }
}


function* fetchAuctionIsAcceptedSaga(action: AuctionIsAcceptedAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_AUCTION_ISACCEPTED,
      {
        auctionId: action.payload.auctionId,
        isAccepted: action.payload.isAccepted,
        reason: action.payload.reason,
      }
    );
    if (response) {
      // const data = {
      //   auctionIsAccepted: response.data.auctionRequests.$values,
      //   allRecords: response.data.allRecords,
      // };
      // yield put(fetchListAuctionSuccess(data));
      if (action.payload.isAccepted) {
        openNotification("success", "Thành công", "Phê duyệt thành công");
      } else {
        openNotification("success", "Thành công", "Từ chối thành công");
      }
      action.payload.callback();
    } else {
      yield put(auctionIsAcceptedErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    // yield put(auctionIsAcceptedErr(notifyErrorFromApiCommon(error)));
    // openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

function* fetchInActiveAuctionSaga(action: AuctionIsAcceptedAction) {
  console.log("datuc2k2");
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPutCall,
      API_ENDPOINT_INACTIVE_AUCTION + `/${action.payload.auctionId}`,
      { auctionId: action.payload.auctionId }
    );

    if (response) {
      openNotification("success", "Thành công", "Xóa phiên thành công");
      action.payload.callback();
    } else {
      yield put(auctionIsAcceptedErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    // yield put(auctionIsAcceptedErr(notifyErrorFromApiCommon(error)));
    // openNotification("error", "", notifyErrorFromApiCommon(error));
  }
}

export function* watchAuctionActions() {
  yield takeEvery(REQUEST_AN_AUCTION, requestAnAuctionSaga);
  yield takeEvery(FETCH_CATEGORY, fetchCategorySaga);
  yield takeEvery(FETCH_MY_AUCTIONS, fetchMyAuctionsSaga);
  yield takeEvery(FETCH_LIST_STATUS_AUCTION, fetchStatusAuctionSaga);
  yield takeEvery(FETCH_AUCTION_DETAIL, fetchAuctionDetailSaga);
  yield takeEvery(FETCH_STATUS, fetchStatusSaga);
  yield takeEvery(FETCH_AUCTION_BID, fetchAuctionBidSaga);
  yield takeEvery(BID_TO_AUCTION, bidToAuctionSaga);
  yield takeEvery(FETCH_LIST_AUCTION, fetchListAuctionSaga);
  yield takeEvery(FETCH_LIST_AUCTION_ADMIN, fetchListAuctionAdminSaga);
  yield takeEvery(FETCH_AUCTION_ISACCEPTED, fetchAuctionIsAcceptedSaga);
  yield takeEvery(CREATE_AUTO_BID, createAutoBid);
  yield takeEvery(DELETE_AUTO_BID, deleteAutoBid);
  yield takeEvery(FETCH_AUTO_BID, fetchAutoBid);
  yield takeEvery(FETCH_CHAT_MESSAGE, fetchChatMessageSaga);
  yield takeEvery(CREATE_CHAT_MESSAGE, createChatMessageSaga);

  yield takeEvery(FETCH_AUCTION_REVIEW, fetchAuctionReviewSaga);
  yield takeEvery(FETCH_AUCTION_INVITATION, fetchAuctionInvitationSaga);
  yield takeEvery(CREATE_AUCTION_REVIEW, createAuctionReviewSaga);

  yield takeEvery(FETCH_INACTIVE_AUCTION, fetchInActiveAuctionSaga);
  yield takeEvery(FETCH_WINNER_LIST, fetchWinnerListSaga);
  yield takeEvery(FETCH_BIDDED_LIST, fetchBiddedListSaga);
  yield takeEvery(FETCH_DISPUTE_LIST, fetchDisputeListSaga);
  yield takeEvery(FETCH_DISPUTE_DETAIL, fetchDisputeDetailSaga);
}
