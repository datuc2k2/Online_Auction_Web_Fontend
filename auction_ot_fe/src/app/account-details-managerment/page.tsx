"use client";
import { CommonLayout } from "@/layout/CommonLayout";
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
} from "antd";
import Image from "next/image";
import { callUpdateAccountManagerApi } from "@/store/CallDirectAxios";
import { fetchAccountDetailsManagerment } from "@/store/account/Actions";
import React, { useEffect, useRef, useState } from "react";
import { FormInstance } from "antd/es/form/Form";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccoutManager,
  fetchMyInfo,
  updateProfile,
} from "@/store/auth/Actions";
import Picture from "../../../../public/assets/img/logo.png";

import { RootState } from "@/store/RootReducer";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "@/components/Breadcrumb/page";
import { useNavigate } from "react-router-dom";
import { openNotification } from "@/utility/Utility";

function AccountDetailsManagerment() {
  const [form] = Form.useForm();
  const [formImage] = Form.useForm();
  const dispatch = useDispatch<any>();
  const formRef = useRef<FormInstance<any>>(null);
  const formImageRef = useRef<FormInstance<any>>(null);
  // const pathname = location.pathname;
  // const lastSegment = pathname.substring(pathname.lastIndexOf("?") + 1);
  // console.log("lastSegment : ", lastSegment);
  const isActive = Form.useWatch("IsActive", form);
  const emailInput = Form.useWatch("Email", form);
  const phoneNumberInput = Form.useWatch("PhoneNumber", form);
  const dateOfBirthInput = Form.useWatch("DateOfBirth", form);
  // const roleId = Form.useWatch("roleId",form);
  const adressInput = Form.useWatch("Address", form);
  const idetityNumberInput = Form.useWatch("IdetityNumber", form);
  // const avatarInput = Form.useWatch("Avatar", form);
  // const frontCardInput = Form.useWatch("frontCard", form);
  // const backCardInput = Form.useWatch("backCard", form);
  const pathname = location.href;

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const lastSegment = userId;

  const accountListDataPaging = useSelector(
    (states: RootState) => states.account.accountDetailManagermentData
  );
  useEffect(() => {
    getAccountDetailManagerment();
  }, []);
  const [state, setState] = useState({
    loadingApiCallDirect: false,
  });
  const loading = useSelector((states: RootState) => states.account.loading);
  const [backCardUrl, setBackCardUrl] = useState<any>(null);
  const fileInputAvatarRef = useRef<any>(null);
  const fileInputFrontCardRef = useRef<any>(null);
  const fileInputBackCardRef = useRef<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [frontCardUrl, setFrontCardUrl] = useState<any>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [roleId, setRoleId] = useState(0);

  const { Option } = Select;

  const getAccountDetailManagerment = () => {
    dispatch(
      fetchAccountDetailsManagerment({
        accountId: userId ?? "0",
        roleNew: 0,
        isActive: true,
      })
    );
  };
  const callBackWhenFinally = () => {
    setState({
      ...state,
      loadingApiCallDirect: false,
    });
  };
  useEffect(() => {
    if (accountListDataPaging) {
      formRef.current?.setFieldsValue({
        Name: accountListDataPaging?.users.account?.userProfile?.fullName,
        Email: accountListDataPaging?.users.account?.userProfile?.email,
        IsActive: accountListDataPaging?.users.account?.isActive,
        PhoneNumber:
          accountListDataPaging?.users.account?.userProfile?.phoneNumber,
        DateOfBirth: formatDateOfBirth(
          accountListDataPaging?.users.account?.userProfile?.dob
        ),
        Address: accountListDataPaging?.users.account?.userProfile?.address,
        IdetityNumber: accountListDataPaging?.users.account?.userProfile?.cccd,
        roleNew: roleId,
      });
      formImageRef.current?.setFieldsValue({
        frontCard:
          accountListDataPaging.users.account?.userProfile?.frontIdCard,
        backCard: accountListDataPaging.users.account?.userProfile?.backIdCard,
        Avatar: accountListDataPaging.users.account?.userProfile?.avatar,
      });
      if (accountListDataPaging.users.account?.userProfile?.avatar) {
        setAvatarUrl(accountListDataPaging.users.account?.userProfile?.avatar);
      }
      if (accountListDataPaging.users.account?.userProfile?.frontIdCard) {
        setFrontCardUrl(
          accountListDataPaging.users.account?.userProfile?.frontIdCard
        );
      }
      if (accountListDataPaging.users.account?.userProfile?.backIdCard) {
        setBackCardUrl(
          accountListDataPaging.users.account?.userProfile?.backIdCard
        );
      }
    }
  }, [form, accountListDataPaging]);
  const formatDateOfBirth = (dateString: string | null | undefined) => {
    return dateString ? moment(dateString) : null;
  };
  const handleSaveChange = async () => {
    try {
      form.validateFields();
      form.submit();
      const formData = new FormData();
      formData.append("accountId", `"${lastSegment ?? ""}"`);
      formData.append("roleNew", `"${roleId ?? "0"}"`);
      formData.append("isActive", isActive);
      // setState({
      //   ...state,
      //   loadingApiCallDirect: true,
      // });
      callUpdateAccountManagerApi(formData, () =>
        dispatch(fetchAccoutManager())
      );
    } catch (error) {
      console.error("Error while saving changes:", error);
      openNotification("error", "Lỗi", "Đã xảy ra lỗi khi lưu thay đổi.");
    }
  };

  const router = useRouter();
  const userRoles = accountListDataPaging?.users.account?.userRoles?.$values;
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    if (userRoles?.length) {
      const firstRoleId = userRoles[0].roleId; // Lấy roleId đầu tiên
      setRoleId(firstRoleId); // Cập nhật state roleId
    }
  }, [userRoles]);
  console.log("userRoles : ", roleId);

  const handleNavigate = (event) => {
    event.preventDefault();
    router.push(`/account-list`);
  };

  const base64ToBlob = (base64: string, type = "image/png") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Danh sách tài khoản", href: "/account-list" },
    { label: "Chi tiết tài khoản" },
  ];
  return (
    <>
      <div>
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
            Chi tiết người dùng
          </h3>
        </div>
        <div className="dashboard-section pt-50 mb-110">
          <div className="container">
            <div className="dashboard-wrapper">
              <Form
                name="formImage"
                form={formImage}
                // layout="horizontal"
                // requiredMark={false}
                // colon={false}
                // labelCol={{ span: 6 }}
                // labelAlign="left"
                ref={formImageRef}
              >
                <div className="dashboard-content-wrap two">
                  <div className="settings-wrap">
                    <Form name="accountDetails" form={form} ref={formRef}>
                      <div className="edit-info-area">
                        <h6>Ảnh đại diện</h6>
                        <div className="edit-profile-img-area">
                          <div className="profile-img">
                            <div className="profile-img">
                              <Form.Item
                                name="Avatar"
                                validateTrigger="onChange"
                              >
                                <div className="profile-img">
                                  <input
                                    ref={fileInputAvatarRef} // Attach the ref to the input
                                    style={{ display: "none" }} // Hide the default file input
                                    type="file"
                                    accept="image/*"
                                  />
                                  {!avatarUrl && (
                                    <img
                                      src={"/assets/img/avatar-default.jpg"}
                                      alt="Uploaded"
                                      style={{
                                        borderRadius: "50%",
                                      }}
                                    />
                                  )}
                                  {avatarUrl && (
                                    <img
                                      src={
                                        typeof avatarUrl === "string"
                                          ? avatarUrl +
                                            process.env
                                              .NEXT_PUBLIC_IMAGE_POSTFIX
                                          : URL.createObjectURL(avatarUrl)
                                      }
                                      alt="Uploaded"
                                    />
                                  )}
                                </div>
                              </Form.Item>
                            </div>
                          </div>
                          <div
                            className="col-md-6"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Form.Item
                              name="IsActive"
                              label={
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "17px",
                                  }}
                                >
                                  Trạng thái
                                </span>
                              }
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Radio.Group style={{ fontSize: "15px" }}>
                                <Radio value={true}>Hoạt động</Radio>
                                <Radio value={false}>Không hoạt động</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </div>
                          <div
                            className="col-md-3"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Form.Item
                              name="roleNew"
                              label={
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "17px",
                                  }}
                                >
                                  Vai trò
                                </span>
                              }
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                            >
                              <Select
                                onChange={(value) => setRoleId(value)} // Cập nhật roleId
                                placeholder="Chọn vai trò"
                                style={{
                                  width: "100%",
                                  backgroundColor: "#fff",
                                }}
                              >
                                <Option value={1}>Quản trị viên</Option>
                                <Option value={2}>Người dùng</Option>
                                <Option value={3}>Nhân viên</Option>
                              </Select>
                            </Form.Item>
                          </div>
                          {/* </div> */}
                        </div>
                      </div>

                      <div
                        className="edit-info-area"
                        style={{ marginTop: "30px" }}
                      >
                        <h6>Thông tin cá nhân</h6>
                        <div className="edit-info-form">
                          <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col-md-12">
                              <Form.Item
                                name="Name"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "17px",
                                    }}
                                  >
                                    Tên người dùng
                                  </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  style={{ fontSize: "15px" }}
                                  disabled
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                            <div className="col-md-12">
                              <Form.Item
                                name="Email"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "17px",
                                    }}
                                  >
                                    Email
                                  </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  style={{ fontSize: "15px" }}
                                  disabled
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                            <div className="col-md-12">
                              <Form.Item
                                name="PhoneNumber"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "17px",
                                    }}
                                  >
                                    Số điện thoại
                                  </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  style={{ fontSize: "15px" }}
                                  disabled
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                            <div className="col-md-12 ">
                              <Form.Item
                                name="DateOfBirth"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "17px",
                                    }}
                                  >
                                    Ngày sinh
                                  </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <DatePicker
                                  disabled
                                  style={{
                                    width: "100%",
                                    height: "40px",
                                    fontSize: "15px",
                                  }}
                                  format={"DD-MM-YYYY"}
                                />
                              </Form.Item>
                            </div>
                            <div className="col-md-12">
                              <Form.Item
                                name="Address"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "17px",
                                    }}
                                  >
                                    Địa chỉ
                                  </span>
                                }
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  style={{ fontSize: "15px" }}
                                  disabled
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                          </div>
                          {/* <button className="primary-btn btn-hover two">
                      Save Changes
                      <span style={{ top: "40.5px", left: "84.2344px" }} />
                    </button> */}
                        </div>
                      </div>
                      <div
                        className="edit-info-area"
                        style={{ marginTop: "30px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            style={{
                              margin: 0,
                              fontSize: "18px",
                              fontWeight: "700",
                            }}
                          >
                            Thông tin căn cước công dân
                          </h6>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            style={{
                              cursor: "pointer",
                              transition: "transform 0.2s",
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                            onClick={toggleExpand}
                          />
                        </div>
                        {isExpanded && (
                          <div className="edit-info-form">
                            <div className="row" style={{ marginTop: "20px" }}>
                              <div className="col-md-6">
                                <Form.Item
                                  name="IdetityNumber"
                                  label={
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                      }}
                                    >
                                      Số căn cước công dân{" "}
                                    </span>
                                  }
                                  labelCol={{ span: 24 }}
                                  wrapperCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Căn cước công dân không được để trống",
                                    },
                                  ]}
                                  validateTrigger="onChange"
                                >
                                  <Input
                                    style={{ fontSize: "15px" }}
                                    className="custom-input"
                                  />
                                </Form.Item>
                              </div>
                              <div className="col-md-6 ">
                                <Row gutter={[16, 0]} justify="end">
                                  <Col span={12}>
                                    <Form.Item
                                      name="frontCard"
                                      style={{
                                        borderRadius: "15px",
                                      }}
                                      // rules={[
                                      //   {
                                      //     required: true,
                                      //     message:
                                      //       "Mặt trước căn cước không được để trống",
                                      //   },
                                      // ]}
                                      validateTrigger="onChange"
                                    >
                                      <div
                                        style={{
                                          border:
                                            "4px dashed rgba(0, 0, 0, 0.5)",
                                          borderRadius: "15px",
                                          position: "relative",
                                          height: "162px",
                                          cursor: "pointer",
                                          textAlign: "center",
                                          width: "100%",
                                        }}
                                      >
                                        <input
                                          ref={fileInputFrontCardRef} // Attach the ref to the input
                                          style={{ display: "none" }} // Hide the default file input
                                          type="file"
                                          accept="image/*"
                                        />
                                        {!frontCardUrl && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "50%",
                                              left: "50%",
                                              transform:
                                                "translate(-50%, -50%)",
                                              color: "rgba(0, 0, 0, 0.5)",
                                              fontSize: "18px",
                                              width: "100%",
                                            }}
                                          >
                                            Mặt trước căn cước
                                          </div>
                                        )}
                                        {frontCardUrl && (
                                          <img
                                            src={
                                              typeof frontCardUrl ===
                                                "string" &&
                                              frontCardUrl.includes("iVBOR")
                                                ? `data:image/png;base64,${frontCardUrl}`
                                                : URL.createObjectURL(
                                                    frontCardUrl
                                                  )
                                            }
                                            alt="Uploaded"
                                            style={{
                                              height: "156px",
                                              width: "100%",
                                              borderRadius: "15px",
                                            }}
                                          />
                                        )}
                                      </div>
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                    <Form.Item
                                      name="backCard"
                                      style={{
                                        borderRadius: "15px",
                                      }}
                                      // rules={[
                                      //   {
                                      //     required: true,
                                      //     message:
                                      //       "Mặt sau căn cước không được để trống",
                                      //   },
                                      // ]}
                                      validateTrigger="onChange"
                                    >
                                      <div
                                        style={{
                                          border:
                                            "4px dashed rgba(0, 0, 0, 0.5)",
                                          borderRadius: "15px",
                                          position: "relative",
                                          height: "162px",
                                          cursor: "pointer",
                                          textAlign: "center",
                                          width: "100%",
                                        }}
                                      >
                                        <input
                                          ref={fileInputBackCardRef} // Attach the ref to the input
                                          style={{ display: "none" }} // Hide the default file input
                                          type="file"
                                          accept="image/*"
                                        />
                                        {!backCardUrl && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "50%",
                                              left: "50%",
                                              transform:
                                                "translate(-50%, -50%)",
                                              color: "rgba(0, 0, 0, 0.5)",
                                              fontSize: "18px",
                                              width: "100%",
                                            }}
                                          >
                                            Mặt sau căn cước
                                          </div>
                                        )}
                                        {backCardUrl && (
                                          <img
                                            src={
                                              typeof backCardUrl === "string" &&
                                              backCardUrl.includes("iVBOR")
                                                ? `data:image/png;base64,${backCardUrl}`
                                                : URL.createObjectURL(
                                                    backCardUrl
                                                  )
                                            }
                                            alt="Uploaded"
                                            style={{
                                              height: "156px",
                                              width: "100%",
                                              borderRadius: "15px",
                                            }}
                                          />
                                        )}
                                      </div>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                          marginTop: "30px",
                        }}
                      >
                        <Button
                          style={{
                            width: 130,
                            backgroundColor: "#01AA85",
                            color: "#FFF",
                            marginTop: 10,
                          }}
                          onClick={handleSaveChange}
                          loading={loading || state.loadingApiCallDirect}
                        >
                          Lưu thông tin
                        </Button>
                        <Button
                          style={{
                            width: 100,
                            backgroundColor: "#01AA85",
                            color: "#FFF",
                            marginTop: 10,
                          }}
                          onClick={() => router.push("/")}
                        >
                          Thoát
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommonLayout(React.memo(AccountDetailsManagerment));
