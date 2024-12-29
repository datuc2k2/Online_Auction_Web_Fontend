import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Badge, Dropdown, Menu, List, Typography, Button, Select, Modal, } from "antd";
import { faMoneyBill1 } from "@fortawesome/free-solid-svg-icons"; // Thêm biểu tượng ví
import Link from "next/link";
import { useSelector } from "react-redux";
import { useSignalR } from "@/app/posts/utils/SignalRContext";
import { NotificationServices } from "@/app/posts/services/notification";
import { DEFAULT_AVATAR } from "@/app/posts/utils/constant";
import { convertTime } from "@/app/posts/utils/convert_time";
import moment from "moment";
import { useRouter } from "next/navigation";
import { CacheReadNotification } from "@/app/posts/utils/cache_read_notification";
import * as signalR from "@microsoft/signalr";

const IconContainer = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMenuMessageOpen, setMenuMessageOpen] = useState(false);
  const myInfo = useSelector((states ) => states.auth.myInfo);
  console.log('myInfomyInfo icon: ',myInfo);
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [visibleMessage, setVisibleMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeMessageTab, setActiveMessageTab] = useState("user");
  const [notificationItems, setNotificationItems] = useState([]);
  const [auctionInvitation, setAuctionInvitation] = useState([]);
  const [amountNotification, setAmountNotification] = useState(0);
  const [readNotifications, setReadNotifications] = useState([]);
  const { notificationMessage } = useSignalR();

  const [chatAndMessage, setChatAndMessage] = useState({});
  console.log('chatAndMessage: ',chatAndMessage);
  
  const [userExceptMe, setUserExceptMe] = useState([]);
  const [adminExceptMe, setAdminExceptMe] = useState([]);

  const [currentChatWith, setCurrentChatWith] = useState({});
  const chatContainerRef = useRef(null);
  const [msgInput, setMsgInput] = useState('')
  const [imgInput, setImgInput] = useState('')
  const [connection, setConnection] = useState(null);
  const [userActiveIds, setUserActiveIds] = useState([]);

  const calculateTimeAgo = (createdAt) => {
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentChatWith]);

  const numberOfChatUnRead = useMemo(() => {
    let numberUnRead = 0;

    chatAndMessage?.ChatAdmin?.forEach((chat) => {
      for (let chatMes of chat.chatMessages || []) {
        if (chatMes?.isRead !== true && chatMes?.senderID !== myInfo?.userId) {
          numberUnRead++;
          return;
        }
      }
    });

    chatAndMessage?.ChatUser?.forEach((chat) => {
      for (let chatMes of chat.chatMessages || []) {
        if (chatMes?.isRead !== true && chatMes?.senderID !== myInfo?.userId) {
          numberUnRead++;
          return;
        }
      }
    });

    return numberUnRead;
  }, [chatAndMessage, myInfo]);

  const checkUnRead = (chat) => {
    for (let chatMes of chat.chatMessages || []) {
      if (chatMes?.isRead !== true && chatMes?.senderID !== myInfo?.userId) {
        return true;
      }
    }
    return false;
  };

  console.log("currentChatWith: ", JSON.stringify(currentChatWith));

  //Connect to ChatHub
  useEffect(() => {
    const userId = myInfo?.userId ? myInfo.userId : "0";
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_URL_DEV}chatHub?userId=${userId}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
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

          connection.on(
            "ReceiveNotifyNewMessage",
            (chatId, UserName, Avatar, contentToSave, SenderId, IsSender) => {
              console.log("AvatarAvatar: ", Avatar);

              const newMessage = {
                chatID: chatId,
                senderName: UserName,
                senderAvatar: Avatar,
                content: contentToSave,
                sendAt: new Date().toISOString(),
                isDeleted: false,
                senderID: SenderId,
              };

              // Functional update for chatAndMessage
              setChatAndMessage((prevChatAndMessage) => {
                let currentChat =
                  prevChatAndMessage?.ChatUser?.find(
                    (cu) => cu.chatId == chatId
                  ) ||
                  prevChatAndMessage?.ChatAdmin?.find(
                    (cu) => cu.chatId == chatId
                  );

                // Update currentChatWith state
                setCurrentChatWith((prevChatWith) => {
                  if (currentChat) {
                    return {
                      ...currentChat,
                      chatMessages: [
                        ...(currentChat?.chatMessages || []),
                        newMessage,
                      ],
                    };
                  } else {
                    return {
                      ...prevChatWith,
                      chatMessages: [
                        ...(prevChatWith?.chatMessages || []),
                        newMessage,
                      ],
                    };
                  }
                });

                const updatedChatUser = prevChatAndMessage?.ChatUser?.map(
                  (cu) => {
                    if (cu.chatId === chatId) {
                      return {
                        ...cu,
                        chatMessages: [...cu.chatMessages, newMessage],
                      };
                    }
                    return cu;
                  }
                );

                const updatedChatAdmin = prevChatAndMessage?.ChatAdmin?.map(
                  (cu) => {
                    if (cu.chatId === chatId) {
                      return {
                        ...cu,
                        chatMessages: [...cu.chatMessages, newMessage],
                      };
                    }
                    return cu;
                  }
                );

                return {
                  ...prevChatAndMessage,
                  ChatUser: updatedChatUser,
                  ChatAdmin: updatedChatAdmin,
                };
              });
            }
          );

          connection.on("IsRead", (ChatId) => {
            setChatAndMessage((prevState) => ({
              ChatAdmin: prevState?.ChatAdmin?.map((cam) =>
                cam?.chatId == ChatId
                  ? {
                      ...cam,
                      chatMessages: cam?.chatMessages?.map((cm) =>
                        cm?.senderID !== myInfo?.userId
                          ? { ...cm, isRead: true }
                          : cm
                      ),
                    }
                  : cam
              ),
              ChatUser: prevState?.ChatUser?.map((cam) =>
                cam?.chatId == ChatId
                  ? {
                      ...cam,
                      chatMessages: cam?.chatMessages?.map((cm) =>
                        cm?.senderID !== myInfo?.userId
                          ? { ...cm, isRead: true }
                          : cm
                      ),
                    }
                  : cam
              ),
            }));
          });

          connection.on("UserActiveIds", (Ids) => {
            setUserActiveIds(Ids);
          });
        })
        .catch((err) => console.error("SignalR connection error:", err));

      return () => {
        connection.off("ReceiveNotifyNewMessage");
        connection.off("IsRead");
        connection.off("UserActiveIds");
        connection.stop().then(() => console.log("SignalR connection stopped"));
      };
    }
  }, [connection]);

  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const readNotifications = CacheReadNotification.getAllReadNotifications();
    setReadNotifications(readNotifications);
  }, [readNotifications.length]);

  useEffect(() => {
    if (notificationMessage) {
      const payload = JSON.parse(notificationMessage);
      console.log("payload of notification", payload);
      const newNotificationMessage = {
        id: Math.floor(Math.random() * 1000) + 9000,
        content: payload.content,
        time: new Date().toISOString(),
      };

      console.log("newNotificationMessage", newNotificationMessage);
      const updatedNotificationItems = [
        newNotificationMessage,
        ...notificationItems,
      ];
      const top10NotificationItems = updatedNotificationItems.slice(0, 10);
      setNotificationItems(top10NotificationItems);
      setAmountNotification(updatedNotificationItems.length);
    }
  }, [notificationMessage]);

  useEffect(() => {
    fetchNotifications();
  }, [notificationMessage]);

  useEffect(() => {
    fetchAuctionInvitation();
    if (myInfo) {
      fetchChatAndMessage();
      fetchUserExceptMe();
      fetchAdminExceptMe();
    }
  }, []);

  const fetchAuctionInvitation = async () => {
    const response = await NotificationServices.getAuctionInvitationByUserId(
      myInfo?.userId
    );
    setAuctionInvitation(response);
  };

  const fetchChatAndMessage = async () => {
    const response = await NotificationServices.getAllChatAndMessage(
      myInfo?.userId
    );
    setChatAndMessage(response);
    return response;
  };

  const fetchUserExceptMe = async () => {
    const response = await NotificationServices.getUserExceptMe(myInfo?.userId);
    setUserExceptMe(response);
  };

  const fetchAdminExceptMe = async () => {
    const response = await NotificationServices.getAdminExceptMe(
      myInfo?.userId
    );
    setAdminExceptMe(response);
  };

  const fetchNotifications = useCallback(async () => {
    //.TODO: mở comment đoạn này ra để check user id
    // if (!myInfo) return;
    //: TODO: để UserID vào đây để lấy đúng notification, hãy cập nhật lại param là myInfo.userId

    const response = await NotificationServices.getNotificationsByUserId(
      myInfo?.userId
    );
    console.log("response of fetchNotifications", response);

    const top10NotificationItems = response.slice(0, 10);
    setNotificationItems(top10NotificationItems);
    setAmountNotification(response.length);
  }, []);

  const handleIconClick = () => {
    setVisible(!visible);
  };

  const handleIconMessageClick = () => {
    setVisibleMessage(!visibleMessage);
  };

  const handleClickConfirm = async (invitationId, isAccept) => {
    const objSubmit = {
      InvitationId: invitationId,
      AcceptOrReject: isAccept,
    };
    const response = await NotificationServices.acceptAuctionInvitation(
      objSubmit
    );
    fetchAuctionInvitation();
  };

  const handleClickChooseUserChatWith = async (e) => {
    if (myInfo) {
      await NotificationServices.addChat(myInfo?.userId, e);
      const response = await fetchChatAndMessage();
      console.log("responseresponse: ", response);

      const currentChat =
        activeMessageTab == "user"
          ? response?.ChatUser?.find((c) => c.userIdWith == e)
          : response?.ChatAdmin?.find((c) => c.userIdWith == e);
      setCurrentChatWith(currentChat);
      setMenuMessageOpen(false);

      //Set IsRead
      await NotificationServices.setIsReadForUser(
        e,
        currentChat?.chatId,
        myInfo?.userId
      );
    }
  };

  const handleClickChatToUserDisp = async (e) => {
    if (myInfo) {
      const currentChat =
        activeMessageTab == "user"
          ? chatAndMessage?.ChatUser?.find((c) => c.userIdWith == e)
          : chatAndMessage?.ChatAdmin?.find((c) => c.userIdWith == e);
      setCurrentChatWith(currentChat);
      setMenuMessageOpen(false);

      //Set IsRead
      await NotificationServices.setIsReadForUser(
        e,
        currentChat?.chatId,
        myInfo?.userId
      );
    }
  };

  const IsGreatorThan1Minute = (first, second) => {
    const firstD = new Date(first);
    const secondD = new Date(second);

    const differenceInMs = secondD - firstD;

    const differenceInMinutes = differenceInMs / (1000 * 60);

    if (differenceInMinutes > 1) {
      return true;
    } else {
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (msgInput || imgInput) {
      await NotificationServices.addChatMessage(
        currentChatWith?.chatId,
        myInfo?.userId,
        msgInput,
        imgInput
      );
      setMsgInput("");
      setImgInput("");
    }
  };

  const handleClickChooseImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setImgInput(file);
      }
    };
    fileInput.click();
  };

  var isCurrentUserChatWithActive = userActiveIds?.includes(
    currentChatWith?.userIdWith + ""
  );

  return (
    <div style={styles.container}>
      <Dropdown
        overlay={
          <div
            style={{
              width: 330,
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Nhắn tin</h3>

            <div style={{ marginBottom: 10 }}>
              <Select
                placeholder="Chọn người dùng để nhắn tin"
                listHeight={155}
                className="custom-select"
                style={{ width: "100%", fontSize: "15px" }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                optionLabelProp="label"
                aria-required
                value={""}
                onChange={handleClickChooseUserChatWith}
              >
                {activeMessageTab == "user"
                  ? userExceptMe?.map((option) => (
                      <Select.Option
                        key={option.userId}
                        value={option.userId}
                        label={option.userName}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <img
                            src={`${
                              option.userAvatar +
                              process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                            }`}
                            alt="avatar"
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              marginRight: 12,
                            }}
                          />
                          {option.userName}
                        </div>
                      </Select.Option>
                    ))
                  : adminExceptMe?.map((option) => (
                      <Select.Option
                        key={option.userId}
                        value={option.userId}
                        label={option.userName}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <img
                            src={`${
                              option.userAvatar +
                              process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                            }`}
                            alt="avatar"
                            style={{
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              marginRight: 12,
                            }}
                          />
                          {option.userName}
                        </div>
                      </Select.Option>
                    ))}
              </Select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "10px",
              }}
            >
              <span
                onClick={() => setActiveMessageTab("user")}
                style={{
                  fontWeight: activeMessageTab === "user" ? "600" : "normal",
                  backgroundColor:
                    activeMessageTab === "user" ? "#ebf5ff" : "transparent",
                  color: activeMessageTab === "user" ? "#0064d1" : "#000",
                  padding: "2px 8px",
                  borderRadius: "16px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Người dùng
              </span>
              <span
                onClick={() => setActiveMessageTab("admin")}
                style={{
                  fontWeight: activeMessageTab === "admin" ? "600" : "normal",
                  backgroundColor:
                    activeMessageTab === "admin" ? "#ebf5ff" : "transparent",
                  color: activeMessageTab === "admin" ? "#0064d1" : "#000",
                  padding: "2px 8px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Quản trị viên
              </span>
            </div>

            {activeMessageTab === "user" ? (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: `${
                    chatAndMessage?.ChatUser?.length > 5 ? "auto" : "hidden"
                  }`,
                  overflowX: "hidden",
                }}
              >
                <List
                  dataSource={chatAndMessage?.ChatUser}
                  renderItem={(item) => {
                    var isText =
                      item?.chatMessages[
                        item?.chatMessages?.length - 1
                      ]?.content?.split("|/|")?.length == 1;
                    var unRead = checkUnRead(item);
                    var isActive = userActiveIds?.includes(
                      item?.userIdWith + ""
                    );
                    return (
                      <List.Item
                        key={item.id}
                        style={{
                          padding: "8px 10px",
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleClickChatToUserDisp(item?.userIdWith)
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                                position: "relative",
                              }}
                            >
                              <img
                                src={`${
                                  item.userAvatarWidth +
                                  process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                }`}
                                alt="avatar"
                                style={{
                                  borderRadius: "50%",
                                  width: "40px",
                                  height: "40px",
                                }}
                              />
                              {isActive && (
                                <div
                                  style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    backgroundColor: "green",
                                    position: "absolute",
                                    bottom: -3,
                                    right: -3,
                                  }}
                                ></div>
                              )}
                            </div>
                          }
                          title={
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              {item.userNameWith}
                            </span>
                          }
                          description={
                            <div
                              style={{
                                color: "#888",
                                fontSize: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "160px",
                                  color: unRead ? "#000" : "#888888",
                                  fontWeight: unRead ? 600 : 500,
                                }}
                              >
                                {isText
                                  ? item?.chatMessages[
                                      item?.chatMessages?.length - 1
                                    ]?.content
                                  : "Hình ảnh"}
                              </span>
                              {/* <span style={{color: unRead ? '#000' : '#888888', fontWeight: unRead ? 600 : 500,}}>{ moment(item?.chatMessages[item?.chatMessages?.length - 1]?.sendAt).format('DD-MM-YYYY hh:mm')}</span> */}
                              <span
                                style={{
                                  color: unRead ? "#000" : "#888888",
                                  fontWeight: unRead ? 600 : 500,
                                }}
                              >
                                {calculateTimeAgo(
                                  item?.chatMessages[
                                    item?.chatMessages?.length - 1
                                  ]?.sendAt
                                )}
                              </span>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: `${
                    chatAndMessage?.ChatUser?.length > 5 ? "auto" : "hidden"
                  }`,
                  overflowX: "hidden",
                }}
              >
                <List
                  dataSource={chatAndMessage?.ChatAdmin}
                  renderItem={(item) => {
                    var isText =
                      item?.chatMessages[
                        item?.chatMessages?.length - 1
                      ]?.content?.split("|/|")?.length == 1;
                    var unRead = checkUnRead(item);
                    var isActive = userActiveIds?.includes(
                      item?.userIdWith + ""
                    );
                    return (
                      <List.Item
                        key={item.id}
                        style={{
                          padding: "8px 10px",
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleClickChatToUserDisp(item?.userIdWith)
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                height: "100%",
                                position: "relative",
                              }}
                            >
                              <img
                                src={`${
                                  item.userAvatarWidth +
                                  process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                }`}
                                alt="avatar"
                                style={{
                                  borderRadius: "50%",
                                  width: "40px",
                                  height: "40px",
                                }}
                              />
                              {isActive && (
                                <div
                                  style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    backgroundColor: "green",
                                    position: "absolute",
                                    bottom: -3,
                                    right: -3,
                                  }}
                                ></div>
                              )}
                            </div>
                          }
                          title={
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                              }}
                            >
                              {item.userNameWith}
                            </span>
                          }
                          description={
                            <div
                              style={{
                                color: "#888",
                                fontSize: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "160px",
                                  color: unRead ? "#000" : "#888888",
                                  fontWeight: unRead ? 600 : 500,
                                }}
                              >
                                {isText
                                  ? item?.chatMessages[
                                      item?.chatMessages?.length - 1
                                    ]?.content
                                  : "Hình ảnh"}
                              </span>
                              {/* <span
                                style={{
                                  color: unRead ? "#000" : "#888888",
                                  fontWeight: unRead ? 600 : 500,
                                }}
                              >
                                {moment(
                                  item?.chatMessages[
                                    item?.chatMessages?.length - 1
                                  ]?.sendAt
                                ).format("DD-MM-YYYY hh:mm")}
                              </span> */}
							  <span
                                style={{
                                  color: unRead ? "#000" : "#888888",
                                  fontWeight: unRead ? 600 : 500,
                                }}
                              >
                                {calculateTimeAgo(
                                  item?.chatMessages[
                                    item?.chatMessages?.length - 1
                                  ]?.sendAt
                                )}
                              </span>

                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </div>
            )}
          </div>
        }
        visible={isMenuMessageOpen}
        onVisibleChange={(flag) => setMenuMessageOpen(flag)}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div style={styles.iconWrapper} onClick={handleIconMessageClick}>
          <Badge count={numberOfChatUnRead}>
            <FontAwesomeIcon icon={faFacebookMessenger} style={styles.icon} />
          </Badge>
        </div>
      </Dropdown>

      <Dropdown
        overlay={
          <div
            style={{
              width: 330,
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Thông báo</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "10px",
              }}
            >
              <span
                onClick={() => setActiveTab("all")}
                style={{
                  fontWeight: activeTab === "all" ? "600" : "normal",
                  backgroundColor:
                    activeTab === "all" ? "#ebf5ff" : "transparent",
                  color: activeTab === "all" ? "#0064d1" : "#000",
                  padding: "2px 8px",
                  borderRadius: "16px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Tất cả
              </span>
              <span
                onClick={() => setActiveTab("invitation")}
                style={{
                  fontWeight: activeTab === "invitation" ? "600" : "normal",
                  backgroundColor:
                    activeTab === "invitation" ? "#ebf5ff" : "transparent",
                  color: activeTab === "invitation" ? "#0064d1" : "#000",
                  padding: "2px 8px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Lời mời tham gia đấu giá
              </span>
            </div>

            {activeTab === "all" ? (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: `${
                    notificationItems.length > 5 ? "auto" : "hidden"
                  }`,
                  overflowX: "hidden",
                }}
              >
                <List
                  dataSource={notificationItems}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      style={{
                        padding: "8px 10px",
                        alignItems: "flex-start",
                        backgroundColor: ` ${
                          item?.isRead ? "#ffffff" : "#d1d5db"
                        }`,
                      }}
                      onClick={async () => {
                        await NotificationServices.setNotificationAsRead(
                          item.id
                        );
                        setNotificationItems((prev) =>
                          prev.map((i) => {
                            if (i.id === item.id) {
                              i.isRead = true;
                            }
                            return i;
                          })
                        );
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <img
                              src={"/assets/img/logo.png"}
                              alt="avatar"
                              style={{
                                borderRadius: "50%",
                                width: "60px",
                                height: "60px",
                              }}
                            />
                          </div>
                        }
                        title={
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            {item.title}
                          </span>
                        }
                        description={
                          <div
                            style={{
                              color: "#888",
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "160px",
                              }}
                            >
                              {item.content}
                            </span>
                            <span>{item.time}</span>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              //   invitationId: number;
              // auctionId: number;
              // invitedUserId: number;
              // isAccepted: boolean | null;
              // invitedAt: string | null;
              // acceptedAt: string | null;
              // inviterId: number;
              // inviterAvatar: string;
              <List
                dataSource={auctionInvitation}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      padding: "8px 10px",
                      alignItems: "flex-start",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        cursor: item?.isAccepted ? "pointer" : "",
                      }}
                      onDoubleClick={() =>
                        item?.isAccepted
                          ? router.push(
                              "/auction-details?auctionId=" + item?.auctionId
                            )
                          : ""
                      }
                    >
                      <img
                        src={`${
                          item?.inviterAvatar +
                          process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                        }`}
                        alt="avatar"
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: item?.isAccepted
                              ? "#489077"
                              : item?.isAccepted == false
                              ? "#B90101"
                              : "",
                          }}
                        >
                          {item.inviterName} đã mời bạn tham gia đấu giá?
                        </span>
                        <div style={{ color: "#888", fontSize: "12px" }}>
                          {moment(item.invitedAt).format("DD-MM-YYYY hh:mm")}
                        </div>
                      </div>
                    </div>
                    {/* Các nút xác nhận và xóa đặt ở dưới */}
                    {item?.isAccepted == null && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "8px",
                          width: "100%",
                        }}
                      >
                        <Button
                          style={{ fontSize: "12px", flex: 1 }}
                          onClick={() =>
                            handleClickConfirm(item?.invitationId, false)
                          }
                        >
                          Từ chối
                        </Button>
                        <Button
                          type="primary"
                          style={{ fontSize: "12px", flex: 1 }}
                          onClick={() =>
                            handleClickConfirm(item?.invitationId, true)
                          }
                        >
                          Xác nhận
                        </Button>
                      </div>
                    )}
                  </List.Item>
                )}
                style={{
                  maxHeight: "300px", // Limit the height
                  overflowY: "auto", // Enable vertical scrolling
                }}
              />
            )}
          </div>
        }
        visible={isMenuOpen}
        onVisibleChange={(flag) => setMenuOpen(flag)}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div style={styles.iconWrapper} onClick={handleIconClick}>
          <Badge count={amountNotification}>
            <FontAwesomeIcon icon={faBell} style={styles.icon} />
          </Badge>
        </div>
      </Dropdown>
      <div className={`main-menu ${isMenuOpen ? "show-menu" : ""}`}>
        <ul className="menu-list">
          <li className={`menu-item-has-children`}>
            <div style={styles.iconWrapper}>
              <Link href="/payment">
                <FontAwesomeIcon icon={faMoneyBill1} style={styles.icon} />
              </Link>
            </div>
            <i
              className={`dropdown-icon `}
              onClick={() => collapseMenu("blog")}
            />
            <ul className={`sub-menu`}>
              <li>
                <Link href="/payment">Nạp tiền</Link>
              </li>
              {/* <li>
                <Link href="/L">Lịch sử giao dịch</Link>
              </li> */}
              <li>
                <Link href="">Ví : {myInfo && myInfo?.point} VND</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {currentChatWith && Object.keys(currentChatWith).length !== 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "80px",
            width: "350px",
            height: "420px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#8e24aa",
              color: "#fff",
              padding: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={`${
                    currentChatWith.userAvatarWidth +
                    process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                  }`}
                  alt="avatar"
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                  }}
                />
                {isCurrentUserChatWithActive && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: "green",
                      position: "absolute",
                      bottom: -3,
                      right: -3,
                    }}
                  ></div>
                )}
              </div>
              <div style={{ textAlign: "left", marginLeft: 8 }}>
                {currentChatWith?.userNameWith}
              </div>
            </div>

            <button
              // onClick={onClose}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => setCurrentChatWith({})}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f1f1f1",
            }}
            ref={chatContainerRef}
          >
            {currentChatWith?.chatMessages?.map((msg, index) => {
              const currentTimestamp = new Date(msg.sendAt);
              const previousMessage = currentChatWith.chatMessages[index - 1];
              const previousTimestamp = previousMessage
                ? new Date(previousMessage.sendAt)
                : null;
              const nextMessage = currentChatWith.chatMessages[index + 1];
              const nextTimestamp = nextMessage
                ? new Date(nextMessage.sendAt)
                : null;
              const isLastMessage =
                !nextMessage || msg.senderID !== nextMessage.senderID;
              const isSameSender = previousMessage
                ? msg.senderID === previousMessage.senderID
                : false;
              const showAvatar =
                isLastMessage ||
                (isSameSender &&
                  currentTimestamp - previousTimestamp > 60 * 1000) ||
                (isSameSender && nextTimestamp - currentTimestamp > 60 * 1000);

              const currentDate = new Date();
              const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
              const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

              const isSendAtToday =
                currentTimestamp >= startOfDay && currentTimestamp <= endOfDay;

              const IsGreatorThan5Min =
                currentTimestamp - previousTimestamp > 60 * 1000 * 5;

              const msgSplit = msg.content
                ?.split("|/|")
                ?.filter((m) => m != "");
              let type = 1; // Default type: 1 (text)
              // Check if msgSplit is defined and has elements
              if (msgSplit && msgSplit.length === 1) {
                if (msgSplit[0].startsWith("http")) {
                  type = 2; // Type 2: image
                }
              } else if (msgSplit && msgSplit.length > 1) {
                type = 3; // Type 3: image + text
              }
              console.log("msgSplit: ", index, +": ", msgSplit);

              const msgDisplay = (
                <div>
                  {type == 1 ? (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: "15px",
                        backgroundColor:
                          msg.senderID === myInfo?.userId
                            ? "#007bff"
                            : "#e4e6eb",
                        color:
                          msg.senderID === myInfo?.userId ? "#fff" : "#000",
                        fontSize: "12px",
                      }}
                    >
                      {msgSplit[0]}
                    </span>
                  ) : type == 2 ? (
                    // <span
                    // 	style={{
                    // 		display: "inline-block",
                    // 		padding: "8px 12px",
                    // 		borderRadius: "15px",
                    // 		backgroundColor:
                    // 			msg.senderID === myInfo?.userId ? "#007bff" : "#e4e6eb",
                    // 		color: msg.senderID === myInfo?.userId ? "#fff" : "#000",
                    // 		fontSize: "12px",
                    // 	}}
                    // >
                    <a
                      href={`${
                        msgSplit[0] + process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${
                          msgSplit[0] + process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                        }`}
                        alt="image"
                        style={{
                          width: "80px",
                          borderRadius: 4,
                        }}
                      />
                    </a>
                  ) : (
                    // </span>
                    <div>
                      <a
                        href={`${
                          msgSplit[1] + process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`${
                            msgSplit[1] + process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                          }`}
                          alt="image"
                          style={{
                            width: "80px",
                            borderRadius: 4,
                          }}
                        />
                      </a>
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "15px",
                          backgroundColor:
                            msg.senderID === myInfo?.userId
                              ? "#007bff"
                              : "#e4e6eb",
                          color:
                            msg.senderID === myInfo?.userId ? "#fff" : "#000",
                          fontSize: "12px",
                          marginTop: 2,
                        }}
                      >
                        {msgSplit[0]}
                      </div>
                    </div>
                  )}
                </div>
              );

              return (
                <div>
                  {IsGreatorThan5Min && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#657DB3",
                        fontSize: 12,
                      }}
                    >
                      {isSendAtToday
                        ? moment(msg.sendAt).format("hh:mm")
                        : moment(msg.sendAt).format("DD-MM-YYYY hh:mm")}
                    </div>
                  )}
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        msg.senderID === myInfo?.userId ? "end" : "start",
                    }}
                  >
                    {msg.senderID !== myInfo?.userId && showAvatar ? (
                      <img
                        src={`${
                          msg.senderAvatar +
                          process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                        }`}
                        alt="avatar"
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          marginRight: 12,
                        }}
                      />
                    ) : (
                      <div style={{ marginRight: 52 }}></div>
                    )}
                    <div
                      style={{
                        margin: "5px 0",
                        textAlign:
                          msg.senderID === myInfo?.userId ? "right" : "left",
                      }}
                    >
                      {msgDisplay}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}

          <div
            style={{
              borderTop: "1px solid #ddd",
              userSelect: "none",
            }}
          >
            {imgInput && (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginTop: "10px",
                  userSelect: "none",
                }}
              >
                <img
                  src={URL.createObjectURL(imgInput)}
                  alt="Selected"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "40px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginLeft: 10,
                  }}
                />
                <button
                  onClick={() => setImgInput(null)} // Clear the state to remove the image
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    userSelect: "none",
                  }}
                >
                  &times;
                </button>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Aa"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
              />
              <button
                type="button"
                style={{
                  backgroundColor: "#E4E6EB",
                  border: "none",
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  marginLeft: 4,
                }}
                onClick={handleClickChooseImage}
              >
                📎
              </button>
              <button
                onClick={handleSendMessage}
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#e5e7eb",
    borderRadius: "50%",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    fontSize: "24px",
    color: "#000",
    cursor: "pointer",
  },
};

export default IconContainer;
