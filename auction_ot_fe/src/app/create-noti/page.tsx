"use client";
import Breadcrumb from "@/components/Breadcrumb/page";
import { CommonLayout } from "@/layout/CommonLayout";
import { Button, Col, Form, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

function createNoti() {
  const [showMemberSelect, setShowMemberSelect] = useState(false);

  const handleTypeChange = (value) => {
    // Kiểm tra nếu chọn "systemMaintenance" thì ẩn người nhận
    setShowMemberSelect(value !== "systemMaintenance");
  };
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Gửi thông báo" },
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
          Gửi thông báo
        </h3>
      </div>
      <Form
      // initialValues={{ typeNoti: "systemMaintenance" }} // Set giá trị mặc định
      >
        <Form.Item
          name="typeNoti"
          label={
            <span style={{ fontWeight: "bold", fontSize: "17px" }}>Loại</span>
          }
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          validateTrigger="onChange"
        >
          <Select placeholder="Chọn loại" onChange={handleTypeChange}>
            <Select.Option value="systemMaintenance">
              Hệ thống bảo trì
            </Select.Option>
            <Select.Option value="postReport">Báo cáo bài viết</Select.Option>
            <Select.Option value="sessionReport">Báo cáo phiên</Select.Option>
          </Select>
        </Form.Item>

        {showMemberSelect && (
          <Form.Item
            name="member"
            label={
              <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                Người nhận
              </span>
            }
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            validateTrigger="onChange"
          >
            <Select placeholder="Chọn người nhận">
              <Select.Option value="1">Nguyễn Văn A</Select.Option>
              <Select.Option value="2">Tạ Thị B</Select.Option>
              <Select.Option value="3">Trương Cao C</Select.Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="description"
          label={
            <span style={{ fontWeight: "bold", fontSize: "17px" }}>
              Miêu tả
            </span>
          }
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: "Miêu tả không được để trống" }]}
          validateTrigger="onSubmit"
          style={{ width: "100%" }}
        >
          <TextArea
            className="custom-input"
            style={{
              height: "280px",
              width: "100%",
              fontSize: "15px",
            }}
          />
        </Form.Item>
        <Row>
          <Col span={24} style={{ textAlign: "end" }}>
            <Button
              style={{
                width: 130,
                backgroundColor: "#489077",
                color: "#FFF",
                marginTop: 10,
                marginRight: 20,
              }}
              onClick={() => router.push("/noti-list")}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              style={{
                width: 130,
                backgroundColor: "#489077",
                color: "#FFF",
                marginTop: 10,
                marginBottom: 60,
              }}
              //   onClick={handleSave}
              loading={loading}
            >
              Tạo thông báo
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
export default CommonLayout(React.memo(createNoti));
