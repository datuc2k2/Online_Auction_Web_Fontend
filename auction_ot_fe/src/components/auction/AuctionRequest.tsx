import React, {
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/RootReducer";
import Link from "next/link";
import {
  Table,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  Radio,
  Upload,
  UploadFile,
  Modal,
  Tooltip,
} from "antd";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { CommonLayout } from "@/layout/CommonLayout";
import { fetchListPayment } from "@/store/payment/Actions";
import moment from "moment";
import { useRouter } from "next/navigation";
import { fetchListAuction, auctionIsAccepted } from "@/store/auction/Actions";
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import Breadcrumb from "@/components/Breadcrumb/page";

import CustomTable from "@/components/custom-table/CustomTable";
import Image from "next/image";
import { FormInstance } from "antd/es/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
import { UploadProps } from "antd/es/upload";
import Picture from "../../../public/assets/img/svg/Picture.png";
import { UploadFileStatus } from "antd/lib/upload/interface";
import { Dispatch } from "redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

interface AuctionRequestProps {
  auction: any;
  setIsModalVisible: (value: any) => void;
  handleAccept: (id: number | null) => void;
  handleReject: (id: number | null) => void;
  setReason: (value: any) => void;
  reason: string;
  auctionMethod: boolean;
}

export default function AuctionRequest(props: AuctionRequestProps) {
  const {
    auction,
    setIsModalVisible,
    handleAccept,
    handleReject,
    setReason,
    reason,
    auctionMethod,
  } = props;
  const loading = useSelector((state: RootState) => state.auction.loading);
  const [state, setState] = React.useState({
    IsOpenModalConfirm: false,
    isReject: false,
    rejectReason: "",
  });
  console.log("auctionMethod : ", auctionMethod);
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
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

  const imgPostFix = process.env.NEXT_PUBLIC_IMAGE_POSTFIX;
  const timeAgo = calculateTimeAgo(auction.createdAt);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  // console.log('fileList: ',fileList);

  const uploadProps: UploadProps = {
    listType: "picture-card",
    fileList,
    showUploadList: { showRemoveIcon: false }, // Hide delete button
    onPreview: async (file) => {
      let src = file.url;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as Blob);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const imgWindow = window.open(src);
      imgWindow?.document.write(`<img src="${src}" style="max-width:100%;" />`);
    },
    beforeUpload: () => false, // Prevent uploading
  };

  useEffect(() => {
    if (auction?.auction?.auctionImages?.$values) {
      const imageArr: UploadFile[] = auction.auction.auctionImages.$values.map(
        (imageUrl: any, idx: number) => {
          return {
            uid: `${idx}`,
            name: `Image ${idx + 1}`,
            status: "done" as UploadFileStatus,
            url: `${imageUrl?.imageUrl}${imgPostFix}`,
          };
        }
      );
      setFileList(imageArr);
      // setAvatarUrl(accountListDataPaging.users.account?.userProfile?.avatar);
      setAvatarUrl(auction?.user?.userProfile?.avatar);
    }
  }, [auction]);
  console.log("avatar : ", avatarUrl);
  return (
    <div
      style={{
        marginBottom: 100,
        backgroundColor: "rgba(167, 199, 188, 0.21)",
        padding: "30px",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              minWidth: "70px",
              maxWidth: "70px",
              height: "70px",
              borderRadius: "50%",
            }}
            // src={
            //   typeof avatarUrl === "string"
            //     ? avatarUrl + process.env.NEXT_PUBLIC_IMAGE_POSTFIX
            //     : URL.createObjectURL(avatarUrl)
            // }
            src={avatarUrl + process.env.NEXT_PUBLIC_IMAGE_POSTFIX}
            // src="https://kenh14cdn.com/203336854389633024/2024/8/22/455244411184532823820391898827838649356309391n-17243116012201520162927-1724314602110-1724314603735192410636.jpg"
            alt="Uploaded"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "10px",
            }}
          >
            <a
              style={{
                fontWeight: "bold",
                fontSize: "17px",
              }}
            >
              {auction.user?.username}
            </a>
            <a
              style={{
                fontSize: "14px", // Bạn có thể điều chỉnh kích thước font tùy ý
                color: "#555", // Thay đổi màu sắc nếu cần
              }}
            >
              {timeAgo}{" "}
              {auctionMethod ? (
                <FontAwesomeIcon icon={faUsers} />
              ) : (
                <FontAwesomeIcon
                  icon={faGlobe}
                  style={{
                    marginLeft: "5px",
                    fontSize: "16px",
                  }}
                />
              )}
              {/* <FontAwesomeIcon
                icon={faGlobe}
                style={{
                  marginLeft: "5px",
                  fontSize: "16px",
                }}
              /> */}
              {/* <FontAwesomeIcon icon={faUsers} /> */}
            </a>
          </div>
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {/* Col 1 */}
          <Col xs={24} md={24} lg={12} span={12}>
            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Tên sản phẩm <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    readOnly={true}
                    value={auction.auction.productName}
                    style={{
                      height: 45,
                      fontSize: "15px",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="custom-input"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Loại sản phẩm <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    readOnly={true}
                    value={auction.auction.categoryName}
                    style={{
                      height: 45,
                      fontSize: "15px",
                      backgroundColor: "#f5f5f5",
                    }}
                    className="custom-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Phương thức đấu giá{" "}
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Radio.Group
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "15px",
                    }}
                    value={auction.auction.isPrivate}
                  >
                    <Radio value={false}>Công khai</Radio>
                    <Radio value={true}>Nhóm kín</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="depositeAmount"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Tiền cọc <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      value={
                        auction.auction.depositAmount
                          ? auction.auction.depositAmount.toLocaleString(
                              "en-US"
                            )
                          : ""
                      }
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                        backgroundColor: "#f5f5f5",
                      }}
                      min={1}
                      type="text"
                      className="custom-input"
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontWeight: "bold",
                        color: "#888",
                      }}
                    >
                      VND
                    </span>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  name="startPrice"
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Giá khởi điểm <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                        backgroundColor: "#f5f5f5",
                      }}
                      value={
                        auction.auction.startingPrice
                          ? auction.auction.startingPrice.toLocaleString(
                              "en-US"
                            )
                          : ""
                      }
                      min={1}
                      type="text"
                      className="custom-input"
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontWeight: "bold",
                        color: "#888",
                      }}
                    >
                      VND
                    </span>
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  name="priceStep"
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Bước giá <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                        backgroundColor: "#f5f5f5",
                      }}
                      value={
                        auction.auction.stepPrice
                          ? auction.auction.stepPrice.toLocaleString("en-US")
                          : ""
                      }
                      min={1}
                      type="text"
                      className="custom-input"
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontWeight: "bold",
                        color: "#888",
                      }}
                    >
                      VND
                    </span>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  name="depositeAmount"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Phí tạo phiên <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                        backgroundColor: "#f5f5f5",
                      }}
                      // value={
                      //   auction.auction.depositAmount
                      //     ? auction.auction.depositAmount.toLocaleString(
                      //         "en-US"
                      //       )
                      //     : ""
                      // }
                      min={1}
                      type="number"
                      className="custom-input"
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontWeight: "bold",
                        color: "#888",
                      }}
                    >
                      VND
                    </span>
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  key={auction.auctionId}
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Hạn trả tiền cọc <span style={{ color: "red" }}> *</span>{" "}
                      <Tooltip title="Đây là hạn bạn phải xác nhận người chiến thắng đã thanh toán sau khi phiên kết thúc . Nếu người chiến thắng chưa thanh toán hãy liên lạc với chúng tôi để chúng tôi sẽ giúp đỡ bạn.">
                        <span
                          style={{
                            marginLeft: 8,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#1890ff"
                            width="23px"
                            height="23px"
                          >
                            <circle cx="12" cy="12" r="10" fill="#e6f7ff" />
                            <text
                              x="12"
                              y="16"
                              fontSize="14"
                              textAnchor="middle"
                              fill="#1890ff"
                              fontWeight="bold"
                            >
                              ?
                            </text>
                          </svg>
                        </span>
                      </Tooltip>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    style={{
                      height: 45,
                      paddingRight: 45,
                      fontSize: "15px",
                      backgroundColor: "#f5f5f5",
                    }}
                    value={
                      auction?.auction?.depositDeadline
                        ? moment(auction.auction.depositDeadline).format(
                            "DD-MM-YYYY HH:mm:ss"
                          ) // Định dạng ngày giờ theo ý bạn
                        : ""
                    }
                    min={1}
                    className="custom-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ height: "149px" }}>
              <Col span={11}>
                <Form.Item
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Thời gian bắt đầu <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    style={{
                      width: "100%",
                      height: 45,
                      fontSize: "15px",
                      backgroundColor: "#f5f5f5",
                    }}
                    value={
                      auction?.auction?.startTime
                        ? moment(auction.auction.startTime).format(
                            "DD-MM-YYYY HH:mm:ss"
                          ) // Định dạng ngày giờ theo ý bạn
                        : ""
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Ngày kết thúc <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    style={{
                      width: "100%",
                      height: 45,
                      fontSize: "15px",
                      backgroundColor: "#f5f5f5",
                    }}
                    value={
                      auction?.auction?.endTime
                        ? moment(auction.auction.endTime).format(
                            "DD-MM-YYYY HH:mm:ss"
                          ) // Định dạng ngày giờ theo ý bạn
                        : ""
                    }
                  />
                  {/* <Input type="date" /> */}
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Col 2 */}
          <Col xs={24} md={24} lg={12} span={12}>
            <div style={{ marginLeft: "42px", height: "100%" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: 20,
                }}
              >
                Ảnh sản phẩm (Tối đa 6 ảnh, ảnh đầu t iên sẽ là ảnh chính, các
                ảnh tiếp theo là ảnh phụ){" "}
                <span style={{ color: "red" }}> *</span>
              </span>
              <Form.Item
                name="mainImage"
                label={null}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{
                  marginTop: 33,
                  // border: "4px solid rgba(145, 175, 233, 0.1)",
                  borderRadius: "15px",
                  // padding: "40px",
                  // marginBottom: 50,
                }}
              >
                <style>
                  {`
                                .ant-upload {
                                    display: none;
                                }
                            `}
                </style>
                <Upload.Dragger {...uploadProps} multiple>
                  <p className="ant-upload-drag-icon">
                    <Image
                      src={Picture}
                      alt="avatar"
                      style={{ width: "94px", height: "94px" }}
                    />
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Thả hình ảnh của bạn tại đây, hoặc <a href="#">chọn</a>
                  </p>
                  <p>Hỗ trợ: PNG, JPG, JPEG, WEBP</p>
                </Upload.Dragger>
              </Form.Item>

              <div style={{ height: "76%" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    fontSize: "17px",
                  }}
                >
                  Miêu tả <span style={{ color: "red" }}> *</span>
                </label>
                <textarea
                  value={auction?.auction?.description || "Không có dữ liệu"}
                  style={{
                    // height: "calc(100% - 138px)",
                    height: 264,
                    width: "100%",
                    backgroundColor: "#f5f5f5",
                    padding: "11px",
                    fontSize: "15px",
                    marginTop: 11,
                  }}
                ></textarea>
                <div style={{ marginTop: "5px" }}>
                  <div style={{ display: "flex" }}>
                    {/* Button "Xác nhận" */}
                    <Button
                      style={{
                        width: 130,
                        backgroundColor: "#489077",
                        color: "#FFF",
                        marginTop: 10,
                        marginRight: 20,
                        flex: 1,
                      }}
                      onClick={() =>
                        setState({
                          ...state,
                          IsOpenModalConfirm: true,
                          isReject: false, // Xác định đây là modal xác nhận
                        })
                      }
                      disabled={loading}
                    >
                      Phê duyệt
                    </Button>

                    {/* Button "Từ chối" */}
                    <Button
                      style={{
                        width: 130,
                        backgroundColor: "#489077",
                        color: "#FFF",
                        marginTop: 10,
                        // marginRight: 20,
                        flex: 1,
                      }}
                      onClick={() =>
                        setState({
                          ...state,
                          IsOpenModalConfirm: true,
                          isReject: true, // Xác định đây là modal từ chối
                          rejectReason: "", // Đặt lý do từ chối rỗng ban đầu
                        })
                      }
                      disabled={loading}
                    >
                      Từ chối
                    </Button>

                    {/* Modal */}
                    <Modal
                      centered
                      open={state.IsOpenModalConfirm}
                      onCancel={() =>
                        setState({
                          ...state,
                          IsOpenModalConfirm: false,
                          rejectReason: "", // Reset lý do từ chối khi đóng modal
                        })
                      }
                      footer=""
                      closable={false}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#000",
                        }}
                      >
                        {state.isReject
                          ? "Bạn có muốn từ chối phiên đấu giá này không?"
                          : "Bạn có muốn phê duyệt phiên đấu giá này không?"}
                      </div>

                      {/* Textarea hiển thị khi từ chối */}
                      {state.isReject && (
                        <div style={{ marginTop: 20 }}>
                          <label style={{ fontWeight: 500, color: "#000" }}>
                            Lý do từ chối:
                          </label>
                          <textarea
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              padding: 10,
                              marginTop: 10,
                              fontSize: 14,
                            }}
                            placeholder="Nhập lý do từ chối..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Footer buttons */}
                      <div style={{ textAlign: "center", marginTop: 20 }}>
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
                              IsOpenModalConfirm: false,
                              rejectReason: "", // Reset lý do từ chối khi không thực hiện
                            })
                          }
                        >
                          Không
                        </Button>
                        <Button
                          style={{ width: 120, marginLeft: 20 }}
                          type="primary"
                          key="submit"
                          onClick={() => {
                            setState({
                              ...state,
                              IsOpenModalConfirm: false,
                              rejectReason: "", // Reset lý do từ chối sau khi xử lý
                            });

                            if (state.isReject) {
                              // Gửi lý do từ chối qua handleReject
                              handleReject(
                                auction?.auctionId
                                // state.rejectReason
                              );
                            } else {
                              // Gọi handleAccept khi xác nhận
                              handleAccept(auction?.auctionId);
                            }
                          }}
                        >
                          Có
                        </Button>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
