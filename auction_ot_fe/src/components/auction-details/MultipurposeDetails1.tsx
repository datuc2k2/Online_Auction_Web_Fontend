"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import {
  Card,
  CardContent,
  MenuItem,
  Typography,
  Box,
  SelectChangeEvent,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import Link from "next/link";
import "../../components/auction-details/style.css";
import { FiSend } from "react-icons/fi";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useCountdownTimer } from "@/customHooks/useCountdownTimer";
import HandleQuantity from "../common/HandleQuantity";
import { RootState } from "@/store/RootReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Rate,
  Row,
  Select,
  Spin,
} from "antd";
import moment from "moment";
import Countdown from "../countdown/Countdown";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addChatMessage,
  bidToAuction,
  createAuctionReview,
  createAutoBid,
  createChatMessage,
  deleteAutoBid,
  fetchAuctionBid,
  fetchAuctionDetail,
  fetchAuctionInvitation,
  fetchAuctionReview,
  fetchAutoBid,
  fetchChatMessage,
} from "@/store/auction/Actions";
import { Button } from "../component_base/components/buttons/Buttons";
import * as signalR from "@microsoft/signalr";
import { openNotification } from "@/utility/Utility";
import StatusBadge from "../custom-table/StatusBadge";
import { addPayment } from "@/store/payment/Actions";
import { fetchMyInfo, minusPointMyInfo } from "@/store/auth/Actions";
import { Heading } from "../component_base/components/heading/Heading";
import { PostService } from "@/app/posts/services/post_services";
import { Post } from "@/app/posts/models/post";
import PostBoxItem from "@/app/posts/components/PostBoxItem";
SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

const MultipurposeDetails1: FC = () => {
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance<any>>(null);
  const amountInput = Form.useWatch("Amount", form);
  const maxAmountInput = Form.useWatch("MaxAmount", form);
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();
  const [connection, setConnection] = useState<any>(null);
  const dispatch = useDispatch<any>();
  const searchParams = useSearchParams();
  const currentTime = new Date();
  const auctionId = searchParams.get("auctionId");
  const auctionDetail = useSelector(
    (states: RootState) => states.auction.auctionDetailForEdit
  );
  console.log("auctionDetailauctionDetailL: ", auctionDetail);

  const myInfo = useSelector((states: RootState) => states.auth.myInfo);

  const auctionBids = useSelector(
    (states: RootState) => states.auction.auctionBids
  );
  const chatMessages = useSelector(
    (states: RootState) => states.auction.chatMessages
  );
  // console.log("chatMessages: ", chatMessages);

  const autoBid = useSelector((states: RootState) => states.auction.autoBid);

  // console.log("autoBid: ", autoBid);

  const auctionReviewList = useSelector(
    (states: RootState) => states.auction.auctionReviewList
  );

  const auctionInvitationList = useSelector(
    (states: RootState) => states.auction.auctionInvitationList
  );

  const loading = useSelector((states: RootState) => states.auction.loading);

  const [isNotifyErrPrivate, setIsNotifyErrPrivate] = useState(false);
  const [rate, setRate] = useState(0);

  const [commentRate, setCommentRate] = useState("");

  const [post, setPost] = useState<Post[]>([]);
  const [stickPost, setStickPost] = useState<any[]>([]);
  console.log("stickPost: ", stickPost);

  const [postSelectedIds, setPostSelectedIds] = useState<number[]>([]);
  useEffect(() => {
    if (myInfo && auctionDetail?.userID) {
      if (myInfo?.userId == auctionDetail?.userID) {
        fetchPost();
        fetchStickPost();
      }
    }
  }, [myInfo, auctionDetail]);

  const handlePostChange = (value) => {
    setPostSelectedIds(value);
  };

  const postDisplay = useMemo(() => {
    return post?.map((p) => {
      return {
        id: p.post_id,
        content:
          p.content?.length > 20 ? p.content?.slice(0, 20) + " ..." : p.content,
      };
    });
  }, [post]);

  const fetchPost = async () => {
    const res = await PostService.getPostByUserId(myInfo?.userId ?? 0);
    setPost(res);
  };
  const fetchStickPost = async () => {
    const res = await PostService.getPostByUserIdAndAuctionId(
      myInfo?.userId ?? 0,
      Number(auctionId)
    );
    setStickPost(res);
    const selectPostIds = res?.map((p) => Number(p.post_id));
    setPostSelectedIds(selectPostIds ?? []);
  };

  console.log("post: ", post);

  const HasRating = useMemo(() => {
    if (myInfo) {
      if (auctionReviewList) {
        const check = auctionReviewList?.find(
          (ar) => ar.userId == myInfo?.userId
        );
        if (check) return true;
      }
    }
    return false;
  }, [auctionReviewList, myInfo]);

  const mediumStar = useMemo(() => {
    if (auctionReviewList) {
      const total = auctionReviewList
        ?.map((ar) => ar.rating)
        ?.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return total / auctionReviewList?.length;
    }
    return 0;
  }, [auctionReviewList]);

  // console.log("auctionReviewList: ", auctionReviewList);

  const categoryData = useSelector(
    (state: RootState) => state.auction.categoryData
  );

  const IsJoinAuction = useMemo(() => {
    if (myInfo) {
      if (auctionBids) {
        const myAuctionBid = auctionBids?.find(
          (a) => a?.userId == myInfo?.userId
        );
        if (myAuctionBid) {
          return true;
        }
      }
    }
    return false;
  }, [myInfo, auctionBids]);

  //check private auction.
  useEffect(() => {
    if (auctionDetail && auctionDetail?.isPrivate) {
      if (!myInfo) {
        router.push("/login");
      } else {
        //fetch auction invitation
        // console.log("vaoffooooo");

        dispatch(fetchAuctionInvitation(Number(auctionId)));
        // if(!auctionDetail?.invitedIds?.$values?.includes(myInfo?.userId)) {
        //   router.push('/');
        // }
      }
    }
  }, [auctionDetail]);

  useEffect(() => {
    if (
      auctionDetail &&
      auctionDetail?.isPrivate &&
      myInfo &&
      auctionInvitationList
    ) {
      const CurrentUserInvitationRecord = auctionInvitationList?.find(
        (a) => a.invitedUserId == myInfo?.userId
      );
      if (!isNotifyErrPrivate) {
        if (CurrentUserInvitationRecord) {
          if (CurrentUserInvitationRecord.isAccepted !== true) {
            openNotification("error", "", "Bạn không có quyền tham gia");
            setIsNotifyErrPrivate(true);
            router.push("/");
          }
        } else {
          openNotification("error", "", "Bạn không có quyền tham gia");
          setIsNotifyErrPrivate(true);
          router.push("/");
        }
      }
    }
  }, [auctionDetail, auctionInvitationList, myInfo]);

  useEffect(() => {
    fetchData();
  }, [auctionId]);

  const fetchData = () => {
    dispatch(
      fetchAutoBid({
        AuctionId: Number(auctionId),
        UserId: myInfo?.userId ?? 0,
      })
    );
    dispatch(fetchChatMessage(Number(auctionId)));
    dispatch(fetchAuctionReview(Number(auctionId)));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const containerRefMessage = useRef<HTMLDivElement>(null);

  const [atTimeStamp, setAtTimeStamp] = useState(0);
  const [qrLink, setQrLink] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [show, setShow] = useState(true);

  const genQrCode = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const currentTimestamp = Date.now();
      setAtTimeStamp(currentTimestamp);
      const qrLink = `https://img.vietqr.io/image/MB-0832964702-compact2.png?amount=${amountInput}&addInfo=Nap${amountInput}choAuctionOTTai${currentTimestamp}`;
      setQrLink(qrLink);
    } catch (errorInfo) {
      console.error("Validation error:", errorInfo);
    }
  };

  const checkPaid = async () => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=beOUWcHb4GN-fDg3ydSBft20F-ld7mtiFprsxRCBPqOOi6mDnci8T54Ma1m5nLP50ujSmIYusKThGjVSKuULWJc_o1Ek9Svmm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnK9toBhp6qeoCj9PERXUDuzqVAWhZ-bjiCBrO51u6xxj3Noidjx1iHmTm0EGKX7iRvT-Wau1EG4OpOp9QHeNsAYPhIuOCVWdldz9Jw9Md8uu&lib=Mtb4AvmSLWJfjON_ZMa49EArN_imPsKv7"
      );
      const data = await response.json();
      return data?.data?.some(
        (row: any) =>
          row["Mô tả"]?.includes(
            `Nap${amountInput}choAuctionOTTai${atTimeStamp}`
          ) || false
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  //Check Payment
  useEffect(() => {
    if (myInfo) {
      if (qrLink && atTimeStamp) {
        let notified = false;
        const intervalId = setInterval(async () => {
          const isPaid = await checkPaid();
          if (isPaid) {
            if (!notified) {
              notified = true;
              //Call api + point
              const addPaymentObj = {
                userId: myInfo?.userId,
                auctionId: 0,
                paymentAmount: amountInput,
                currency: "VND",
                paymentTime: new Date(),
                description: `${myInfo?.username} da nap ${amountInput}vnđ vao he thong.`,
                callback: () => {},
              };
              dispatch(addPayment(addPaymentObj));
              formRef.current?.setFieldsValue({
                amount: 0,
              });
            }
            clearInterval(intervalId);
            setAtTimeStamp(0);
            setQrLink("");
            setState({
              ...state,
              isOpenModalPayment: false,
            });
          }
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, [qrLink, atTimeStamp]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [auctionBids, activeTab]);

  useEffect(() => {
    if (containerRefMessage.current) {
      containerRefMessage.current.scrollTop =
        containerRefMessage.current.scrollHeight;
    }
  }, [activeTab, chatMessages]);

  // console.log("auctionDetail: ", auctionDetail);

  useEffect(() => {
    const userId = myInfo?.userId ? myInfo.userId : "0";
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${process.env.NEXT_PUBLIC_URL_DEV}bidRealtimeHub?userId=${userId}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [myInfo]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR connected");
          connection.on("ReceiveNotification", (message) => {
            console.log("messagemessage: ", message);

            if (message === "New bid, let re-fetch api") {
              dispatch(fetchAuctionBid(Number(auctionId)));
            }
            //  else if(message === "New message, re-fetch messages") {
            //     dispatch(fetchChatMessage(Number(auctionId)));
            //     setInputValue('')
            // }
          });

          connection.on(
            "SendMessage",
            (message, SenderId, SenderName, Avatar) => {
              dispatch(
                addChatMessage({
                  messageId: 111,
                  chatId: 111,
                  senderId: SenderId,
                  senderName: SenderName,
                  content: message,
                  sentAt: new Date().toISOString(),
                  isDeleted: false,
                  auctionId: Number(auctionId),
                  avatar: Avatar,
                })
              );
              setInputValue("");
            }
          );

          connection.on("ReceiveMessage", (message) => {
            console.log("messagemessage: ", message);

            if (message === "Bid successfully") {
              openNotification("success", "Thành công", "Đấu giá thành công");
            } else if (message === "Cannot bid less than current amount") {
              openNotification(
                "error",
                "",
                "Không thể đấu giá nhỏ hơn giá hiện tại + bước giá"
              );
            } else {
              openNotification("error", "", "Đấu giá lỗi");
            }

            setState((prevState) => ({
              ...prevState,
              isOpenModalInvalidAmount: false,
              isOpenModalConfirmBid: false,
              isWaitingBid: false,
            }));
          });

          connection
            .invoke("JoinAuctionGroup", auctionId)
            .then(() => console.log(`Joined auction group: ${auctionId}`))
            .catch((err) => console.error("Error joining auction group:", err));
        })
        .catch((err) => console.error("SignalR connection error:", err));

      return () => {
        connection
          .invoke("LeaveAuctionGroup", auctionId)
          .then(() => console.log(`Left auction group: ${auctionId}`))
          .catch((err) => console.error("Error leaving auction group:", err));
        connection.off("ReceiveNotification");
        connection.off("SendMessage");
        connection.off("ReceiveMessage");

        connection.stop().then(() => console.log("SignalR connection stopped"));
      };
    }
  }, [connection, auctionId]);

  const calculateTimeAgo = (createdAt: string) => {
    const now = new Date().getTime();
    const createdDate = new Date(createdAt).getTime();
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  };

  const IsFirstBid = useMemo(() => {
    if (myInfo && auctionBids) {
      return !auctionBids.some((ab) => ab.userId === myInfo.userId);
    }
  }, [myInfo, auctionBids]);

  // const imgPostFix = useSelector(
  //     (state: RootState) => state.auth.imgPostFix
  //   );
  const imgPostFix = process.env.NEXT_PUBLIC_IMAGE_POSTFIX;
  const videoPostFix = [
    "mp4",
    "mkv",
    "avi",
    "mov",
    "wmv",
    "flv",
    "webm",
    "3gp",
  ];

  const category = useMemo(() => {
    return categoryData?.categories?.find(
      (c) => c?.id === auctionDetail?.categoryId
    );
  }, [categoryData]);
  const highestBid = useMemo(() => {
    let max = 0;
    auctionBids?.forEach((bid) => {
      if (bid?.bidAmount > max) max = bid?.bidAmount;
    });
    return max;
  }, [auctionBids]);

  const [priceHighest, setpriceHighest] = useState(0);
  useEffect(() => {
    setpriceHighest(highestBid);
  }, [highestBid]);

  const [activeTab1, setActiveTab1] = useState("ProductDescription");

  const handleTabClick = (tab) => {
    setActiveTab1(tab);
  };

  const [state, setState] = useState({
    bidAmount: 0,
    isOpenModalInvalidAmount: false,
    isOpenModalConfirmBid: false,
    isWaitingBid: false,
    countDownComplete: false,
    isOpenModallackOfMoney: false,
    isOpenModalPayment: false,
    isOpenModalSetupAutoBid: false,
  });

  const [mainImage, setMainImage] = useState(
    auctionDetail?.images.$values[0] + "" + imgPostFix
  );
  const [arrPrimaryImage, setArrPrimaryImage] = useState([
    ...(auctionDetail?.images?.$values?.slice(1)?.map((i) => i + imgPostFix) ||
      []),
  ]);
  // console.log(
  //   "mainImage.split('.')[mainImage.split('.').length - 1]: ",
  //   mainImage.split(".")[mainImage.split(".").length - 1]
  // );

  useEffect(() => {
    if (auctionDetail != undefined && auctionDetail != null) {
      if (mainImage) {
        if (!mainImage?.startsWith("http")) {
          setMainImage(auctionDetail?.images.$values[0] + imgPostFix);
        }
      }
      if (arrPrimaryImage?.length === 0) {
        setArrPrimaryImage([
          ...(auctionDetail?.images?.$values
            ?.slice(1)
            ?.map((i) => i + imgPostFix) || []),
        ]);
      }
    }
  }, [auctionDetail]);

  const handleClickImageDetail = (img: string, index: number) => {
    //Swap main image to image click
    let newMainImage = img;
    let newPrimaryImage = mainImage;
    let newArrPrimaryImage = arrPrimaryImage.map((image, idx) => {
      if (index === idx) {
        return newPrimaryImage;
      } else {
        return image;
      }
    });
    setMainImage(newMainImage);
    setArrPrimaryImage(newArrPrimaryImage);
  };

  const handleClickBid = () => {
    if (
      myInfo &&
      myInfo.point !== null &&
      myInfo.point !== undefined &&
      auctionDetail &&
      auctionDetail.depositAmount !== null &&
      auctionDetail.depositAmount !== undefined &&
      myInfo.point < auctionDetail?.depositAmount &&
      IsFirstBid
    ) {
      setState({
        ...state,
        isOpenModallackOfMoney: true,
      });
    } else if (state.bidAmount < highestBid + 50) {
      setState({
        ...state,
        isOpenModalInvalidAmount: true,
      });
    } else {
      setState({
        ...state,
        isOpenModalConfirmBid: true,
      });
    }
  };

  const bid = () => {
    //Bid
    setState({
      ...state,
      isWaitingBid: true,
    });
    dispatch(
      bidToAuction({
        AuctionId: Number(auctionId),
        BidAmount: state.bidAmount,
        DepositeAmount: auctionDetail?.depositAmount ?? 0,
        IsFetchMyInfo: IsFirstBid !== undefined ? IsFirstBid : false,
        UpdatePoint: (myInfo?.point ?? 0) - (auctionDetail?.depositAmount ?? 0),
        callback: () => {
          setState({
            ...state,
            isWaitingBid: false,
            isOpenModalConfirmBid: false,
            isOpenModalInvalidAmount: false,
          });
        },
      })
    );
  };

  const handleClickOkModal = () => {
    if (state.isOpenModallackOfMoney) {
      setState({
        ...state,
        isOpenModalPayment: true,
        isOpenModallackOfMoney: false,
      });
    } else if (state.isOpenModalInvalidAmount) {
      setState({
        ...state,
        isOpenModalConfirmBid: false,
        isOpenModalInvalidAmount: false,
        isOpenModallackOfMoney: false,
      });
    } else {
      bid();
    }
  };

  const handleClickBidBtn = () => {
    if (!state.isWaitingBid && myInfo) {
      handleClickBid();
    }
    if (myInfo === null || myInfo === undefined) {
      const pathBack = window.location.pathname + window.location.search;
      document.cookie = `pathBack=${pathBack}; path=/; secure; samesite=strict`;
      router.push("/login");
    }
  };

  const handleSendRating = () => {
    dispatch(
      createAuctionReview({
        auctionId: Number(auctionId),
        userId: Number(myInfo?.userId),
        rating: rate ?? 0,
        comment: commentRate,
      })
    );
  };

  const handleCancelAutoBid = () => {
    dispatch(
      deleteAutoBid({
        autoBidId: Number(autoBid?.autoBidId),
        callback: () => {
          fetchData();
          setState({
            ...state,
            isOpenModalInvalidAmount: false,
            isOpenModalConfirmBid: false,
            isWaitingBid: false,
            countDownComplete: false,
            isOpenModallackOfMoney: false,
            isOpenModalPayment: false,
            isOpenModalSetupAutoBid: false,
          });
        },
      })
    );
  };

  const handleClickGenQrCode = async () => {
    try {
      await form.validateFields();
      form.submit();
      genQrCode();
    } catch (error) {}
  };

  const handleCreateAutoBid = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      dispatch(
        createAutoBid({
          AuctionId: Number(auctionId),
          UserId: myInfo?.userId ?? 0,
          MaxBidAmount: maxAmountInput,
          callback: () => {
            fetchData();
            setState({
              ...state,
              isOpenModalInvalidAmount: false,
              isOpenModalConfirmBid: false,
              isWaitingBid: false,
              countDownComplete: false,
              isOpenModallackOfMoney: false,
              isOpenModalPayment: false,
              isOpenModalSetupAutoBid: false,
            });
            if (IsFirstBid) {
              //Minus point from myInfo
              dispatch(
                minusPointMyInfo(
                  (myInfo?.point ?? 0) - (auctionDetail?.depositAmount ?? 0)
                )
              );
            }
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = () => {
    if (myInfo === null || myInfo === undefined) {
      const pathBack = window.location.pathname + window.location.search;
      document.cookie = `pathBack=${pathBack}; path=/; secure; samesite=strict`;
      router.push("/login");
    } else {
      dispatch(
        createChatMessage({
          AuctionId: Number(auctionId),
          Message: inputValue,
          SenderId: myInfo?.userId ?? 0,
        })
      );
    }
  };

  const handleClickStar = (star: number) => {
    setRate(star);
  };

  console.log("rateee: ", rate);
  const handleClickAutoBid = () => {
    if (IsFirstBid) {
      if (
        myInfo &&
        myInfo.point !== null &&
        myInfo.point !== undefined &&
        auctionDetail &&
        auctionDetail.depositAmount !== null &&
        auctionDetail.depositAmount !== undefined &&
        myInfo?.point >= auctionDetail?.depositAmount
      ) {
        setState({
          ...state,
          isOpenModalSetupAutoBid: true,
        });
      } else {
        setState({
          ...state,
          isOpenModallackOfMoney: true,
        });
      }
    } else {
      setState({
        ...state,
        isOpenModalSetupAutoBid: true,
      });
    }
  };

  const handleStickPostToBid = async () => {
    const res = await PostService.postStickPostToAuction(
      postSelectedIds ?? [],
      Number(auctionId)
    );
    fetchStickPost();
  };

  return (
    <>
      <div
        style={{ paddingTop: 50, minHeight: 1000 }}
        className="auction-details-section pt-10 mb-10"
      >
        <div className="container-fluid">
          <div className="row gy-5">
            {/* Description here */}

            <div style={{ marginTop: 0 }} className="col-xl-7">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                {/* <span>Phòng: # {auctionId?.toString().padStart(4, '0')}</span> */}
                {auctionDetail?.aucStatus?.id === 8 &&
                myInfo?.userRoleId != "1" &&
                myInfo?.userRoleId != "3" ? (
                  <div
                    onClick={() => {
                      if (myInfo === null || myInfo === undefined) {
                        const pathBack =
                          window.location.pathname + window.location.search;
                        document.cookie = `pathBack=${pathBack}; path=/; secure; samesite=strict`;
                        router.push("/login");
                      } else {
                        handleClickAutoBid();
                      }
                    }}
                    style={{
                      userSelect: "none",
                      cursor: "pointer",
                      fontSize: 15,
                      color: "#FFF",
                      fontWeight: 600,
                      backgroundColor: autoBid ? "#FF4D4F" : "#01AA85",
                      padding: "7px 14px",
                      borderRadius: 6,
                    }}
                  >
                    {autoBid ? "Hủy đấu tự động" : "Đấu tự động"}
                    {autoBid &&
                      ` (${new Intl.NumberFormat("de-DE").format(
                        autoBid?.maxBidAmount ?? 0
                      )} VNĐ)`}
                  </div>
                ) : (
                  <div></div>
                )}
                <div
                  style={{
                    color:
                      auctionDetail?.aucStatus?.id === 8
                        ? "#01AA85"
                        : auctionDetail?.aucStatus?.id === 9
                        ? "#f5222d"
                        : "",
                    fontSize: 16,
                    // fontWeight: 700,
                    marginTop: 6,
                  }}
                >
                  {auctionDetail?.aucStatus?.id === 12
                    ? auctionDetail?.aucStatusPayment?.id == 13
                      ? "CHƯA THANH TOÁN"
                      : "SẮP DIỄN RA"
                    : auctionDetail?.aucStatus?.name.toUpperCase()}
                  {/* {auctionDetail?.aucStatus?.name.toUpperCase()} */}
                </div>
              </div>
              <div style={{ marginRight: 0 }} className="auction-details-img">
                <div className="tab-content" id="v-pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="v-pills-img1"
                    role="tabpanel"
                  >
                    <div className="auction-details-tab-img">
                      {videoPostFix.includes(
                        mainImage?.split("?")[0]?.split(".")?.pop() || ""
                      ) ? (
                        <video
                          width="100%"
                          controls
                          style={{ maxHeight: "366px" }}
                        >
                          <source src={mainImage} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          width="100%"
                          src={mainImage}
                          alt="Main image error"
                          style={{ maxHeight: "366px" }}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div
                    className="tab-pane fade"
                    id="v-pills-img2"
                    role="tabpanel"
                  >
                    <div className="auction-details-tab-img">
                      <img src={mainImage} alt="" />
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-img3"
                    role="tabpanel"
                    aria-labelledby="v-pills-img3-tab"
                  >
                    <div className="auction-details-tab-img">
                      <img
                        src="assets/img/inner-pages/auction-details-img3.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-img4"
                    role="tabpanel"
                    aria-labelledby="v-pills-img4-tab"
                  >
                    <div className="auction-details-tab-img">
                      <img
                        src="assets/img/inner-pages/auction-details-img4.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="v-pills-img5"
                    role="tabpanel"
                    aria-labelledby="v-pills-img5-tab"
                  >
                    <div className="auction-details-tab-img">
                      <img
                        src="assets/img/inner-pages/auction-details-img5.jpg"
                        alt=""
                      />
                    </div>
                  </div> */}
                </div>
                <div
                  className="nav nav-pills"
                  id="v-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                  style={{ paddingTop: "10px" }}
                >
                  <div className="swiper-wrapper">
                    <Row style={{ width: "100%", gap: 15, marginTop: 9 }}>
                      {arrPrimaryImage?.map((img, index) => {
                        return (
                          <>
                            <Col>
                              <div
                                onClick={() =>
                                  handleClickImageDetail(img, index)
                                }
                                className="nav-item"
                                role="presentation"
                              >
                                <button
                                  className="nav-link active"
                                  id={`v-pills-img${index + 1}-tab`}
                                  data-bs-toggle="pill"
                                  data-bs-target={`#v-pills-img${index + 1}`}
                                  type="button"
                                  role="tab"
                                  aria-controls={`v-pills-img${index + 1}`}
                                  aria-selected="true"
                                >
                                  {/* {videoPostFix.includes(
                                    img?.split("?")[0]?.split(".")?.pop() || ""
                                  ) ? (
                                    <video
                                      style={{
                                        width: "170px",
                                        height: "134px",
                                      }}
                                      controls
                                    >
                                      <source src={img} type="video/mp4" />
                                    </video>
                                  ) : (
                                    <img src={img} alt="Main image error" />
                                  )} */}
                                  {videoPostFix.includes(
                                    img?.split("?")[0]?.split(".")?.pop() || ""
                                  ) ? (
                                    <video
                                      style={{
                                        width: "170px",
                                        height: "134px",
                                        objectFit: "cover",
                                        display: "block",
                                      }}
                                      controls
                                    >
                                      <source src={img} type="video/mp4" />
                                    </video>
                                  ) : (
                                    <img
                                      style={{
                                        width: "170px",
                                        height: "134px",
                                        objectFit: "cover",
                                        display: "block",
                                      }}
                                      src={img}
                                      alt="Main image error"
                                    />
                                  )}
                                </button>
                              </div>
                            </Col>
                          </>
                        );
                      })}
                    </Row>
                  </div>
                  {/* <div className="swiper-wrapper">
                    <Row style={{ width: "100%" }}>
                      {arrPrimaryImage?.map((img, index) => (
                        <Col span={5} key={index} className="col-5">
                          <div
                            onClick={() => handleClickImageDetail(img, index)}
                            className="nav-item"
                          >
                            <button
                              className="nav-link active"
                              id={`v-pills-img${index + 1}-tab`}
                              data-bs-toggle="pill"
                              data-bs-target={`#v-pills-img${index + 1}`}
                              type="button"
                              role="tab"
                              aria-controls={`v-pills-img${index + 1}`}
                              aria-selected="true"
                            >
                              {!videoPostFix.includes(
                                img
                                  ?.split("?")[0]
                                  ?.split(".")
                                  ?.pop()
                                  ?.toLowerCase() || ""
                              ) && (
                                <img
                                  src={img}
                                  alt="Main image error"
                                  style={{ width: "170px", height: "134px" }}
                                />
                              )}
                            </button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div> */}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 0 }} className="col-xl-5">
              <div
                className="auction-details-content"
                // style={{ marginLeft: "60px" }}
              >
                {auctionDetail?.aucStatus?.id == 7 ? (
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "red",
                        marginTop: "6px",
                      }}
                    >
                      PHIÊN ĐẤU GIÁ BẮT ĐẦU SAU:
                    </div>
                    <div
                      style={{
                        marginTop: "18px",
                      }}
                      className="auction-details-content"
                    >
                      <div
                        style={{ marginBottom: 20 }}
                        className="coundown-area"
                      >
                        {auctionDetail?.startTime && (
                          <Countdown
                            timeStamp={new Date(
                              moment(auctionDetail?.startTime).format(
                                "YYYY-MM-DDTHH:mm:ss"
                              )
                            ).getTime()}
                            onCountdownComplete={() => {
                              setState({
                                ...state,
                                countDownComplete: true,
                              });
                              dispatch(fetchAuctionDetail(Number(auctionId)));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : auctionDetail?.aucStatus?.id == 8 ? (
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "red",
                        marginTop: "6px",
                      }}
                    >
                      PHIÊN ĐẤU GIÁ SẼ KẾT THÚC SAU:
                    </div>
                    <div
                      style={{
                        marginTop: "18px",
                      }}
                      className="auction-details-content"
                    >
                      {/* <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      marginBottom: 10,
                      color: "#01AA85",
                    }}
                  >
                    Tiền cọc:
                    {new Intl.NumberFormat("de-DE").format(
                      auctionDetail?.depositAmount ?? 0
                    )}
                    VNĐ
                  </div> */}
                      <div
                        style={{ marginBottom: 20 }}
                        className="coundown-area"
                      >
                        {auctionDetail?.endTime && (
                          <Countdown
                            timeStamp={new Date(
                              moment(auctionDetail?.endTime).format(
                                "YYYY-MM-DDTHH:mm:ss"
                              )
                            ).getTime()}
                            onCountdownComplete={() => {
                              setState({
                                ...state,
                                countDownComplete: true,
                              });
                              dispatch(fetchAuctionDetail(Number(auctionId)));
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div style={{ height: 50 }}>
                  <div className="auction-details-description-area">
                    <div className="auction-details-description-nav">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <button
                            className="nav-link active"
                            id="nav-description-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-description"
                            type="button"
                            role="tab"
                            aria-controls="nav-description"
                            aria-selected={activeTab === "description"}
                            onClick={() => {
                              setActiveTab("description");
                              setShow(false);
                            }}
                            style={{ flex: 1, textAlign: "center" }}
                          >
                            Diễn biến cuộc đấu giá
                          </button>
                          <button
                            className="nav-link"
                            id="nav-add-info-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-add-info"
                            type="button"
                            role="tab"
                            aria-controls="nav-add-info"
                            aria-selected={activeTab === "comments"}
                            onClick={() => {
                              setActiveTab("comments");
                              setShow(false);
                            }}
                            style={{ flex: 1, textAlign: "center" }}
                          >
                            Bình luận
                          </button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>

                <div>
                  {activeTab === "description" && (
                    <div className="tab-content">
                      {auctionBids && auctionBids?.length > 0 && (
                        <div
                          ref={containerRef}
                          style={{
                            width: "100%",
                            maxHeight: 192,
                            overflowY: "auto",

                            marginTop: 10,
                            padding: "10px",
                            border: "4px solid rgba(0, 0, 0, 0.05) ",
                            borderRadius: "5px",
                            // marginBottom: 50,
                          }}
                        >
                          <div className="current-price-label">
                            Lịch sử đấu giá
                          </div>
                          <style>
                            {`
                                  div::-webkit-scrollbar {
                                      width: 6px;
                                  }
                                  div::-webkit-scrollbar-thumb {
                                      background: #ccc;
                                      border-radius: 3px;
                                  }
                                  div::-webkit-scrollbar-thumb:hover {
                                      background: #aaa;
                                  }
                                  div::-webkit-scrollbar-track {
                                      background: transparent;
                                  }
                                  `}
                          </style>
                          {/* {auctionBids
                            ?.sort((a, b) => b.bidAmount - a.bidAmount)
                            .map((ab, index) => {
                              const avatarSrc = ab.userAvatar
                                ? `${
                                    ab.userAvatar +
                                    process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                  }`
                                : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

                              return (
                                <div
                                  key={ab.userId || index} // Thêm `key` để tránh cảnh báo React
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "15px 0",
                                    padding: "10px 15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    backgroundColor:
                                      index === 0 ? "#fff5f5" : "#ffffff", // Màu nền nhạt cho người trả giá cao nhất
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                    transition:
                                      "transform 0.2s, box-shadow 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1.02)";
                                    e.currentTarget.style.boxShadow =
                                      "0 4px 10px rgba(0, 0, 0, 0.2)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 5px rgba(0, 0, 0, 0.1)";
                                  }}
                                >
                                  <img
                                    style={{
                                      height: 40,
                                      width: 40,
                                      borderRadius: "50%",
                                      marginRight: 12,
                                      border: "2px solid #01AAA0",
                                    }}
                                    src={avatarSrc}
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.onerror = null; // Ngăn vòng lặp nếu ảnh fallback cũng bị lỗi
                                      target.src =
                                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                                    }}
                                    alt="User Avatar"
                                  />
                                  <div
                                    style={{
                                      fontSize: 16,
                                      color: "#333",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      flex: 1,
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <span
                                        style={{
                                          fontWeight: index === 0 ? 700 : 550, // Người trả giá cao nhất được in đậm
                                          color:
                                            index === 0 ? "#D80000" : "#01AAA0", // Màu đỏ cho người trả giá cao nhất
                                        }}
                                      >
                                        {myInfo?.userId === ab?.userId
                                          ? "Bạn "
                                          : ab?.userName}
                                      </span>
                                      {` đã trả giá `}
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          color:
                                            index === 0 ? "#D80000" : "#000",
                                        }}
                                      >
                                        {new Intl.NumberFormat("de-DE").format(
                                          ab?.bidAmount
                                        )}{" "}
                                        VNĐ
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        marginRight: 10,
                                        fontSize: 14,
                                        color: "#888",
                                      }}
                                    >
                                      {calculateTimeAgo(ab?.bidTime)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })} */}
                          {[...auctionBids]
                            ?.sort(
                              (a, b) =>
                                Number(b.bidAmount) - Number(a.bidAmount)
                            )
                            .map((ab, index) => {
                              const avatarSrc = ab.userAvatar
                                ? `${
                                    ab.userAvatar +
                                    process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                  }`
                                : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

                              return (
                                <div
                                  key={ab.userId || index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "15px 0",
                                    padding: "10px 15px",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    backgroundColor:
                                      index === 0 ? "#fff5f5" : "#ffffff",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                    transition:
                                      "transform 0.2s, box-shadow 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1.02)";
                                    e.currentTarget.style.boxShadow =
                                      "0 4px 10px rgba(0, 0, 0, 0.2)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 5px rgba(0, 0, 0, 0.1)";
                                  }}
                                >
                                  <img
                                    style={{
                                      height: 40,
                                      width: 40,
                                      borderRadius: "50%",
                                      marginRight: 12,
                                      border: "2px solid #01AAA0",
                                    }}
                                    src={avatarSrc}
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.src =
                                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                                    }}
                                    alt="User Avatar"
                                  />
                                  <div
                                    style={{
                                      fontSize: 16,
                                      color: "#333",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      flex: 1,
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <span
                                        style={{
                                          fontWeight: index === 0 ? 700 : 550,
                                          color:
                                            index === 0 ? "#D80000" : "#01AAA0",
                                        }}
                                      >
                                        {myInfo?.userId === ab?.userId
                                          ? "Bạn "
                                          : ab?.userName}
                                      </span>
                                      {` đã trả giá `}
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          color:
                                            index === 0 ? "#D80000" : "#000",
                                        }}
                                      >
                                        {new Intl.NumberFormat("de-DE").format(
                                          ab?.bidAmount
                                        )}{" "}
                                        VNĐ
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        marginRight: 10,
                                        fontSize: 14,
                                        color: "#888",
                                      }}
                                    >
                                      {calculateTimeAgo(ab?.bidTime)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}

                      <div
                        style={{
                          // border: "4px solid rgba(0, 0, 0, 0.05) ",
                          // borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {auctionDetail && auctionDetail?.aucStatus?.id == 9 && (
                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 600,
                              marginBottom: 20,
                              textAlign: "center",
                              color: "#01AA85",
                            }}
                          >
                            {auctionBids && auctionBids?.length == 0
                              ? "Không có người chiến thắng"
                              : auctionBids &&
                                (myInfo?.userId ===
                                auctionBids[auctionBids?.length - 1]?.userId
                                  ? "Bạn"
                                  : auctionBids[auctionBids?.length - 1]
                                      ?.userName) +
                                  " là người chiến thắng 🎉🎉🎉"}
                          </div>
                        )}
                        <div style={{ width: "100%" }}>
                          {auctionDetail?.aucStatus.id == 8 ? (
                            <div>
                              <div className="current-price-label">
                                Giá hiện tại:
                              </div>
                              <div className="current-price-value">
                                {new Intl.NumberFormat("de-DE").format(
                                  highestBid
                                )}
                                VNĐ
                              </div>
                            </div>
                          ) : auctionDetail?.aucStatus.id == 9 ? (
                            <div>
                              <div className="current-price-label">
                                Giá trúng :
                              </div>
                              <div className="current-price-value">
                                {new Intl.NumberFormat("de-DE").format(
                                  highestBid
                                )}
                                VNĐ
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="current-price-label">
                                Giá khởi điểm :
                              </div>
                              <div className="current-price-value">
                                {new Intl.NumberFormat("de-DE").format(
                                  auctionDetail?.startingPrice ?? 0
                                )}
                                VNĐ
                              </div>
                            </div>
                          )}

                          <div
                            style={{
                              fontSize: 16,
                              color: "#000",
                              fontWeight: 500,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="current-price-label">
                              Bước giá
                            </span>
                            <div className="current-price-value-check">
                              {new Intl.NumberFormat("de-DE").format(
                                auctionDetail?.stepPrice ?? 0
                              )}
                              VNĐ
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 16,
                              color: "#000",
                              fontWeight: 500,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="current-price-label">
                              Tiền cọc
                            </span>
                            <div className="current-price-value-check">
                              {new Intl.NumberFormat("de-DE").format(
                                auctionDetail?.depositAmount ?? 0
                              )}
                              VNĐ
                            </div>
                          </div>
                        </div>
                        {auctionDetail?.aucStatus?.id === 8 &&
                          myInfo?.userRoleId != "1" &&
                          myInfo?.userRoleId != "3" && (
                            <div
                              className="quantity-area"
                              style={{ marginTop: "10px" }}
                            >
                              {/* <div
                              style={{
                                fontSize: 18,
                                color: "#000",
                                fontWeight: 600,
                                marginBottom: 20,
                              }}
                            >
                             
                            </div> */}
                              <span className="current-price-label">
                                Nhập số tiền cần đấu:
                              </span>
                              <div
                                style={{
                                  flexWrap: "nowrap",
                                  marginTop: "15px",
                                }}
                                className="quantity-counter-and-btn-area"
                              >
                                <style>
                                  {`
                                                 .ant-spin-dot-item {
                                                     background-color: #FFF;
                                                 }
                                             `}
                                </style>
                                <HandleQuantity
                                  bidAmount={state.bidAmount}
                                  // bidAmount={priceHighest}
                                  // bidAmount={parseInt(
                                  //   new Intl.NumberFormat("de-DE")
                                  //     .format(highestBid)
                                  //     .replace(/\./g, "")
                                  //     .replace(",", ".")
                                  // )}
                                  setBidAmount={(value) =>
                                    setState({ ...state, bidAmount: value })
                                  }
                                  stepPrice={auctionDetail?.stepPrice ?? 0}
                                />
                                <Button
                                  loading={state.isWaitingBid}
                                  style={{
                                    width: 100,
                                    marginLeft: 10,
                                    backgroundColor: "#01AA85",
                                  }}
                                  key="Dau"
                                  onClick={handleClickBidBtn}
                                >
                                  Đấu
                                </Button>
                                {/* <div
                                             style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}
                                             className="primary-btn btn-hover"
                                             onClick={ () => !state.isWaitingBid ? handleClickBid() : ''}
                                             >
                                             {state.isWaitingBid && <Spin style={{ marginRight: 8, color: '#FFF' }} />}
                                             Đấu
                                             <span style={{ top: "40.5px", left: "84.2344px" }} />
                                         </div> */}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                  {activeTab === "comments" && (
                    <div>
                      {chatMessages && chatMessages?.length > 0 && (
                        <div
                          ref={containerRefMessage}
                          style={{
                            width: "100%",
                            maxHeight: 192,
                            overflowY: "auto",
                            marginBottom: 20,
                            marginTop: "10px",
                            padding: "10px",
                            border: "4px solid rgba(0, 0, 0, 0.05) ",
                            borderRadius: "5px",
                          }}
                        >
                          <style>
                            {`
                                  div::-webkit-scrollbar {
                                      width: 6px;
                                  }
                                  div::-webkit-scrollbar-thumb {
                                      background: #ccc;
                                      border-radius: 3px;
                                  }
                                  div::-webkit-scrollbar-thumb:hover {
                                      background: #aaa;
                                  }
                                  div::-webkit-scrollbar-track {
                                      background: transparent;
                                  }
                                  `}
                          </style>
                          {chatMessages?.map((cm) => {
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 8,
                                }}
                              >
                                <img
                                  style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: "50%",
                                    marginRight: 12,
                                    border: "2px solid #01AAA0",
                                  }}
                                  src={
                                    cm.avatar +
                                    process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                  }
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; // Ngăn vòng lặp nếu ảnh fallback cũng bị lỗi
                                    target.src =
                                      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                                  }}
                                  alt="User Avatar"
                                />
                                <div
                                  style={{
                                    fontSize: 16,
                                    color: "#000",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flex: 1,
                                  }}
                                >
                                  <div>
                                    <span
                                      style={{
                                        fontWeight: 550,
                                        color: "#01AAA0",
                                      }}
                                    >
                                      {myInfo?.userId === cm?.senderId
                                        ? "Bạn "
                                        : `${cm?.senderName} `}
                                    </span>
                                    <span>{cm?.content}</span>
                                  </div>
                                  <div style={{ marginRight: 10 }}>
                                    {/* {`${moment(cm?.sentAt)?.format(
                                      "hh:mm:ss"
                                    )}`} */}
                                    {calculateTimeAgo(cm?.sentAt)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* Ô input */}
                        <input
                          type="text"
                          placeholder="Viết bình luận"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)} // Cập nhật state khi nhập liệu
                          style={{
                            flex: 1,
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            outline: "none",
                          }}
                        />

                        {/* Icon send */}
                        <FiSend
                          style={{
                            fontSize: "20px",
                            color: inputValue.trim() ? "blue" : "gray", // Màu xanh khi có text
                            cursor: inputValue.trim()
                              ? "pointer"
                              : "not-allowed", // Trạng thái click
                          }}
                          onClick={handleSendMessage}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginTop: 30 }}>
              <div className="auction-details-description-area">
                <div className="auction-details-description-nav">
                  <div className="col-xl-7" id="nav-tab" role="tablist">
                    <div className="tab-container">
                      <div
                        className={`tab ${
                          activeTab1 === "ProductDescription" ? "active" : ""
                        }`}
                        id="nav-ProductDescription-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-ProductDescription"
                        role="tab"
                        aria-controls="nav-ProductDescription"
                        aria-selected={activeTab === "ProductDescription"}
                        onClick={() => {
                          setActiveTab("description");
                          setShow(false);
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#444",
                            position: "relative",
                            fontWeight: "bold",
                            marginTop: "5px",
                          }}
                        >
                          Mô tả sản phẩm
                        </span>
                      </div>
                      <div
                        style={{ padding: "8px 10px 8px 0px" }}
                        className={`tab ${
                          activeTab1 === "reviews" ? "active" : ""
                        }`}
                        id="nav-reviews-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-reviews"
                        role="tab"
                        aria-controls="nav-reviews"
                        aria-selected={activeTab === "reviews"}
                        onClick={() => {
                          setActiveTab("description");
                          setShow(false);
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#444",
                            position: "relative",
                            fontWeight: "bold",
                            marginTop: "5px",
                          }}
                        >
                          Đánh giá ({auctionReviewList?.length})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {show && (
                  <div>
                    <Grid item xs={12}>
                      <Card
                        style={{
                          borderRadius: "12px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <CardContent
                          style={{
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                          }}
                        >
                          <Box>
                            {/* Tiêu đề sản phẩm */}
                            <h2
                              style={{
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#333333",
                                marginBottom: "10px",
                              }}
                            >
                              {auctionDetail?.productName}
                            </h2>

                            {/* Mô tả sản phẩm */}
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#666666",
                                lineHeight: "1.6",
                                marginBottom: "10px",
                              }}
                            >
                              <strong style={{ color: "#333" }}>Mô tả:</strong>{" "}
                              {auctionDetail?.description}
                            </div>

                            {/* Thể loại sản phẩm */}
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#666666",
                                marginBottom: "10px",
                              }}
                            >
                              <strong style={{ color: "#333" }}>
                                Thể loại:
                              </strong>{" "}
                              {category?.name}
                            </div>

                            {/* Thông tin người tạo phiên đấu giá */}
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#666666",
                              }}
                            >
                              <strong style={{ color: "#333" }}>
                                Phiên đấu giá của:
                              </strong>{" "}
                              {auctionDetail?.createrProfile?.name}
                            </div>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
                )}
                <div className="auction-details-description-tab">
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade"
                      id="nav-reviews"
                      role="tabpanel"
                      aria-labelledby="nav-reviews-tab"
                    >
                      <Grid item xs={12}>
                        <Card
                          style={{
                            borderRadius: "12px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <CardContent
                            style={{
                              padding: "20px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "15px",
                            }}
                          >
                            <Box>
                              <div
                                style={{
                                  fontSize: "16px",
                                  color: "#666666",
                                }}
                              >
                                <strong style={{ color: "#333" }}>
                                  {auctionReviewList?.length} lượt đánh giá :
                                  {" " + (isNaN(mediumStar) ? 0 : mediumStar)} /
                                  5 &nbsp;
                                </strong>{" "}
                                {auctionDetail?.createrProfile?.name}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 30,
                                }}
                              >
                                {Array.from({ length: 5 }, (_, i) => {
                                  // Determine the fill percentage for each star
                                  const fillPercentage =
                                    Math.min(Math.max(0, mediumStar - i), 1) *
                                    100;

                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        position: "relative",
                                        width: "1em",
                                        height: "1em",
                                        marginRight: 4,
                                      }}
                                    >
                                      {/* Background star (gray) */}
                                      <svg
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        data-icon="star"
                                        width="1em"
                                        height="1em"
                                        fill="#CCCCCC"
                                        aria-hidden="true"
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                        }}
                                      >
                                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
                                      </svg>
                                      {/* Filled star (yellow) */}
                                      <svg
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        data-icon="star"
                                        width="1em"
                                        height="1em"
                                        fill="#DDA701"
                                        aria-hidden="true"
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          clipPath: `inset(0 ${
                                            100 - fillPercentage
                                          }% 0 0)`,
                                        }}
                                      >
                                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
                                      </svg>
                                    </div>
                                  );
                                })}
                              </div>
                              {auctionReviewList?.slice(0, 3)?.map((ar) => {
                                return (
                                  <div
                                    className="comment-content"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <img
                                      style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: "50%",
                                        marginRight: 12,
                                        border: "2px solid #01AAA0",
                                      }}
                                      src={
                                        ar.userAvatar +
                                        "" +
                                        process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                      }
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.onerror = null; // Ngăn vòng lặp nếu ảnh fallback cũng bị lỗi
                                        target.src =
                                          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
                                      }}
                                      alt="User Avatar"
                                    />

                                    <div
                                      style={{
                                        display: "inline-block",
                                        fontSize: "16px",
                                        color: "#666666",
                                      }}
                                    >
                                      <strong style={{ color: "#333" }}>
                                        {myInfo && myInfo?.userId == ar?.userId
                                          ? "Bạn "
                                          : ar.userName}
                                        &nbsp;
                                      </strong>
                                      {"    "}
                                    </div>
                                    <p
                                      style={{
                                        display: "inline-block",
                                        marginBottom: 0,
                                      }}
                                    >
                                      {calculateTimeAgo(ar.createdAt)}
                                    </p>
                                    <p style={{ marginBottom: 0 }}>
                                      {Array.from({ length: 5 }, (_, i) => (
                                        <svg
                                          key={i}
                                          viewBox="64 64 896 896"
                                          focusable="false"
                                          data-icon="star"
                                          width="1em"
                                          height="1em"
                                          fill={
                                            i < ar.rating
                                              ? "#DDA701"
                                              : "#CCCCCC"
                                          }
                                          aria-hidden="true"
                                          style={{ marginRight: 4 }}
                                        >
                                          <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
                                        </svg>
                                      ))}
                                    </p>
                                    <p>{ar.comment}</p>
                                  </div>
                                );
                              })}
                              {auctionReviewList?.length &&
                              auctionReviewList?.length <= 0 ? (
                                <div
                                  style={{
                                    marginTop: 150,
                                    color: "#000",
                                    fontWeight: 600,
                                    fontSize: 20,
                                    textAlign: "center",
                                  }}
                                >
                                  Chưa có đánh giá nào cho phiên
                                </div>
                              ) : (
                                ""
                              )}
                              {IsJoinAuction && !HasRating && (
                                <div className="reviews-area">
                                  <div className="review-form">
                                    <div className="number-of-review">
                                      <h4>Viết một đánh giá</h4>
                                    </div>
                                    <form>
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <div className="form-inner2 mb-40">
                                            <div className="review-rate-area">
                                              <p>Đánh giá của bạn</p>
                                              <div className="rate">
                                                <input
                                                  type="radio"
                                                  id="star5"
                                                  name="rate"
                                                  defaultValue={5}
                                                  checked={rate == 5}
                                                  onChange={() =>
                                                    handleClickStar(5)
                                                  }
                                                />
                                                <label
                                                  htmlFor="star5"
                                                  title="text"
                                                >
                                                  5 stars
                                                </label>
                                                <input
                                                  type="radio"
                                                  id="star4"
                                                  name="rate"
                                                  defaultValue={4}
                                                  checked={rate == 4}
                                                  onChange={() =>
                                                    handleClickStar(4)
                                                  }
                                                />
                                                <label
                                                  htmlFor="star4"
                                                  title="text"
                                                >
                                                  4 stars
                                                </label>
                                                <input
                                                  type="radio"
                                                  id="star3"
                                                  name="rate"
                                                  defaultValue={3}
                                                  checked={rate == 3}
                                                  onChange={() =>
                                                    handleClickStar(3)
                                                  }
                                                />
                                                <label
                                                  htmlFor="star3"
                                                  title="text"
                                                >
                                                  3 stars
                                                </label>
                                                <input
                                                  type="radio"
                                                  id="star2"
                                                  name="rate"
                                                  defaultValue={2}
                                                  checked={rate == 2}
                                                  onChange={() =>
                                                    handleClickStar(2)
                                                  }
                                                />
                                                <label
                                                  htmlFor="star2"
                                                  title="text"
                                                >
                                                  2 stars
                                                </label>
                                                <input
                                                  type="radio"
                                                  id="star1"
                                                  name="rate"
                                                  defaultValue={1}
                                                  checked={rate == 1}
                                                  onChange={() =>
                                                    handleClickStar(1)
                                                  }
                                                />
                                                <label
                                                  htmlFor="star1"
                                                  title="text"
                                                >
                                                  1 star
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12">
                                          <div className="form-inner mb-30">
                                            <textarea
                                              placeholder="Viết đánh giá tại đây ..."
                                              defaultValue={""}
                                              value={commentRate}
                                              onChange={(e) =>
                                                setCommentRate(e.target.value)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-12">
                                          <Button
                                            style={{
                                              width: 120,
                                              marginLeft: 20,
                                              backgroundColor: "#01AA85",
                                            }}
                                            // mergetype="primary"
                                            key="submit"
                                            onClick={handleSendRating}
                                            disabled={!rate}
                                            loading={loading}
                                          >
                                            <div
                                              style={{
                                                color: "#FFF",
                                                fontWeight: 550,
                                                fontSize: 18,
                                              }}
                                            >
                                              Gửi
                                            </div>
                                          </Button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </div>
                  </div>
                </div>

                <div className="auction-details-description-tab">
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade"
                      id="nav-ProductDescription"
                      role="tabpanel"
                      aria-labelledby="nav-ProductDescription-tab"
                    >
                      <div>
                        <Grid item xs={12}>
                          <Card
                            style={{
                              borderRadius: "12px",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <CardContent
                              style={{
                                padding: "20px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                              }}
                            >
                              <Box>
                                {/* Tiêu đề sản phẩm */}
                                <h2
                                  style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    color: "#333333",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {auctionDetail?.productName}
                                </h2>

                                {/* Mô tả sản phẩm */}
                                <div
                                  style={{
                                    fontSize: "16px",
                                    color: "#666666",
                                    lineHeight: "1.6",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <strong style={{ color: "#333" }}>
                                    Mô tả:
                                  </strong>{" "}
                                  {auctionDetail?.description}
                                </div>

                                {/* Thể loại sản phẩm */}
                                <div
                                  style={{
                                    fontSize: "16px",
                                    color: "#666666",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <strong style={{ color: "#333" }}>
                                    Thể loại:
                                  </strong>{" "}
                                  {category?.name}
                                </div>

                                {/* Thông tin người tạo phiên đấu giá */}
                                <div
                                  style={{
                                    fontSize: "16px",
                                    color: "#666666",
                                  }}
                                >
                                  <strong style={{ color: "#333" }}>
                                    Phiên đấu giá của:
                                  </strong>{" "}
                                  {auctionDetail?.createrProfile?.name}
                                </div>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            {postDisplay?.length > 0 && (
              <>
                <div style={{ fontSize: 16, color: "#000", fontWeight: 600 }}>
                  Gán bài đăng vào bài đấu giá
                </div>
                <div
                  className="col-xl-7"
                  style={{ display: "flex", width: "29%" }}
                >
                  <Select
                    onChange={handlePostChange}
                    mode="multiple"
                    listHeight={155}
                    className="customSelect"
                    style={{ flex: 1, fontSize: "15px", marginBottom: 20 }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    optionLabelProp="label"
                    aria-required
                    value={postSelectedIds}
                  >
                    {postDisplay?.map((option) => (
                      <Select.Option
                        key={option.id}
                        value={option.id}
                        label={option.content}
                      >
                        {option.content}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button
                    style={{
                      width: 100,
                      backgroundColor: "#01AA85",
                      color: "#FFF",
                      height: 33,
                      marginLeft: 20,
                    }}
                    onClick={handleStickPostToBid}
                  >
                    Gán
                  </Button>
                </div>
              </>
            )}
          </div>

          {stickPost?.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h1>Bài viết liên quan</h1>
              {/* stick post here */}
              {stickPost.map((post) => (
                <PostBoxItem key={post.post_id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        centered
        open={
          state.isOpenModalInvalidAmount ||
          state.isOpenModalConfirmBid ||
          state.isOpenModallackOfMoney
        }
        // onCancel={() => setState({ ...state, IsOpenModalLackInfo: false })}
        footer=""
        closable={false}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, color: "#000", fontWeight: 600 }}>
            {state.isOpenModalInvalidAmount
              ? "Bạn không thể trả giá thấp hơn giá hiện tại + bước giá"
              : state.isOpenModallackOfMoney
              ? "Bạn không đủ tiền cọc, bạn có muốn nạp thêm tiền để tiếp tục đấu giá?"
              : `Bạn có muốn đấu sản phẩm với giá ${new Intl.NumberFormat(
                  "de-DE"
                ).format(state.bidAmount)} VNĐ ${
                  IsFirstBid &&
                  auctionDetail?.depositAmount &&
                  auctionDetail?.depositAmount > 0
                    ? `và tiền cọc sẽ là ${new Intl.NumberFormat(
                        "de-DE"
                      ).format(auctionDetail?.depositAmount ?? 0)} VNĐ`
                    : ""
                } không?`}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          {(state.isOpenModalConfirmBid || state.isOpenModallackOfMoney) && (
            <Button
              style={{
                width: 120,
                marginRight: 20,
                border: "1px solid #164D9E",
                color: "#164D9E",
              }}
              key="no"
              onClick={() =>
                setState({
                  ...state,
                  isOpenModalInvalidAmount: false,
                  isOpenModalConfirmBid: false,
                  isOpenModallackOfMoney: false,
                })
              }
            >
              Không
            </Button>
          )}
          <Button
            style={{ width: 120, marginLeft: 20 }}
            mergetype="primary"
            key="submit"
            onClick={handleClickOkModal}
          >
            {state.isOpenModalInvalidAmount ? "Đồng ý" : "Có"}
          </Button>
        </div>
      </Modal>

      <Modal
        centered
        open={state.isOpenModalPayment || state.isOpenModalSetupAutoBid}
        onCancel={() => {
          setState({
            ...state,
            isOpenModalPayment: false,
            isOpenModalSetupAutoBid: false,
          });
          setAtTimeStamp(0);
          setQrLink("");
        }}
        footer=""
        closable={true}
      >
        {autoBid ? (
          <div style={{ justifyItems: "center", display: "grid" }}>
            <Heading as="h2">Bạn có muốn hủy đấu tự động không?</Heading>
          </div>
        ) : (
          <Form name="formPayment" form={form} ref={formRef}>
            {state.isOpenModalPayment && (
              <>
                <Form.Item
                  name="Amount"
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Số tiền nạp
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateTrigger="onChange"
                  rules={[
                    {
                      required: true,
                      message: "Số tiền nạp không được để trống",
                    },
                  ]}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      style={{ fontSize: "15px" }}
                      className="custom-input"
                      type="number"
                      step={10000}
                      min={10000}
                    />
                    <Button
                      style={{
                        width: 100,
                        backgroundColor: "#01AA85",
                        color: "#FFF",
                        height: 33,
                      }}
                      onClick={handleClickGenQrCode}
                    >
                      Tạo mã qr
                    </Button>
                  </div>
                </Form.Item>
                {qrLink && (
                  <div style={{ textAlign: "center", userSelect: "none" }}>
                    <img
                      style={{ width: 500, height: 500 }}
                      alt=""
                      src={qrLink}
                    />
                  </div>
                )}
              </>
            )}
            {state.isOpenModalSetupAutoBid && (
              <>
                <Form.Item
                  name="MaxAmount"
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Số tiền muốn dừng lại
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateTrigger="onSubmit"
                  rules={[
                    {
                      required: true,
                      message: "Số tiền muốn dừng lại không được để trống",
                    },
                  ]}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      style={{ fontSize: "15px" }}
                      className="custom-input"
                      type="number"
                      step={10000}
                      min={10000}
                    />
                    <Button
                      style={{
                        width: 100,
                        backgroundColor: "#01AA85",
                        color: "#FFF",
                        height: 33,
                      }}
                      onClick={handleCreateAutoBid}
                    >
                      Tạo
                    </Button>
                  </div>
                </Form.Item>
              </>
            )}
          </Form>
        )}
        {autoBid && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Button
              style={{
                width: 120,
                marginLeft: 20,
                border: "1px solid #164D9E",
                color: "#164D9E",
              }}
              key="submit"
              onClick={() =>
                setState({
                  ...state,
                  isOpenModalPayment: false,
                  isOpenModalSetupAutoBid: false,
                })
              }
            >
              Không
            </Button>
            <Button
              style={{ width: 120, marginLeft: 20 }}
              mergetype="primary"
              key="submit"
              onClick={handleCancelAutoBid}
            >
              Có
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MultipurposeDetails1;
