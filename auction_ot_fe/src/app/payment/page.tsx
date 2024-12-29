"use client";
import { Checkbox, Col, Form, FormInstance, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import changepass from "../../../public/assets/img/change_pass/ChangePassLogo.png";
import logo from "../../../public/assets/img/logo.png";
import Image from "next/image";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/auth/Actions";
import { useRouter } from 'next/navigation'
import { RootState } from "@/store/RootReducer";
import { CommonLayout } from "@/layout/CommonLayout";
import { openNotification } from "@/utility/Utility";
import { addPayment } from "@/store/payment/Actions";
import Breadcrumb from "@/components/Breadcrumb/page";

interface IPayment {}

function Payment() {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();
  const formRef = useRef<FormInstance<any>>(null);
  const amountInput = Form.useWatch("amount", form);
  const [qrLink, setQrLink] = useState("");
  const [atTimeStamp, setAtTimeStamp] = useState(0);
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);

  const genQrCode = async () => {
    try {
      const values = await form.validateFields();
      form.submit();
      const currentTimestamp = Date.now();
      setAtTimeStamp(currentTimestamp);
      const qrLink = `https://img.vietqr.io/image/MB-0832964702-compact2.png?amount=${amountInput}&addInfo=Nap${amountInput}choAuctionOTTai${currentTimestamp}`;
      setQrLink(qrLink);
    } catch (errorInfo) {
      console.error("Validation error:", errorInfo);
    }
  };

  useEffect(() => {
    if (myInfo) {
      if (qrLink && atTimeStamp) {
        let notified = false;
        const intervalId = setInterval(async () => {
          const dataRow = await checkPaid();
          if (dataRow) {
            if (!notified) {
              notified = true;
              //Call api + point
              const addPaymentObj = {
                userId: myInfo?.userId,
                auctionId: 0,
                paymentAmount: amountInput,
                currency: "VND",
                paymentTime: new Date(),
                description: dataRow["Mô tả"],
                callback: () => router.push("/"),
              };
              dispatch(addPayment(addPaymentObj));
              formRef.current?.setFieldsValue({
                amount: 0,
              });
            }
            clearInterval(intervalId);
            setAtTimeStamp(0);
            setQrLink("");
          }
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, [qrLink, atTimeStamp]);

  console.log("atTimeStamp: ", atTimeStamp);

  const checkPaid = async () => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=beOUWcHb4GN-fDg3ydSBft20F-ld7mtiFprsxRCBPqOOi6mDnci8T54Ma1m5nLP50ujSmIYusKThGjVSKuULWJc_o1Ek9Svmm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnK9toBhp6qeoCj9PERXUDuzqVAWhZ-bjiCBrO51u6xxj3Noidjx1iHmTm0EGKX7iRvT-Wau1EG4OpOp9QHeNsAYPhIuOCVWdldz9Jw9Md8uu&lib=Mtb4AvmSLWJfjON_ZMa49EArN_imPsKv7"
      );
      const data = await response.json();

      const dataRow = data?.data?.find(
        (row: any) =>
          row["Mô tả"]?.includes(
            `Nap${amountInput}choAuctionOTTai${atTimeStamp}`
          ));

      return dataRow || "";
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  const validatePaymentAmount = (_: any, value: any) => {
    if (value && value < 10000) {
      return Promise.reject(new Error("Bạn không thể nạp dưới 10,000đ"));
    }
    return Promise.resolve();
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Nạp tiền vào hệ thống" },
  ];
  return (
    <>
      <div style={{ marginBottom: 50, marginTop: 50 }}>
        <div>
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
            Nạp tiền vào hệ thống
          </h3>
        </div>
        <Form
          name="payment"
          form={form}
          layout="horizontal"
          colon={false}
          labelCol={{ span: 6 }}
          labelAlign="left"
          ref={formRef}
        >
          <Row style={{ minHeight: 600, marginTop: 50, userSelect: "none" }}>
            <Col
              span={12}
              md={12}
              xs={24}
              style={{
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ color: "#000", fontSize: 20, marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    marginBottom: 22,
                    color: "#333",
                  }}
                >
                  Hướng dẫn:
                </div>
                <div style={{ fontSize: 16, marginBottom: 12, color: "#555" }}>
                  B1: Nhập số tiền muốn thanh toán
                </div>
                <div style={{ fontSize: 16, marginBottom: 12, color: "#555" }}>
                  B2: Nhấn nút tạo mã QR
                </div>
                <div style={{ fontSize: 16, marginBottom: 12, color: "#555" }}>
                  B3: Mở ứng dụng thanh toán
                </div>
                <div style={{ fontSize: 16, marginBottom: 12, color: "#555" }}>
                  B4: Chọn thanh toán và quét mã QR bên trên mẫu in
                </div>
                <div style={{ fontSize: 16, marginBottom: 12, color: "#555" }}>
                  B5: Hoàn thành các bước thanh toán theo hướng dẫn
                </div>
              </div>
              <Form.Item
                name="amount"
                label={
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                    }}
                  >
                    Nhập số tiền muốn nạp vào hệ thống
                  </span>
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Số tiền không được để trống" },
                  { validator: validatePaymentAmount },
                ]}
                validateTrigger="onSubmit"
              >
                <Input
                  step={10000}
                  type="number"
                  style={{
                    height: "45px",
                    fontSize: "16px",
                    paddingLeft: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    transition: "border 0.3s ease",
                  }}
                  className="custom-input"
                />
              </Form.Item>
              <Button
                style={{
                  width: "150px",
                  backgroundColor: "#489077",
                  color: "#FFF",
                  fontSize: "16px",
                  borderRadius: "8px",
                  padding: "10px 0",
                  transition: "background-color 0.3s ease",
                  marginTop: "15px",
                  marginBottom: "60px",
                }}
                onClick={genQrCode}
              >
                Tạo mã QR
              </Button>
            </Col>

            <Col
              span={12}
              md={12}
              xs={24}
              style={{
                paddingLeft: "5%",
                paddingRight: "8%",
                userSelect: "none",
              }}
            >
              {qrLink && (
                <div style={{ textAlign: "center" }}>
                  <img
                    style={{ width: 500, height: 500 }}
                    alt=""
                    src={qrLink}
                  />
                  <div style={{ fontSize: 24, color: "#000", fontWeight: 600 }}>
                    Quét mã QR để nạp {amountInput}đ vào hệ thống
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
export default CommonLayout(React.memo(Payment));
