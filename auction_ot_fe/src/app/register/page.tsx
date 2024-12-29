"use client";
import { FC, useState } from "react";
import { Checkbox, Col, Form, Input, Row } from "antd";
import React from "react";
import changepass from "../../../public/assets/img/change_pass/ChangePassLogo.png";
import logo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { register, verify } from "@/store/auth/Actions";
import { useRouter } from 'next/navigation'
import { openNotification } from "@/utility/Utility";
import { RootState } from "@/store/RootReducer";
import { CommonLayout } from "@/layout/CommonLayout";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface IRegister {}
function Register() {
  // const Register: FC<IRegister> = (props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();
  const emailInput = Form.useWatch("Email", form);
  const userNameInput = Form.useWatch("Name", form);
  const passwordInput = Form.useWatch("Password", form);
  const confirmPasswordInput = Form.useWatch("ConfirmPassword", form);
  const verifyCodeInput = Form.useWatch("VerifyEmail", form);
  const [statusVerify, setStatusVerify] = useState(false);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!statusVerify) {
        form.submit();
        const objSubmit = {
          email: emailInput,
          userName: userNameInput,
          password: passwordInput,
          callback: callBackfunc,
        };
        dispatch(register(objSubmit));
      } else {
        const objVerifySubmit = {
          email: emailInput,
          code: verifyCodeInput,
          callback: callbackVerifySuccess,
        };
        dispatch(verify(objVerifySubmit));
      }
    } catch (errorInfo) {}
  };

  const reSendCode = () => {
    //Resend code
    const objVerifySubmit = {
      email: emailInput,
      code: verifyCodeInput,
      callback: callbackVerifySuccess,
    };
    dispatch(verify(objVerifySubmit));
  };

  const callBackfunc = () => {
    setStatusVerify(true);
  };

  const callbackVerifySuccess = () => {
    openNotification("success", "", "Code verify success");
    router.push("/login");
  };

  const validateEmail = (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return Promise.resolve(); // If value is empty, let the 'required' rule handle it
    }
    if (emailRegex.test(value)) {
      return Promise.resolve(); // Email format is valid
    }
    return Promise.reject(new Error("Email không đúng định dạng"));
  };
  const validateUsername = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Tên người dùng không được bỏ trống");
    }
    if (value.length < 8) {
      return Promise.reject("Tên người dùng phải có ít nhất 8 kí tự");
    }
    // if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    //   return Promise.reject("Tên người dùng phải bao gồm cả chữ và số");
    // }
    if (!/[a-zA-Z]/.test(value)) {
      return Promise.reject("Tên người dùng phải bao gồm cả chữ ");
    }
    return Promise.resolve();
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Mật khẩu không được bỏ trống");
    }
    if (value.length < 8) {
      return Promise.reject("Mật khẩu phải có ít nhất 8 kí tự");
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return Promise.reject("Mật khẩu phải bao gồm cả chữ và số");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject("Mật khẩu phải có ít nhất 1 kí tự đặc biệt");
    }
    return Promise.resolve();
  };

  const validateConfirmPass = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve(); // If value is empty, let the 'required' rule handle it
    }
    if (passwordInput === confirmPasswordInput) {
      return Promise.resolve(); // Email format is valid
    }
    return Promise.reject(new Error("Xác nhận mật khẩu không giống"));
  };
  //icon ẩn hiện password
  const [visible, setVisible] = useState(false); // State để theo dõi trạng thái hiện/ẩn mật khẩu

  const toggleVisibility = () => {
    setVisible(!visible); // Đảo ngược trạng thái
  };
  return (
    <>
      <Row
        style={{ height: "95%", marginTop: "30px", marginBottom: "50px" }}
        gutter={[10, 0]}
      >
        <Col span={12} style={{}}>
          <div className="dashboard-section">
            <div className="container">
              <div className="dashboard-wrapper">
                <div className="dashboard-content-wrap two">
                  <div className="change-pass-wrap">
                    <div className="edit-info-area">
                      <Image src={logo} alt="" width={121} height={121} />
                      <div
                        style={{
                          marginTop: 40,
                          marginBottom: 20,
                          userSelect: "none",
                        }}
                      >
                        <div style={{ fontSize: 30, fontWeight: 600 }}>
                          Đăng kí
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 400 }}>
                          Nếu bạn đã có tài khoản đăng nhập ngay{" "}
                          <a
                            onClick={() => router.push("/login")}
                            style={{ fontWeight: "bold", color: "blue" }}
                          >
                            Tại đây
                          </a>
                        </div>
                      </div>

                      <Form
                        name="register"
                        form={form}
                        layout="horizontal"
                        colon={false}
                        labelCol={{ span: 6 }}
                        labelAlign="left"
                      >
                        <div className="row">
                          <div className="col-md-12 ">
                            <div className="form-inner">
                              <Form.Item
                                name="Email"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Email
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[
                                  {
                                    message: "Email không được bỏ trống",
                                  },
                                  { validator: validateEmail },
                                ]}
                                validateTrigger="onChange"
                              >
                                <Input
                                  placeholder="Nhập địa chỉ email tại đây"
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="col-md-12 ">
                            <div className="form-inner">
                              <Form.Item
                                name="Name"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Tên người dùng
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[{ validator: validateUsername }]}
                                validateTrigger="onChange"
                              >
                                <Input
                                  placeholder="Nhập Tên người dùng tại đây"
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="col-md-12 ">
                            <div className="form-inner">
                              <Form.Item
                                name="Password"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Mật khẩu
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[{ validator: validatePassword }]}
                                validateTrigger="onChange"
                              >
                                <div>
                                  <Input.Password
                                    style={{
                                      fontSize: "14px",
                                      padding: "10px 20px",
                                      width: " 100%",
                                    }}
                                    placeholder="Nhập mật khẩu tại đây"
                                    type={passwordVisible ? "text" : "password"}
                                    iconRender={(visible) =>
                                      visible ? (
                                        <EyeOutlined />
                                      ) : (
                                        <EyeInvisibleOutlined />
                                      )
                                    }
                                    onClick={togglePasswordVisibility}
                                  />
                                </div>
                              </Form.Item>
                            </div>{" "}
                          </div>
                          <div className="col-md-12 ">
                            <div className="form-inner">
                              <Form.Item
                                name="ConfirmPassword"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Xác nhận mật khẩu
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[
                                  {
                                    message:
                                      "Xác nhận mật khẩu không được bỏ trống",
                                  },
                                  { validator: validateConfirmPass },
                                ]}
                                validateTrigger="onChange"
                              >
                                <div>
                                  <Input.Password
                                    style={{
                                      fontSize: "14px",
                                      padding: "10px 20px",
                                      width: " 100%",
                                    }}
                                    placeholder="Nhập xác nhận mật khẩu tại đây"
                                    type={passwordVisible ? "text" : "password"}
                                    iconRender={(visible) =>
                                      visible ? (
                                        <EyeOutlined />
                                      ) : (
                                        <EyeInvisibleOutlined />
                                      )
                                    }
                                    onClick={togglePasswordVisibility}
                                  />
                                </div>
                              </Form.Item>{" "}
                            </div>{" "}
                          </div>
                          <div className="col-md-12">
                            <div className="form-inner">
                              <Form.Item
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Xác nhận email
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                name="VerifyEmail"
                                style={{
                                  width: "100%",
                                  marginBottom: "8px",
                                }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <div style={{ display: "flex" }}>
                                  <Input
                                    placeholder="Nhập mã code tại đây"
                                    className="custom-input"
                                    disabled={!statusVerify}
                                    style={{
                                      flex: 1,
                                      borderTopRightRadius: 0,
                                      borderBottomRightRadius: 0,
                                    }}
                                  />
                                  <Button
                                    style={{
                                      backgroundColor: "#5bb282",
                                      color: "white",
                                      fontWeight: "bold",
                                      borderRadius: "0 2px 2px 0",
                                      height: "auto",
                                      padding: "0 15px",
                                    }}
                                    disabled={!statusVerify}
                                    onClick={reSendCode}
                                  >
                                    Gửi mã
                                  </Button>
                                </div>
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                        {statusVerify && (
                          <div
                            style={{
                              fontSize: 17,
                              color: "red",
                              fontWeight: 600,
                            }}
                          >
                            Mã xác minh đã được gửi đến email của bạn, vui lòng
                            kiểm tra.
                          </div>
                        )}
                        <Button
                          style={{
                            width: 130,
                            backgroundColor: "#489077",
                            color: "#FFF",
                            marginTop: 10,
                          }}
                          onClick={() => handleSubmit()}
                          loading={loading}
                        >
                          {statusVerify ? "Xác minh" : "Đăng kí"}
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div
            style={{
              height: "100%",
              borderRadius: 15,
            }}
          >
            <Image style={{ height: "100%" }} src={changepass} alt="" />
          </div>
        </Col>
      </Row>
    </>
  );
}
export default CommonLayout(React.memo(Register));