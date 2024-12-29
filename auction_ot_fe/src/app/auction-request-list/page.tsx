"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/RootReducer";
import Link from "next/link";
import {
  Table,
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  Radio,
  Upload,
  UploadFile,
} from "antd";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { CommonLayout } from "@/layout/CommonLayout";
import { fetchListPayment } from "@/store/payment/Actions";
import moment from "moment";
import { useRouter } from "next/navigation";
import { fetchListAuction, auctionIsAccepted } from "@/store/auction/Actions";
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import Breadcrumb from "@/components/Breadcrumb/page";

import AuctionRequest from "@/components/auction/AuctionRequest";

interface IAuctionListTableData {
  index?: number | null;
  auctionId?: number | null;
  productName?: string | null;
  startingPrice?: string | null;
  createdAt?: string | null;
  isApproved: string | null;
  note: string | null;
  action1?: ReactNode | null;
}

// const PaymentListPage: React.FC = () => {
function AuctionListPage() {
  const dispatch = useDispatch<any>();
  const [form] = Form.useForm();
  // Lấy dữ liệu từ Redux store
  const auctionListDataPaging = useSelector(
    (state: RootState) => state.auction.auctionList?.auctionList
  );
  console.log("auctionListDataPaging : ", auctionListDataPaging);
  const nameInput = Form.useWatch("name", form);
  const fromDateInput = Form.useWatch("fromDate", form);
  const toDateInput = Form.useWatch("toDate", form);
  const [auctionMethod, setAuctionMethod] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [state, setState] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    getListAuction();
  }, [state.page]);
  const router = useRouter();
  const getListAuction = () => {
    dispatch(
      fetchListAuction({
        displayCount: state.page,
        pageCount: 10,
        searchName: nameInput ? nameInput : "",
        isProcessed: false,
        startDate: fromDateInput
          ? moment(fromDateInput).format("YYYY-MM-DD")
          : null,
        endDate: toDateInput ? moment(toDateInput).format("YYYY-MM-DD") : null,
      })
    );
  };
  const onChangePage = (page: number) => {
    setState((state) => ({ ...state, page }));
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Phê duyệt phiên đấu giá" },
  ];

  const handleAccept = (id: number | null) => {
    // console.log("id111 : ", id);
    dispatch(
      auctionIsAccepted({
        auctionId: id,
        isAccepted: true,
        reason: "null",
        callback: () => dispatch(getListAuction()),
      })
    );
  };
  const handleReject = (id: number | null) => {
    dispatch(
      auctionIsAccepted({
        auctionId: id,
        isAccepted: false,
        reason: reason,
        callback: () => dispatch(getListAuction()),
      })
    );
    setIsModalVisible(false);
    setReason("");
  };
  const handleFilter = () => {
    console.log("name : ", nameInput);
    if (state.page === 1) {
      getListAuction();
    } else {
      setState((state) => ({ ...state, page: 1 }));
    }
  };

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
            Phê duyệt phiên đấu giá
          </h3>
        </div>
        <div>
          <Form form={form}>
            <div
              style={{
                minWidth: "100%",
                display: "flex",
                alignItems: "start",
              }}
              className="ninjadash-datatable-filter__left"
            >
              <div
                className="ninjadash-datatable-filter__input"
                style={{ marginRight: "10px", width: "30%" }}
              >
                <Form.Item
                  name="name"
                  initialValue=""
                  validateTrigger="onSubmit"
                  normalize={(value) => value.trimStart()}
                  label={null}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    style={{ height: "44px" }}
                    className="custom-input"
                    placeholder="Tên sản phẩm"
                  />
                </Form.Item>
              </div>
              <div
                className="ninjadash-datatable-filter__input"
                style={{ marginRight: "10px" }}
              >
                <Form.Item
                  name="fromDate"
                  label={null}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DatePicker
                    placeholder="Từ ngày"
                    style={{ width: "100%", height: "44px" }}
                    format={"DD-MM-YYYY"}
                  />
                </Form.Item>
              </div>
              <div className="ninjadash-datatable-filter__input">
                <Form.Item
                  name="toDate"
                  label={null}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DatePicker
                    placeholder="Đến ngày"
                    style={{ width: "100%", height: "44px" }}
                    format={"DD-MM-YYYY"}
                  />
                </Form.Item>
              </div>
              <Button
                style={{
                  width: 130,
                  backgroundColor: "#489077",
                  marginLeft: 20,
                }}
                onClick={handleFilter}
              >
                Tìm kiếm
              </Button>
            </div>
          </Form>

          {auctionListDataPaging?.map((auction) => (
            <AuctionRequest
              handleAccept={handleAccept}
              handleReject={handleReject}
              setIsModalVisible={setIsModalVisible}
              auction={auction}
              setReason={setReason}
              reason={reason}
              auctionMethod={auction.auction.isPrivate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
export default CommonLayout(React.memo(AuctionListPage));
