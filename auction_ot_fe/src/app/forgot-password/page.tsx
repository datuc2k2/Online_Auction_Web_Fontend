'use client'
import { Col, Form, Input, Row } from "antd";
import React from "react";
import changepass from '../../../public/assets/img/change_pass/ChangePassLogo.png'
import logo from '../../../public/assets/img/logo.png'
import Image from 'next/image'
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/store/auth/Actions";
import { RootState } from "@/store/RootReducer";
import { CommonLayout } from "@/layout/CommonLayout";

interface IForgotPassword {}
function ForgotPassword() {
  // const ForgotPassword: React.FC<IForgotPassword> = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [form] = Form.useForm();
  const emailInput = Form.useWatch("Email", form);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const validateEmail = (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return Promise.resolve(); // If value is empty, let the 'required' rule handle it
    }
    if (emailRegex.test(value)) {
      return Promise.resolve(); // Email format is valid
    }
    return Promise.reject(new Error("Invalid email format"));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const objSubmit = {
        email: emailInput,
        callback: navSuccess,
      };
      dispatch(resetPassword(objSubmit));
    } catch (errorInfo) {}
  };

  const navSuccess = () => {
    router.push("/verify-code");
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
                          marginTop: 20,
                          marginBottom: 20,
                          userSelect: "none",
                        }}
                      >
                        <div style={{ fontSize: 30, fontWeight: 700 }}>
                          Quên mật khẩu
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 400 }}>
                          Đừng lo lắng, điều này vẫn luôn xảy ra. Điền email của
                          bạn vào bên dưới để lấy lại mật khẩu
                        </div>
                      </div>
                      <Form name="forgotPassword" form={form} colon={false}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-inner">
                              <Form.Item
                                name="Email"
                                normalize={(value) => value.trimStart()}
                                initialValue=""
                                labelCol={{ span: 24 }} // Đưa label lên trên
                                wrapperCol={{ span: 24 }} // Đưa input xuống dưới
                                rules={[
                                  {
                                    required: true,
                                    message: "Email không được bỏ trống",
                                  },
                                  { validator: validateEmail },
                                ]}
                                validateTrigger="onChange"
                              >
                                <Input
                                  style={{ height: 45 }}
                                  placeholder="Nhập địa chỉ email tại đây"
                                  className="custom-input"
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                        {/* <button
                          className="primary-btn btn-hover two"
                          onClick={() => handleSave()}
                          // loading={loading}
                        >
                          Gửi mã
                          <span style={{ top: "40.5px", left: "84.2344px" }} />
                        </button> */}
                        <Button
                          style={{
                            width: 130,
                            backgroundColor: "#489077",
                            color: "#FFF",
                            marginTop: 10,
                          }}
                          onClick={() => handleSave()}
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
      {/* <Row style={{height: '95%'}}>
          <Col span={12} style={{paddingLeft: '5%', paddingRight: '8%'}}>
            <Image src={logo} alt="" width={121} height={121}/> 
            <div style={{marginTop: 40, marginBottom: 20}}>
                <div style={{fontSize: 16, cursor: 'pointer'}} onClick={() => router.push('/login')}>{`< Back to Login`}</div>
                <div style={{fontSize: 30, fontWeight: 600}}>Forgot your password</div>
                <div style={{fontSize: 16, fontWeight: 400}}>Don’t worry, happens to all of us. Enter your email below to recover your password</div>
            </div>

            <Form
                name="forgotPassword"
                form={form}
                layout="horizontal"
                colon={false}
                labelCol={{ span: 6 }}
                labelAlign="left"
            >
                <div style={{ fontSize: 24, color: '#000', marginBottom: 8, }}>Email</div>
                <Form.Item
                name="Email"
                normalize={(value) => value.trimStart()}
                initialValue=""
                rules={[{ required: true, message: 'Email is required' }, { validator: validateEmail }]}
                validateTrigger="onSubmit"
                // label={<span style={{ fontWeight: 'bold' }}>Name</span>}
                >
                    <Input style={{ height: 45 }} placeholder="Enter your email address" className="custom-input" />
                </Form.Item>

                
            </Form>

            <Button
              style={{ width: 130, backgroundColor: '#489077', color: '#FFF', marginTop: 10 }}
              onClick={handleSave}
              loading={loading}
            >
              Save
            </Button>

          </Col>
          <Col span={12}>
            <div style={{ backgroundColor: '#489077', width: '100%', height: '100%', margin: 22, borderRadius: 15 }}>
                <div style={{width: '100%', height: '100%', textAlign: 'center'}}>
                    <Image src={changepass} alt="" width={521} height={521}/> 
                    <div style={{marginTop: 20, color: 'white', fontSize: 24}}>Forgot password</div>
                    <div style={{color: 'white', fontSize: 12}}>Use to recovery password</div>
                </div>
            </div>
          </Col>
        </Row> */}
    </>
  );
}

export default CommonLayout(React.memo(ForgotPassword));