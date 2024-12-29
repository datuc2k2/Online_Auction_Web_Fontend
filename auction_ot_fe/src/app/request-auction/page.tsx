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
import "./RequestAuction.css";
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
  // const startPriceInput = Form.useWatch("startPrice", form);
  // const priceStepInput = Form.useWatch("priceStep", form);
  // const depositeAmountInput = Form.useWatch("depositeAmount", form);
  const [startPriceInput, setStartPriceInput] = useState(0);
  const [priceStepInput, setPriceStepInput] = useState(0);
  const [depositeAmountInput, setDepositeAmountInput] = useState(0);
  const startTimeInput = Form.useWatch("startTime", form);
  const endTimeInput = Form.useWatch("endTime", form);
  const depositDeadlineInput = Form.useWatch("depositeDeadline", form);
  const descriptionInput = Form.useWatch("description", form);
  const userInvitesInput = Form.useWatch("userInvites", form);
  console.log("userInvitesInput: ", userInvitesInput);
  const categoryData = useSelector(
    (state: RootState) => state.auction.categoryData
  );
  console.log("categoryData : ", categoryData);
  const auctionDetailForEdit = useSelector(
    (state: RootState) => state.auction.auctionDetailForEdit
  );
  const imagePostFix = process.env.NEXT_PUBLIC_IMAGE_POSTFIX;
  //useSelector((state: RootState) => state.auth.imgPostFix);

  // console.log("auctionDetailForEdit: ", auctionDetailForEdit);
  const [valueStartPrice, setvalueStartPrice] = useState("");
  const [valuePriceStep, setvaluePriceStep] = useState("");
  const [valueDepositeAmount, setValueDepositeAmount] = useState("");
  const [valueCreation, setValueCreation] = useState("");
  // Hàm định dạng số
  const formatCurrency = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Hàm xử lý khi nhập
  const handleInputChange1 = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    const input = e.target.value.replace(/,/g, "");
    if (!isNaN(input)) {
      setvalueStartPrice(formatCurrency(input));
    }
    setStartPriceInput(value);
    // Tính toán giá trị bước giá
    const startPrice = parseInt(value, 10);
    if (!isNaN(startPrice) && startPrice > 0) {
      const stepPrice = Math.floor(startPrice * 0.05); // Tính bước giá (5% và làm tròn xuống)
      setvaluePriceStep(stepPrice.toString()); // Chuyển về chuỗi để hiển thị
      setPriceStepInput(Math.floor(startPrice * 0.05));
    } else {
      setvaluePriceStep(""); // Xóa bước giá nếu giá trị không hợp lệ
    }

    // Tính toán giá trị tiền cọc
    if (!isNaN(startPrice) && startPrice > 0) {
      const depositeAmount = Math.floor(startPrice * 0.1);
      setValueDepositeAmount(depositeAmount.toString());
      setDepositeAmountInput(Number(depositeAmount)); // Chuyển valueDepositeAmount sang kiểu số
    } else {
      setValueDepositeAmount("");
    }
  };

  const handleInputChange2 = (e) => {
    const input = e.target.value.replace(/,/g, "");
    if (!isNaN(input)) {
      setvaluePriceStep(formatCurrency(input));
    }
  };
  const handleInputChange3 = (e) => {
    const input = e.target.value.replace(/,/g, "");
    if (!isNaN(input)) {
      setValueDepositeAmount(formatCurrency(input));
    }
  };
  const handleInputChange4 = (e) => {
    const input = e.target.value.replace(/,/g, "");
    if (!isNaN(input)) {
      setValueCreation(formatCurrency(input));
    }
  };

  const [state, setState] = useState({
    IsOpenModalLackInfo: false,
  });

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

  const viewMode = useMemo(() => {
    if (auctionDetailForEdit) {
      return auctionDetailForEdit?.aucStatus?.id !== 11;
    }
  }, [auctionDetailForEdit]);

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
  const [depositeAmount, setDepositeAmount] = useState("");
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
      formData.append(preFix + "Auction.Mode", "5");
      formData.append(preFix + "Auction.Currency", "VND");
      formData.append(preFix + "Auction.StartingPrice", startPriceInput + "");
      formData.append(preFix + "Auction.StepPrice", priceStepInput + "");
      formData.append(
        preFix + "Auction.DepositAmount",
        depositeAmountInput + ""
      );
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
    {
      label: auctionDetailForEdit
        ? "Chỉnh sửa yêu cầu phiên đấu giá"
        : "Yêu cầu phiên đấu giá",
    },
  ];
  return (
    <>
      {/* <div style={{ fontSize: 16 }}>
        <a href="">Đấu giá</a>
        {`<`}
        <a href="">
          {auctionDetailForEdit
            ? "Chỉnh sửa yêu cầu phiên đấu giá"
            : "Yêu cầu phiên đấu giá"}
        </a>
      </div> */}
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
          {auctionDetailForEdit
            ? "Chỉnh sửa yêu cầu phiên đấu giá"
            : "Yêu cầu phiên đấu giá"}
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
                    listHeight={155}
                    className="customSelect"
                    style={{ height: 45, fontSize: "15px", width: "100%" }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toString() ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    // optionLabelProp="label"
                    // aria-required
                    // disabled={viewMode}
                    // dropdownRender={(menu) => (
                    //   <div style={{ paddingTop: "9px" }}>{menu}</div>
                    // )}
                    onChange={(value) => {
                      // Cập nhật giá trị phí tạo phiên khi người dùng chọn loại sản phẩm
                      const selectedCategory = categoryData?.categories.find(
                        (c) => c.id === value
                      );
                      setDepositeAmount(selectedCategory?.value?.trim() || ""); // Cập nhật phí tạo phiên
                    }}
                  >
                    {categoryData?.categories?.map((c) => {
                      return (
                        <Option key={c.id} value={c.id} label={c.name}>
                          {c.name.trim()}{" "}
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
                    disabled={viewMode}
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
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      disabled={true}
                      style={{
                        color: "black",
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                        backgroundColor: "#f5f5f5", // Đổi màu nền cho rõ hơn
                      }}
                      type="text"
                      value={
                        valueDepositeAmount
                          ? Number(valueDepositeAmount).toLocaleString("en-US")
                          : ""
                      }
                      min={1}
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
                      disabled={viewMode}
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                      }}
                      type="text"
                      value={valueStartPrice}
                      onChange={handleInputChange1}
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
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      disabled={true} // Không cho người dùng chỉnh sửa Bước giá
                      style={{
                        color: "black",
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                        backgroundColor: "#f5f5f5", // Đổi màu nền cho rõ hơn
                      }}
                      type="text"
                      value={
                        valuePriceStep
                          ? Number(valuePriceStep).toLocaleString("en-US")
                          : ""
                      }
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
                  name="depositeAmount"
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
                      value={depositeAmount}
                      style={{
                        height: 45,
                        paddingRight: 45,
                        fontSize: "15px",
                      }}
                      min={1}
                      type="text"
                      className="custom-input"
                      // onChange={handleInputChange4}
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
                    disabled={viewMode}
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
                    disabled={viewMode}
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
                    onChange={(value) => {
                      if (value) {
                        const depositDeadline = value.clone().add(30, "days"); // Cộng thêm 30 ngày
                        form.setFieldsValue({
                          depositeDeadline: depositDeadline,
                        });
                      }
                    }}
                  />
                  {/* <Input type="date" /> */}
                </Form.Item>
              </Col>
            </Row>
            {/* <Row style={{ justifyContent: "space-between" }}>
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
                  rules={[
                    { required: true, message: "Tiền cọc không được để trống" },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <div style={{ position: "relative" }}>
                    <Input
                      disabled={viewMode}
                      // value={depositeAmountInput}
                      value={valueDepositeAmount}
                      onChange={handleInputChange3}
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
            </Row> */}
          </Col>

          {/* Col 2 */}
          <Col xs={24} md={24} lg={12} span={12}>
            <div style={{ marginLeft: "40px", whiteSpace: "nowrap" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",

                  marginBottom: 20,
                }}
              >
                Tải lên hình ảnh (Tối đa 6 ảnh, ảnh đầu tiên sẽ là ảnh chính,
                các ảnh tiếp theo là ảnh phụ){" "}
                <span style={{ color: "red" }}> *</span>
              </span>
              <Form.Item
                name="mainImage"
                label={null}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{
                  // border: "4px solid rgba(145, 175, 233, 0.1)",
                  borderRadius: "15px",
                  // padding: "40px",
                  // marginBottom: 62,
                  marginTop: 14,
                }}
                rules={[{ validator: validateImages }]}
              >
                <Upload.Dragger disabled={viewMode} {...uploadProps} multiple>
                  <p className="ant-upload-drag-icon" style={{ marginTop: 12 }}>
                    <Image
                      src={Picture}
                      alt="avatar"
                      style={{ width: "92px", height: "92px" }}
                    />
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Thả hình ảnh của bạn tại đây, hoặc <a href="#">chọn</a>
                  </p>
                  <p style={{ marginBottom: 25 }}>
                    Hỗ trợ: PNG, JPG, JPEG, WEBP
                  </p>
                </Upload.Dragger>
              </Form.Item>

              <Row style={{ marginTop: "34px" }}>
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
              {!viewMode && (
                // <Row>
                //   <Col span={24} style={{ textAlign: "end" }}>
                //     <Button
                //       style={{
                //         width: 130,
                //         backgroundColor: "#489077",
                //         color: "#FFF",
                //         marginTop: 10,
                //         marginRight: 20,
                //       }}
                //       onClick={() => router.push("/")}
                //       disabled={loading}
                //     >
                //       Hủy
                //     </Button>
                //     <Button
                //       style={{
                //         width: 130,
                //         backgroundColor: "#489077",
                //         color: "#FFF",
                //         marginTop: 10,
                //         marginBottom: 60,
                //       }}
                //       onClick={handleSave}
                //       loading={loading}
                //     >
                //       Gửi yêu cầu
                //     </Button>
                //   </Col>
                // </Row>
                <Row justify="center" style={{}}>
                  <Col
                    span={24}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      style={{
                        flex: 1,
                        marginRight: 10, // Khoảng cách giữa hai nút
                        backgroundColor: "#489077",
                        color: "#FFF",
                        height: 45, // Chiều cao đồng nhất
                      }}
                      onClick={() => router.push("/my-auctions")}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      style={{
                        flex: 1,
                        marginLeft: 10, // Khoảng cách giữa hai nút
                        backgroundColor: "#489077",
                        color: "#FFF",
                        height: 45,
                      }}
                      onClick={handleSave}
                      loading={loading}
                    >
                      Gửi yêu cầu
                    </Button>
                  </Col>
                </Row>
              )}
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
