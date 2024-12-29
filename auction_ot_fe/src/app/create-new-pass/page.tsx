'use client'
import { Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import changepass from "../../../public/assets/img/change_pass/ChangePassLogo.png";
import logo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { confirmResetPassword, createNewPassword } from "@/store/auth/Actions";
import { RootState } from "@/store/RootReducer";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { CommonLayout } from "@/layout/CommonLayout";

interface ICreateNewPass {}

// const CreateNewPass: React.FC<ICreateNewPass> = () => {
function CreateNewPass() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch<any>();
  const [form] = Form.useForm();
  const newPass = Form.useWatch("NewPass", form);
  const reNewPass = Form.useWatch("ReNewPass", form);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Mật khẩu mới không được bỏ trống");
    }
    if (value.length < 8) {
      return Promise.reject("Mật khẩu mới phải có ít nhất 8 kí tự");
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return Promise.reject("Mật khẩu mới phải bao gồm cả chữ và số");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject("Mật khẩu mới phải có ít nhất 1 kí tự đặc biệt");
    }
    return Promise.resolve();
  };
  const validateConfirmPass = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve(); // If value is empty, let the 'required' rule handle it
    }
    if (newPass === reNewPass) {
      return Promise.resolve(); // Email format is valid
    }
    return Promise.reject(new Error("Xác nhận mật khẩu không giống"));
  };
  //icon ẩn hiện password
  const [visible, setVisible] = useState(false); // State để theo dõi trạng thái hiện/ẩn mật khẩu

  const toggleVisibility = () => {
    setVisible(!visible); // Đảo ngược trạng thái
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const objSubmit = {
        email: localStorage.getItem("currentEmailResetPass") ?? "",
        password: newPass,
        callback: () => {
          router.push("/");
        },
      };
      dispatch(createNewPassword(objSubmit));
    } catch (errorInfo) {}
  };

  return (
    <>
      {/* <Row style={{ height: "95%" }}>
          <Col span={12} style={{ paddingLeft: "5%", paddingRight: "8%" }}>
            <Image src={logo} alt="" width={121} height={121} />
            <div style={{ marginTop: 40, marginBottom: 20 }}>
              <div
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => router.back()}
              >{`< Back`}</div>
              <div style={{ fontSize: 30, fontWeight: 600 }}>
                Cập nhật mật khẩu
              </div>
            </div>

            <Form
              name="forgotPassword"
              form={form}
              layout="horizontal"
              colon={false}
              labelCol={{ span: 6 }}
              labelAlign="left"
            >
              <div style={{ fontSize: 16, color: "#000", marginBottom: 8 }}>
                Mật khẩu mới
              </div>
              <Form.Item
                name="NewPass"
                normalize={(value) => value.trimStart()}
                initialValue=""
                rules={[{ required: true, message: "Mật kha" }]}
                validateTrigger="onSubmit"
                // label={<span style={{ fontWeight: 'bold' }}>Name</span>}
              >
                <Input
                  style={{ height: 45 }}
                  placeholder="Enter your code here"
                  className="custom-input"
                />
              </Form.Item>
            </Form>

            <Button
              style={{
                width: 130,
                backgroundColor: "#489077",
                color: "#FFF",
                marginTop: 10,
              }}
              onClick={handleChange}
              loading={loading}
            >
              Change
            </Button>
          </Col>
          <Col span={12}>
            <div
              style={{
                backgroundColor: "#489077",
                width: "100%",
                height: "100%",
                margin: 22,
                borderRadius: 15,
              }}
            >
              <div
                style={{ width: "100%", height: "100%", textAlign: "center" }}
              >
                <Image src={changepass} alt="" width={521} height={521} />
                <div style={{ marginTop: 20, color: "white", fontSize: 24 }}>
                  Reset password
                </div>
                <div style={{ color: "white", fontSize: 12 }}>
                  Use to recovery password
                </div>
              </div>
            </div>
          </Col>
        </Row> */}
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
                      <Form name="forgotPassword" form={form} colon={false}>
                        <div className="row">
                          <div className="col-md-12 mb-30">
                            <div className="form-inner">
                              <Form.Item
                                label="Mật khẩu mới"
                                required
                                name="NewPass"
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                normalize={(value) => value.trimStart()}
                                initialValue=""
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
                                    placeholder="Nhập mật khẩu mới tại đây"
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
                                name="ReNewPass"
                                label=" Xác nhận mật khẩu "
                                style={{ width: "100%", marginBottom: "8px" }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[
                                  {
                                    required: true,
                                    message: "Mật khẩu mới không được bỏ trống",
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
                                    placeholder="Nhập mật khẩu mới tại đây"
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
                            </div>
                          </div>
                        </div>
                        <Button
                          style={{
                            width: 130,
                            backgroundColor: "#489077",
                            color: "#FFF",
                            marginTop: 10,
                          }}
                          onClick={() => handleChange()}
                          loading={loading}
                        >
                          Lưu
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

// export default CreateNewPass;
export default CommonLayout(React.memo(CreateNewPass));