'use client'
import { Col, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import changepass from "../../../public/assets/img/change_pass/ChangePassLogo.png";
import logo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmResetPassword,
  resendVerificationCode,
} from "@/store/auth/Actions";
import { RootState } from "@/store/RootReducer";
import { CommonLayout } from "@/layout/CommonLayout";

interface IVerifyCode {}
function VerifyCode() {
  // const VerifyCode: React.FC<IVerifyCode> = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [form] = Form.useForm();
  const code = Form.useWatch("Code", form);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const [countdown, setCountdown] = useState(0);

  const handleResendCode = () => {
    const email = localStorage.getItem("currentEmailResetPass") ?? "";
    // dispatch(resendVerificationCode(email));
    setCountdown(180); // Đặt lại thời gian đếm ngược về 180 giây
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer); // Xóa interval khi component bị unmount hoặc countdown thay đổi
    }
  }, [countdown]);

  const handleVerify = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const objSubmit = {
        email: localStorage.getItem("currentEmailResetPass") ?? "",
        code: code,
        callback: () => {
          router.push("/create-new-pass");
        },
      };
      dispatch(confirmResetPassword(objSubmit));
    } catch (errorInfo) {
      console.log("Error:", errorInfo);
    }
  };

  return (
    <>
      <Row style={{ height: "95%" }} gutter={[10, 0]}>
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
                          Mã xác nhận
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 400 }}>
                          Một mã xác nhận đã được gửi tới email của bạn
                        </div>
                      </div>
                      <Form name="forgotPassword" form={form} colon={false}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-inner">
                              <Form.Item
                                name="Code"
                                label={
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    Mã xác nhận
                                    <span style={{ color: "red" }}> *</span>
                                  </span>
                                }
                                normalize={(value) => value.trimStart()}
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                initialValue=""
                                rules={[
                                  {
                                    message: "Mã xác nhận không được bỏ trống",
                                  },
                                ]}
                                validateTrigger="onSubmit"
                              >
                                <Input
                                  style={{ height: 45 }}
                                  placeholder="Nhập mã xác nhận tại đây"
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 500 }}>
                          <span
                            style={{
                              color: countdown === 0 ? "#FF8682" : "grey",
                              cursor: countdown === 0 ? "pointer" : "default",
                            }}
                            onClick={
                              countdown === 0 ? handleResendCode : undefined
                            }
                          >
                            Gửi lại mã{" "}
                            {countdown > 0
                              ? `(${Math.floor(countdown / 60)}:${
                                  countdown % 60
                                })`
                              : ""}
                          </span>
                        </div>
                        <Button
                          style={{
                            width: 130,
                            backgroundColor: "#489077",
                            color: "#FFF",
                            marginTop: 10,
                          }}
                          onClick={() => handleVerify()}
                          loading={loading}
                        >
                          Gửi mã
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

export default CommonLayout(React.memo(VerifyCode));