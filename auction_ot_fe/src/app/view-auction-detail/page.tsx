"use client";
import { CommonLayout } from "@/layout/CommonLayout";
import payment from "../../../public/assets/img/svg/Rectangle 28.svg";
import {
  Form,
  Upload,
  Tooltip,
  Input,
  Modal,
  Row,
  Col,
  DatePicker,
  Select,
  Radio,
  UploadProps,
  UploadFile,
} from "antd";
import Picture from "../../../public/assets/img/svg/Picture.png";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { FormInstance } from "antd/es/form/Form";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { openNotification } from "@/utility/Utility";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/store/auth/Actions";
import { RootState } from "@/store/RootReducer";
import type { UploadChangeParam } from "antd/es/upload";
import {
  PictureOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
// import "./RequestAuction.css";
import {
  fetchAuctionDetail,
  fetchCategory,
  requestAnAuction,
} from "@/store/auction/Actions";
import { RequestAnAuctionModel } from "@/store/auction/Types";
import {
  callRequestAnAuctionApi,
  callRequestToUpdateAnAuctionApi,
} from "../../store/CallDirectAxios";
import TextArea from "antd/lib/input/TextArea";
import {
  fetchListAccount,
  fetchListAccountInviteErr,
  fetchListInviteAccount,
} from "@/store/account/Actions";
import { UploadFileStatus } from "antd/lib/upload/interface";
import Breadcrumb from "@/components/Breadcrumb/page";

function requestAuction() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance<any>>(null);
  const { Option } = Select;
  const nameInput = Form.useWatch("name", form);
  const categoryInput = Form.useWatch("category", form);
  const auctionMethodInput = Form.useWatch("auctionMethod", form);
  const auctionModeInput = Form.useWatch("auctionMode", form);
  const startPriceInput = Form.useWatch("startPrice", form);
  const priceStepInput = Form.useWatch("priceStep", form);
  const depositeAmountInput = Form.useWatch("depositeAmount", form);
  const startTimeInput = Form.useWatch("startTime", form);
  const endTimeInput = Form.useWatch("endTime", form);
  const depositDeadlineInput = Form.useWatch("depositeDeadline", form);
  const descriptionInput = Form.useWatch("description", form);
  const userInvitesInput = Form.useWatch("userInvites", form);
  console.log("userInvitesInput: ", userInvitesInput);

  const categoryData = useSelector(
    (state: RootState) => state.auction.categoryData
  );

  const auctionDetailForEdit = useSelector(
    (state: RootState) => state.auction.auctionDetailForEdit
  );

  const phiTaoPhien = useMemo(() => {
    if(auctionDetailForEdit && categoryData) {
      return categoryData?.categories?.find(c => c?.id == auctionDetailForEdit?.categoryId)?.value;
    }
  }, [categoryData, auctionDetailForEdit])

  function formatNumber(number) {
    const [integerPart, decimalPart] = number.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (!decimalPart || decimalPart === "00") {
      return formattedInteger;
    }
    return `${formattedInteger}.${decimalPart}`;
  }

  
  const imagePostFix = process.env.NEXT_PUBLIC_IMAGE_POSTFIX;
  //useSelector((state: RootState) => state.auth.imgPostFix);

  console.log("auctionDetailForEdit: ", auctionDetailForEdit);

  const [state, setState] = useState({
    IsOpenModalLackInfo: false,
  });
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
  const [mainImage, setMainImage] = useState(
    auctionDetailForEdit?.images.$values[0] + "" + imgPostFix
  );
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
  useEffect(() => {
    if (auctionDetailForEdit != undefined && auctionDetailForEdit != null) {
      if (mainImage) {
        if (!mainImage?.startsWith("http")) {
          setMainImage(auctionDetailForEdit?.images.$values[0] + imgPostFix);
        }
      }
      if (arrPrimaryImage?.length === 0) {
        setArrPrimaryImage([
          ...(auctionDetailForEdit?.images?.$values
            ?.slice(1)
            ?.map((i) => i + imgPostFix) || []),
        ]);
      }
    }
  }, [auctionDetailForEdit]);
  const [arrPrimaryImage, setArrPrimaryImage] = useState([
    ...(auctionDetailForEdit?.images?.$values
      ?.slice(1)
      ?.map((i) => i + imgPostFix) || []),
  ]);
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);

  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [fileNameList, setFileNameList] = useState<string[]>([]);
  console.log("fileNameList: ", fileNameList);

  useEffect(() => {
    if (id) {
      dispatch(fetchAuctionDetail(Number(id)));
    }
  }, [id]);

  const viewMode = true;

  const accountInvites = useSelector(
    (states: RootState) => states.account.accountInvites
  );

  useEffect(() => {
    fetchDataPageMount();
  }, []);

  useEffect(() => {
    if (myInfo) {
      if (
        !myInfo?.userProfile?.avatar ||
        !myInfo?.userProfile?.backIdCard ||
        !myInfo?.userProfile?.frontIdCard ||
        !myInfo?.userProfile?.cccd
      ) {
        setState({
          ...state,
          IsOpenModalLackInfo: true,
        });
      }
    }
  }, [myInfo]);

  const accountListExceptMe = useMemo(() => {
    const accountListReturn = accountInvites?.filter(
      (a) => a?.userId !== myInfo?.userId
    );
    return accountListReturn;
  }, [accountInvites]);

  useEffect(() => {
    if (auctionDetailForEdit) {
      formRef.current?.setFieldsValue({
        name: auctionDetailForEdit?.productName,
        category: auctionDetailForEdit?.categoryId,
        auctionMethod: auctionDetailForEdit?.isPrivate ? "private" : "public",
        auctionMode: auctionDetailForEdit?.mode,
        startPrice: auctionDetailForEdit?.startingPrice,
        priceStep: auctionDetailForEdit?.stepPrice,
        depositeAmount: auctionDetailForEdit?.depositAmount,
        startTime: auctionDetailForEdit?.startTime
          ? moment(auctionDetailForEdit.startTime)
          : null,
        endTime: auctionDetailForEdit?.endTime
          ? moment(auctionDetailForEdit.endTime)
          : null,
        depositeDeadline: auctionDetailForEdit?.depositDeadline
          ? moment(auctionDetailForEdit.depositDeadline)
          : null,
        description: auctionDetailForEdit?.description,
        userInvites: auctionDetailForEdit?.invitedIds?.$values,
      });

      const imageNameArr: any[] = [];
      const imageArr = auctionDetailForEdit?.images?.$values?.map(
        (img, idx) => {
          const imgSplit = img?.split("/");
          imageNameArr.push(imgSplit[imgSplit?.length - 1]);
          return {
            uid: idx + "",
            name: idx + "",
            status: "done" as UploadFileStatus,
            url: img + "?" + imagePostFix,
          };
        }
      );
      setFileList(imageArr);
      setFileNameList(imageNameArr);
    }
  }, [auctionDetailForEdit]);

  const fetchDataPageMount = () => {
    dispatch(fetchListInviteAccount());
    dispatch(fetchCategory());
  };

  const uploadProps: UploadProps = {
    listType: "picture-card",
    fileList,
    maxCount: 6, // Restrict to a maximum of 6 files
    onChange: ({ fileList: newFileList }) => {
      // Limit fileList to a maximum of 6 files
      if (auctionDetailForEdit) {
        const fileNameArr = newFileList.slice(0, 6)?.map((f, idx) => {
          if (
            ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(f?.name)
          )
            return fileNameList[idx];
          return f?.name;
        });
        setFileNameList([...fileNameArr]);
      }
      setFileList(newFileList.slice(0, 6) as UploadFile[]);
    },
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
      imgWindow?.document.write(`<img src="${src}" />`);
    },
    beforeUpload: (file) => {
      const isLt50MB = file.size / 1024 / 1024 < 50;
      if (!isLt50MB) {
        openNotification("error", "", "Không thể upload file >= 50Mb");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onRemove: (file) => {
      if (auctionDetailForEdit) {
        if (file?.url) {
          const fileName = new URL(file?.url ?? "").pathname.split("/").pop();
          const fileNameArr = fileNameList?.filter((fn) => fn != fileName);
          setFileNameList(fileNameArr);
        } else {
          const fileName = file?.name;
          const fileNameArr = fileNameList?.filter((fn) => fn != fileName);
          setFileNameList(fileNameArr);
        }
      }
    },
  };

  const validateStartTime = (_: any, value: any) => {
    if (!value) {
      return Promise.resolve();
    }
    const now = new Date();
    if (value.isAfter(now)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Thời điểm bắt đầu phải sau thời điểm hiện tại")
    );
  };

  const validateDepositDealineTime = (_: any, value: any) => {
    if (!value) {
      return Promise.resolve();
    }
    const now = new Date();
    if (value.isAfter(now)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Hạn trả tiền cọc phải sau thời điểm hiện tại")
    );
  };

  const validateEndTime = (_: any, value: any) => {
    if (!value) {
      return Promise.resolve();
    }

    const now = new Date();
    const startTime = new Date(startTimeInput);

    if (value.isAfter(now) && (!startTime || value.isAfter(startTime))) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error(
        "Thời điểm kết thúc phải sau thời điểm hiện tại và thời điểm bắt đầu"
      )
    );
  };

  const validateImages = () => {
    if (fileList?.length < 1) {
      return Promise.reject(new Error("Nhập ít nhất 1 ảnh"));
    }
    if (fileList?.length > 6) {
      return Promise.reject(new Error("Vượt quá số lượng cho phép"));
    }
    return Promise.resolve();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const formData = new FormData();

      let preFix = "";
      if (auctionDetailForEdit) {
        preFix = "Update";
      }

      formData.append(preFix + "Auction.UserID", myInfo?.userId + "");
      formData.append(preFix + "Auction.ProductName", nameInput);
      formData.append(preFix + "Auction.CategoryId", categoryInput);
      formData.append(
        preFix + "Auction.IsPrivate",
        auctionMethodInput === "public" ? "false" : "true"
      );
      formData.append(preFix + "Auction.Mode", auctionModeInput);
      formData.append(preFix + "Auction.Currency", "VND");
      formData.append(preFix + "Auction.StartingPrice", startPriceInput);
      formData.append(preFix + "Auction.StepPrice", priceStepInput);
      formData.append(preFix + "Auction.DepositAmount", depositeAmountInput);
      formData.append(
        preFix + "Auction.StartTime",
        startTimeInput?.format("YYYY-MM-DD HH:mm:ss")
      );
      formData.append(
        preFix + "Auction.EndTime",
        endTimeInput?.format("YYYY-MM-DD HH:mm:ss")
      );
      formData.append(preFix + "Auction.Description", descriptionInput);
      formData.append(
        preFix + "Auction.DepositDeadline",
        depositDeadlineInput?.format("YYYY-MM-DD HH:mm:ss")
      );
      // Append each file to FormData
      fileList.forEach((file) => {
        if (file.originFileObj && !file?.url) {
          if (auctionDetailForEdit) {
            formData.append("FilesToAdd", file.originFileObj);
          } else {
            formData.append("images", file.originFileObj);
          }
        }
      });

      if (auctionMethodInput === "private") {
        userInvitesInput?.map((id: number) => {
          formData.append(preFix + "Auction.InvitedIds", id + "");
        });
      }

      if (auctionDetailForEdit) {
        formData.append("UpdateAuction.AuctionID", id + "");
        fileNameList.forEach((fileName) => {
          formData.append("ExistingBlobNames", fileName);
        });
        callRequestToUpdateAnAuctionApi(
          formData,
          setLoading,
          callBackWhenSuccess
        );
      } else {
        callRequestAnAuctionApi(formData, setLoading, callBackWhenSuccess);
      }
    } catch (errorInfo) {}
  };

  const callBackWhenSuccess = () => {
    formRef.current?.resetFields();
    setFileList([]);
    router.push("/my-auctions");
  };

  const handleConfirmModal = () => {
    router.push("/account-details");
  };
  console.log("checkDạt : ", viewMode);
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Chi tiết phiên đấu giá" },
  ];
  return (
    <>
      <div style={{ marginTop: 50 }}>
        <Breadcrumb items={breadcrumbItems} />
        <h3
          style={{
            fontSize: "1.5em",
            fontWeight: "bold",
            color: "#333",
            margin: "20px 0",
            textAlign: "left",
            borderBottom: "2px solid #007bff",
            paddingBottom: "10px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Chi tiết phiên đấu giá
        </h3>
      </div>
      {/* <h3 style={{marginTop: 40}}>{ auctionDetailForEdit ? 'Chỉnh sửa yêu cầu phiên đấu giá' : 'Yêu cầu phiên đấu giá'}</h3> */}
      <Form
        name="requestAuction"
        form={form}
        layout="horizontal"
        requiredMark={false}
        colon={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
        ref={formRef}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 100, marginTop: 20 }}>
          {/* Col 1 */}
          <Col xs={24} md={24} lg={12} span={12}>
            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="name"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Tên sản phẩm <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Tên sản phầm không được để trống",
                    },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <Input
                    readOnly={true}
                    disabled={viewMode}
                    style={{ height: 45, fontSize: "15px" }}
                    className="custom-input"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="category"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Loại sản phẩm <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Loại sản phẩm không được để trống",
                    },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <Select
                    style={{ height: 45 }}
                    disabled={viewMode}
                    aria-readonly
                  >
                    {categoryData?.categories?.map((c) => {
                      return (
                        <Option
                          style={{ height: 45, fontSize: "15px" }}
                          value={c?.id}
                        >
                          {c?.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="auctionMethod"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Phương thức đấu giá{" "}
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Phương thức đấu giá không được để trống",
                    },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <Radio.Group
                    disabled={true}
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "15px",
                    }}
                  >
                    <Radio value="public">Công khai</Radio>
                    <Radio value="private">Nhóm kín</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="auctionMode"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Chế độ đấu giá <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Chế độ đấu giá không được để trống",
                    },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <Select
                    disabled={viewMode}
                    style={{ height: 45, fontSize: "15px" }}
                  >
                    {categoryData?.modes?.map((m) => {
                      return <Option value={m?.id}>{m?.name}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </Col> */}
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
                  rules={[{ required: true }]}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      disabled={viewMode}
                      // value={depositeAmountInput}
                      value={
                        depositeAmountInput
                          ? depositeAmountInput.toLocaleString("en-US")
                          : ""
                      }
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
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

            {auctionMethodInput === "private" && (
              <Form.Item
                name="userInvites"
                label={
                  <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                    Danh sách mời
                  </span>
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Danh sách mời không được để trống",
                  },
                ]}
                validateTrigger="onSubmit"
              >
                <Select
                  disabled={viewMode}
                  mode="multiple"
                  listHeight={155}
                  className="customSelect"
                  style={{ width: "100%", fontSize: "15px" }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  optionLabelProp="label"
                  aria-required
                >
                  {accountListExceptMe?.map((option) => (
                    <Select.Option
                      key={option.userId}
                      value={option.userId}
                      label={option.email}
                    >
                      {option.email}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Row style={{ justifyContent: "space-between" }}>
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="startPrice"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Giá khởi điểm <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Giá khởi điểm không được để trống",
                    },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      readOnly={true}
                      disabled={viewMode}
                      // value={startPriceInput}
                      value={
                        startPriceInput
                          ? startPriceInput.toLocaleString("en-US")
                          : ""
                      }
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
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
              <Col xs={24} md={11} span={11}>
                <Form.Item
                  name="priceStep"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Bước giá <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Bước giá không được để trống" },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      readOnly={true}
                      disabled={viewMode}
                      value={
                        priceStepInput
                          ? priceStepInput.toLocaleString("en-US")
                          : ""
                      }
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
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
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Phí tạo phiên
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      readOnly={true}
                      disabled={viewMode}
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                      }}
                      min={1}
                      type="text"
                      className="custom-input"
                      value={phiTaoPhien && formatNumber(phiTaoPhien + "")}
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
                  name="depositeDeadline"
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
                  validateTrigger="onSubmit"
                >
                  <DatePicker
                    inputReadOnly={true}
                    disabled={viewMode}
                    onFocus={(e) => e.preventDefault()}
                    open={false}
                    style={{
                      width: "100%",
                      height: 45,
                      fontSize: "15px",
                    }}
                    // placeholder="yyyy-mm-dd hh:mm:ss"
                    // format="YYYY-MM-DD HH:mm:ss"
                    //  placeholder="Giờ : phút : giây ngày - tháng - năm"
                    placeholder="dd-mm-yyyy hh:mm:ss"
                    format="DD-MM-YYYY HH:mm:ss"
                    showTime={true}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  name="startTime"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Thời gian bắt đầu <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Thời gian bắt đầu không được để trống",
                    },
                    { validator: validateStartTime },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <DatePicker
                    inputReadOnly={true}
                    disabled={viewMode}
                    onFocus={(e) => e.preventDefault()}
                    open={false}
                    style={{
                      width: "100%",
                      height: 45,
                      fontSize: "15px",
                    }}
                    // placeholder="yyyy-mm-dd hh:mm:ss"
                    // format="YYYY-MM-DD HH:mm:ss"
                    //  placeholder="Giờ : phút : giây ngày - tháng - năm"
                    placeholder="dd-mm-yyyy hh:mm:ss"
                    format="DD-MM-YYYY HH:mm:ss"
                    showTime={true}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  name="endTime"
                  label={
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                      Ngày kết thúc <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Ngày kết thúc không được để trống",
                    },
                    { validator: validateEndTime },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <DatePicker
                    inputReadOnly={true}
                    disabled={viewMode}
                    onFocus={(e) => e.preventDefault()}
                    open={false}
                    style={{
                      width: "100%",
                      height: 45,
                      fontSize: "15px",
                    }}
                    // placeholder="yyyy-mm-dd hh:mm:ss"
                    // format="YYYY-MM-DD HH:mm:ss"
                    //  placeholder="Giờ : phút : giây ngày - tháng - năm"
                    placeholder="dd-mm-yyyy hh:mm:ss"
                    format="DD-MM-YYYY HH:mm:ss"
                    showTime={true}
                    allowClear={false}
                  />
                  {/* <Input type="date" /> */}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item
                name="description"
                label={
                  <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                    Miêu tả <span style={{ color: "red" }}> *</span>
                  </span>
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Miêu tả không được để trống" },
                ]}
                validateTrigger="onSubmit"
                style={{ width: "100%" }}
              >
                <TextArea
                  disabled={viewMode}
                  className="custom-input"
                  style={{
                    height: "155px",
                    width: "100%",
                    fontSize: "15px",
                  }}
                />
              </Form.Item>
            </Row>
          </Col>

          {/* Col 2 */}
          <Col xs={24} md={24} lg={12} span={12}>
            <div
              className="auction-details-section pt-10 mb-10"
              style={{ padding: 0 }}
            >
              <div className="container-fluid">
                <div>
                  <div style={{ marginTop: 0 }}>
                    <div
                      style={{ marginRight: 0 }}
                      className="auction-details-img"
                    >
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
                        <div
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
                        </div>
                      </div>
                      <div
                        className="nav nav-pills"
                        id="v-pills-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <div className="swiper-wrapper">
                          <Row
                            style={{ width: "100%", marginTop: -9, gap: 15 }}
                          >
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
                                        data-bs-target={`#v-pills-img${
                                          index + 1
                                        }`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`v-pills-img${
                                          index + 1
                                        }`}
                                        aria-selected="true"
                                      >
                                        {videoPostFix.includes(
                                          img
                                            ?.split("?")[0]
                                            ?.split(".")
                                            ?.pop() || ""
                                        ) ? (
                                          <video
                                            style={{
                                              width: "170px",
                                              height: "134px",
                                            }}
                                            controls
                                          >
                                            <source
                                              src={img}
                                              type="video/mp4"
                                            />
                                          </video>
                                        ) : (
                                          <img
                                            style={{
                                              width: "170px",
                                              height: "134px",
                                            }}
                                            src={img}
                                            alt="Main image error"
                                          />
                                        )}
                                        {/* <img src={img} alt="error image detail" /> */}
                                      </button>
                                    </div>
                                  </Col>
                                </>
                              );
                            })}
                          </Row>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>{" "}
            </div>
          </Col>
        </Row>
      </Form>
      <Modal
        centered
        open={state.IsOpenModalLackInfo}
        onOk={() => handleConfirmModal}
        // onCancel={() => setState({ ...state, IsOpenModalLackInfo: false })}
        footer=""
        closable={false}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, color: "#000", fontWeight: 600 }}>
            Bạn chưa cập nhật đủ thông tin cá nhân để tạo yêu cầu phiên đấu giá
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            style={{ width: 120, marginLeft: 20 }}
            mergetype="primary"
            key="submit"
            onClick={handleConfirmModal}
          >
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default CommonLayout(React.memo(requestAuction));
