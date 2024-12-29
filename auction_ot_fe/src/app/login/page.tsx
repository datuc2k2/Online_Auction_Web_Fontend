"use client";
import { Checkbox, Col, Form, FormInstance, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import changepass from "../../../public/assets/img/change_pass/ChangePassLogo1.png";
import logo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/auth/Actions";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/RootReducer";
import { CommonLayout } from "@/layout/CommonLayout";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface ILogin {}

function Login() {
  const router = useRouter();
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance<any>>(null);
  const dispatch = useDispatch<any>();
  const emailInput = Form.useWatch("Email", form);
  const passwordInput = Form.useWatch("Password", form);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = useSelector((state: RootState) => state.auth.access_token);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    var checkRem = JSON.parse(localStorage.getItem("checkRemember") + "");
    setRemember(checkRem);
    if (checkRem) {
      formRef.current?.setFieldsValue({
        Email: localStorage.getItem("Email"),
        Password: localStorage.getItem("Password"),
      });
    } else {
      formRef.current?.setFieldsValue({
        Email: null,
        Password: null,
      });
    }
  }, []);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const objSubmit = {
        Email: emailInput,
        Password: passwordInput,
        isRemember: remember,
      };
      dispatch(login(objSubmit, navigateHome));
    } catch (errorInfo) {}
  };

  const navigateHome = () => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(";")?.shift();
        return cookieValue;
      }
      return undefined;
    };
    const pathBack = getCookie("pathBack");

    //Navigate to screen if there is a screen in cookie
    if (pathBack) {
      router.push(pathBack);
    } else {
      router.push("/");
    }
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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

  //icon ẩn hiện password
  const [visible, setVisible] = useState(false);
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
                          marginTop: 20,
                          marginBottom: 20,
                          userSelect: "none",
                        }}
                      >
                        <div style={{ fontSize: 30, fontWeight: 700 }}>
                          Đăng nhập
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 400 }}>
                          Nếu bạn chưa có tài khoản
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 400 }}>
                          Bạn có thể{" "}
                          <a
                            onClick={() => router.push("/register")}
                            style={{ fontWeight: "bold", color: "blue" }}
                          >
                            đăng kí tại đây
                          </a>
                        </div>
                      </div>
                      <Form
                        name="login"
                        form={form}
                        ref={formRef}
                        colon={false}
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-inner">
                              <Form.Item
                                name="Email"
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
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
                                rules={[
                                  {
                                    message: "Email không được bỏ trống",
                                  },
                                  { validator: validateEmail },
                                ]}
                                validateTrigger="onSubmit"
                              >
                                <Input
                                  onChange={(e) =>
                                    form.setFieldsValue({
                                      Email: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập email tại đây"
                                  value={emailInput}
                                />
                              </Form.Item>
                            </div>
                          </div>
                          {/* <div className="col-md-12 mb-30">
                            <div className="form-inner">
                              <Form.Item
                                label="Mật khẩu"
                                name="Password"
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                  {
                                    required: true,
                                    message: "Mật khẩu không được bỏ trống",
                                  },
                                ]}
                                validateTrigger="onSubmit"
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #d9d9d9",
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  <Input
                                    name="Password"
                                    type={visible ? "text" : "password"}
                                    style={{
                                      width: "calc(100% - 32px)",
                                      border: "none",
                                    }}
                                    placeholder="Nhập mật khẩu tại đây"
                                    onChange={(e) =>
                                      form.setFieldsValue({
                                        Password: e.target.value,
                                      })
                                    }
                                    value={passwordInput}
                                  />
                                  <span
                                    onClick={toggleVisibility}
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "8px",
                                    }}
                                  >
                                    {visible ? (
                                      <EyeOutlined />
                                    ) : (
                                      <EyeInvisibleOutlined />
                                    )}
                                  </span>
                                </div>
                              </Form.Item>
                            </div>
                          </div> */}
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
                                    Mật khẩu
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                name="Password"
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[
                                  {
                                    message: "Vui lòng nhập mật khẩu!",
                                  },
                                ]}
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
                        </div>
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
                          Đăng nhập
                        </Button>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "10px",
                          }}
                        >
                          <Checkbox
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                          >
                            Ghi nhớ lần sau
                          </Checkbox>
                          <a
                            onClick={() => router.push("/forgot-password")}
                            style={{ color: "GrayText" }}
                          >
                            Quên mật khẩu?
                          </a>
                        </div>
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
export default CommonLayout(React.memo(Login));
