"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/RootReducer";
import { Table, Form, Input, DatePicker } from "antd";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { CommonLayout } from "@/layout/CommonLayout";
import { fetchListPayment } from "@/store/payment/Actions";
import moment from "moment";
import { useRouter } from "next/navigation";
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import CustomTable from "@/components/custom-table/CustomTable";
import Breadcrumb from "@/components/Breadcrumb/page";

interface IPaymentTableData {
  index?: number | null;
  transactionId?: number | null;
  fullName?: string | null;
  description?: string | null;
  paymentTime?: string | null;
  amount?: string | null;
  transactionCode?: string | null;
  action1?: ReactNode | null;
}

// const PaymentListPage: React.FC = () => {
function PaymentListPage() {
  const dispatch = useDispatch<any>();
  const [form] = Form.useForm();
  // Lấy dữ liệu từ Redux store
  const paymentDataPaging = useSelector(
    (state: RootState) => state.payment.listPayment
  );
  const nameInput = Form.useWatch("name", form);
  const fromDateInput = Form.useWatch("fromDate", form);
  const toDateInput = Form.useWatch("toDate", form);
  const loading = useSelector((state: RootState) => state.payment.loading);
  const error = useSelector((state: RootState) => state.payment.error);
  console.log("nameInput : ", nameInput);
  const [state, setState] = useState({
    page: 1,
  });
  useEffect(() => {
    getListPayment();
  }, [state.page]);
  const router = useRouter();

  const handleNavigate = (userId: number, event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/account-details-managerment/${userId}`);
  };
  const handleFilter = () => {
    if (state.page === 1) {
      getListPayment();
    } else {
      setState((state) => ({ ...state, page: 1 }));
    }
  };
  const getListPayment = () => {
    dispatch(
      fetchListPayment({
        displayCount: state.page,
        pageCount: 10,
        searchName: nameInput ? nameInput : "",
        startDate: fromDateInput
          ? moment(fromDateInput).format("YYYY-MM-DD")
          : null,
        endDate: toDateInput ? moment(toDateInput).format("YYYY-MM-DD") : null,
        // startDate: null,
        // endDate: null,
        // // startDate: "2023-11-14",
        // // endDate: "2024-11-14",
      })
    );
  };
  // Cấu hình các cột cho bảng
  const dataTableColumn = [
    {
      title: () => {
        return <div style={{ fontWeight: 550 }}>STT</div>;
      },
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      width: "3vw",
    },
    {
      title: "Tên Người Dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Mã giao dịch",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    {
      title: "Số Tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Ngày Thanh Toán",
      dataIndex: "paymentTime",
      key: "paymentTime",
    },
    // {
    //   title: "",
    //   dataIndex: "action1",
    //   key: "action1",
    //   width: 50,
    // },
    {
      title: "Nội dung giao dịch",
      dataIndex: "description",
      key: "description",
    },
  ];
  const handleClickDetail = (auctionId: number) => {
    router.push(`request-auction?id=${auctionId}`);
  };
  let tableDataSource: IPaymentTableData[] = []; // 2 phut thoi

  paymentDataPaging?.paymentList?.map((item, index) => {
    const {
      transactionId,
      description,
      transactionTime,
      transactionCode,
      amount,
      user: {
        userProfile: { fullName },
      },
    } = item;

    // Thêm dữ liệu vào tableDataSource
    tableDataSource.push({
      index: (state.page - 1) * 10 + (index + 1),
      transactionId,
      description,
      paymentTime: moment(transactionTime).format("DD-MM-YYYY hh:mm"),
      transactionCode: transactionCode.toUpperCase(),
      amount: amount ? Number(amount).toLocaleString("en-US") : "N/A",
      fullName,
      action1: (
        <div
          onClick={() => handleClickDetail(transactionId)}
          style={{ cursor: "pointer" }}
        >
          <EyeIcon />
        </div>
      ),
    });
  });
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);
  const onChangePage = (page: number) => {
    setState((state) => ({ ...state, page }));
  };

  //Tên đường dẫn
  const breadcrumbItems = [
    {
      label: "Tài khoản của tôi",
      href: "/account-details",
    },
    { label: "Lịch sử thanh toán" },
  ];
  return (
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
          Lịch sử thanh toán
        </h3>
      </div>
      <div style={{ marginBottom: 100 }}>
        <CustomTable
          dataSource={tableDataSource}
          columns={dataTableColumn}
          pagination={{
            pageSize: 10,
            onChange: onChangePage,
            total: paymentDataPaging?.allRecords ?? 0,
            current: state.page,
          }}
          loading={loading}
          filterComponent={
            <div
              style={{ display: "flex", marginTop: -20 }}
              className="ninjadash-datatable-filter"
            >
              <Form
                name="updateStudentInfo"
                form={form}
                layout="horizontal"
                requiredMark={false}
                colon={false}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                style={{ width: "100%" }}
              >
                <style>{`
                .ant-select-selector {
                    height: 44px !important;
                    width: 150px !important;
                    margin-left: 10px;
                }
                .ant-select-selection-item {
                    line-height: 44px !important;
                }
            `}</style>

                <div
                  style={{
                    minWidth: "100%",
                    display: "flex",
                    alignItems: "start",
                  }}
                  className="ninjadash-datatable-filter__left"
                >
                  {(myInfo?.userRoleId === "1" ||
                    myInfo?.userRoleId === "3") && (
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
                          placeholder="Tên người dùng"
                        />
                      </Form.Item>
                    </div>
                  )}

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
            </div>
          }
        />
      </div>
    </div>
  );
}
export default CommonLayout(React.memo(PaymentListPage));
