"use client";

import { DataTableStyleWrap } from "@/components/component_base/components/table/Style";
import { CommonLayout } from "@/layout/CommonLayout";
import { fetchListAccount } from "@/store/account/Actions";
import { RootState } from "@/store/RootReducer";
import { DatePicker, Empty, Form, Input, Modal, Select, Table } from "antd";
import React, { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UilSearch from "@iconscout/react-unicons/dist/icons/uil-search";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { TableWrapper } from "../container/Style";
import { useRouter } from "next/navigation";
import { themeColor } from "@/config/theme/ThemeVariables";
import { UilPen, UilTrashAlt } from "@iconscout/react-unicons";
import CustomTable from "@/components/custom-table/CustomTable";
import StatusBadge from "@/components/custom-table/StatusBadge";
import { DeleteOutlined, DollarOutlined, EditOutlined, EyeOutlined, MessageOutlined } from "@ant-design/icons";
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import {
  fetchMyAutions,
  fetchStatus,
  inActiveAuction,
} from "@/store/auction/Actions";
import moment from "moment";
import { addPayment } from "@/store/payment/Actions";
import Breadcrumb from "@/components/Breadcrumb/page";

interface IAuctionTableData {
  index?: number | null;
  productName?: string | null;
  createdDate?: string | null;
  status?: ReactNode | string | null;
  paymentStatus?: string | null;
  startTime?: string;
  endTime?: string;
  action1?: ReactNode | null;
}

const MyAuctions = React.memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();
  const loading = useSelector((states: RootState) => states.auction.loading);
  const auctionStatus = useSelector(
    (states: RootState) => states.auction.auctionStatus
  );

  // console.log("auctionStatus: ", auctionStatus);

  const auctionListDataPaging = useSelector(
    (states: RootState) => states.auction.myAuctions
  );

  const myInfo = useSelector((states: RootState) => states.auth.myInfo);
  const now = moment();
  const nameInput = Form.useWatch("name", form);
  const fromDateInput = Form.useWatch("fromDate", form);
  const toDateInput = Form.useWatch("toDate", form);
  const statusInput = Form.useWatch("status", form);

  // console.log("auctionListDataPaging: ", auctionListDataPaging);

  //Payment
  const [qrLink, setQrLink] = useState("");
  const [atTimeStamp, setAtTimeStamp] = useState(0);
  const [amount, setAmount] = useState(0);
  const [auctionId, setAuctionId] = useState(0);

  const genQrCode = async (am: number) => {
    try {
      const values = await form.validateFields();
      form.submit();
      const currentTimestamp = Date.now();
      setAtTimeStamp(currentTimestamp);
      const qrLink = `https://img.vietqr.io/image/MB-0832964702-compact2.png?amount=${am}&addInfo=Nap${am}choAuctionOTTai${currentTimestamp}`;
      setQrLink(qrLink);
    } catch (errorInfo) {
      console.error("Validation error:", errorInfo);
    }
  };

  const checkPaid = async () => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=beOUWcHb4GN-fDg3ydSBft20F-ld7mtiFprsxRCBPqOOi6mDnci8T54Ma1m5nLP50ujSmIYusKThGjVSKuULWJc_o1Ek9Svmm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnK9toBhp6qeoCj9PERXUDuzqVAWhZ-bjiCBrO51u6xxj3Noidjx1iHmTm0EGKX7iRvT-Wau1EG4OpOp9QHeNsAYPhIuOCVWdldz9Jw9Md8uu&lib=Mtb4AvmSLWJfjON_ZMa49EArN_imPsKv7"
      );
      const data = await response.json();

      const dataRow = data?.data?.find((row: any) =>
        row["Mô tả"]?.includes(`Nap${amount}choAuctionOTTai${atTimeStamp}`)
      );

      return dataRow || "";
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };
  // const [state, setState] = React.useState({
  //     IsOpenModalConfirm: false, // Modal hiển thị hay không
  //     isReject: false, // Xác định là xác nhận hay từ chối
  //     rejectReason: "", // Lý do từ chối (nếu có)
  //   });
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
                auctionId: auctionId,
                paymentAmount: amount,
                currency: "VND",
                paymentTime: new Date(),
                description: dataRow["Mô tả"],
                callback: () => callbackWhenPaymentSuccess(),
              };
              dispatch(addPayment(addPaymentObj));
            }
            clearInterval(intervalId);
            setAtTimeStamp(0);
            setQrLink("");
            setAuctionId(0);
          }
        }, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, [qrLink, atTimeStamp]);

  const callbackWhenPaymentSuccess = () => {
    getListAuction();
  };

  const [state, setState] = useState({
    page: 1,
    IsOpenModalConfirm: false,
    inActiveAuctionId: 0,
  });
  const handleCancel = () => {
    setState({ ...state, IsOpenModalConfirm: false, inActiveAuctionId: 0 });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    dispatch(fetchStatus());
  };

  useEffect(() => {
    getListAuction();
  }, [state.page]);

  const getListAuction = () => {
    dispatch(
      fetchMyAutions({
        displayCount: state.page,
        pageCount: 10,
        searchText: nameInput ? nameInput : "",
        startDate: fromDateInput
          ? moment(fromDateInput).format("YYYY-MM-DD")
          : null,
        endDate: toDateInput ? moment(toDateInput).format("YYYY-MM-DD") : null,
        status: statusInput ? statusInput : 0,
      })
    );
  };

  const router = useRouter();

  const handleNavigate = (userId: number, event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/account-details-managerment/${userId}`);
  };

  const dataTableColumn = [
    {
      title: () => {
        return <div style={{ fontWeight: 550 }}>Stt</div>;
      },
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      width: "2vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>
            Tên sản phẩm
          </div>
        );
      },
      dataIndex: "productName",
      key: "productName",
      width: "10vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>Ngày tạo</div>
        );
      },
      dataIndex: "createdDate",
      key: "createdDate",
      width: "10vw",
      align: "center" as const,
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>
            Trạng thái phiên
          </div>
        );
      },
      dataIndex: "status",
      key: "status",
      width: "11vw",
      align: "center" as const,
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>
            Trạng thái thanh toán
          </div>
        );
      },
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: "11vw",
      align: "center" as const,
    },
    {
      title: () => {
        return (
          <div
            style={{
              fontWeight: 550,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Thời gian bắt đầu
          </div>
        );
      },
      dataIndex: "startTime",
      key: "startTime",
      width: "11vw",
      align: "center" as const,
    },
    {
      title: () => {
        return (
          <div
            style={{
              fontWeight: 550,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Thời gian kết thúc
          </div>
        );
      },
      dataIndex: "endTime",
      key: "endTime",
      width: "10vw",
      align: "center" as const,
    },

    {
      title: "",
      dataIndex: "action1",
      key: "action1",
      width: 50,
    },
  ];

  const handleClickDetail = (auctionId: number) => {
    router.push(`request-auction?id=${auctionId}`);
    // router.push(`view-auction-detail?id=${auctionId}`);
  };
  const handleViewkDetail = (auctionId: number) => {
    router.push(`view-auction-detail?id=${auctionId}`);
  };
  const [auctionActive, setauctionActive] = useState(0);
  useEffect(() => {
    setauctionActive(state.inActiveAuctionId);
  }, [state.inActiveAuctionId]);
  const handleDeleteAuction = (auctionId: number) => {
    // router.push(`request-auction?id=${auctionId}`);
    // console.log("id2222 : ", state.inActiveAuctionId);

    // console.log("daichimbe : ", auctionActive);
    dispatch(
      inActiveAuction({
        auctionId: auctionActive,
        callback: () => dispatch(getListAuction()),
      })
    );
    setState({ ...state, IsOpenModalConfirm: false });
  };

  const handleClickPay = (auctionId: number, am: number) => {
    genQrCode(am);
    setAuctionId(auctionId);
    setAmount(am);
  };
  const currentTime = new Date();
  const statusOptions = useMemo(() => {
    let statusReturn = [{ value: 0, label: "Tất cả" }];
    auctionStatus?.status?.forEach((s) => {
      statusReturn.push({ value: s?.id, label: s?.name });
    });
    return statusReturn;
  }, [auctionStatus]);

  let tableDataSource: IAuctionTableData[] = [];
  auctionListDataPaging?.data?.map((item, index) => {
    const {
      auctionId,
      productName,
      createdAt,
      status,
      description,
      startTime,
      endTime,
      paymentStatus,
      fee,
      isActive,
    } = item;
    return tableDataSource.push({
      index: (state.page - 1) * 10 + (index + 1),
      productName,
      createdDate: moment(createdAt).format("DD-MM-YYYY"),
      status: statusOptions?.find((s) => s?.value === Number(status))?.label,
      paymentStatus:
        paymentStatus === 13
          ? "Chưa thanh toán"
          : paymentStatus === 14
          ? "Đã thanh toán"
          : "Trạng thái không xác định",
      startTime: moment(startTime).format("DD-MM-YYYY hh:mm"),
      endTime: moment(endTime).format("DD-MM-YYYY hh:mm"),
      action1: (
        <div style={{ display: "flex" }}>
          {paymentStatus === 14 &&
            new Date(moment(startTime).format("YYYY-MM-DDTHH:mm:ss")) >
              currentTime && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Icon xóa */}
                <div
                  onClick={() =>
                    setState({
                      ...state,
                      IsOpenModalConfirm: true,
                      inActiveAuctionId: auctionId,
                    })
                  }
                  style={{ width: 60 }}
                >
                  <DeleteOutlined
                    style={{
                      fontSize: "22px",
                      cursor: "pointer",
                      color: "red",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              </div>
            )}
          {status === 11 &&
            new Date(moment(startTime).format("YYYY-MM-DDTHH:mm:ss")) >
              currentTime && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {/* Icon xóa */}
                <div
                  onClick={() =>
                    setState({
                      ...state,
                      IsOpenModalConfirm: true,
                      inActiveAuctionId: auctionId,
                    })
                  }
                  style={{ width: 60 }}
                >
                  <DeleteOutlined
                    style={{
                      fontSize: "22px",
                      cursor: "pointer",
                      color: "red",
                      backgroundColor: "white",
                    }}
                  />
                </div>
                {/* Icon chỉnh sửa */}
                <div
                  onClick={() => handleClickDetail(auctionId)}
                  style={{ width: 60 }}
                >
                  <EditOutlined
                    style={{
                      fontSize: "22px",
                      color: "#5E80A5",
                      cursor: "pointer",
                      backgroundColor: "white",
                    }}
                  />
                </div>
              </div>
            )}
          {status === 12 && paymentStatus === 13 && (
            <div
              onClick={() => handleClickPay(auctionId, fee)}
              style={{ width: 60 }}
            >
              <DollarOutlined
                style={{
                  fontSize: "22px",
                  color: "#08c",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              />
            </div>
          )}
          {status && (
            <div
              onClick={() => handleViewkDetail(auctionId)}
              style={{ width: 60 }}
            >
              <EyeOutlined
                style={{
                  fontSize: "22px",
                  color: "#5E80A5",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              />
            </div>
          )}
        </div>
      ),
    });
  });

  // console.log("tableDataSource: ", tableDataSource);

  const onChangePage = (page: number) => {
    setState((state) => ({ ...state, page }));
  };

  const handleFilter = () => {
    if (state.page === 1) {
      getListAuction();
    } else {
      setState((state) => ({ ...state, page: 1 }));
    }
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Thông tin cá nhân", href: "/account-details" },
    { label: "Phiên đấu giá của tôi" },
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
          Phiên đấu giá của tôi
        </h3>
      </div>
      <div style={{ marginBottom: 100 }}>
        <CustomTable
          dataSource={tableDataSource}
          columns={dataTableColumn}
          pagination={{
            pageSize: 10,
            onChange: onChangePage,
            total: auctionListDataPaging?.allRecords ?? 0,
            current: state.page,
          }}
          loading={loading}
          filterComponent={
            <div
              style={{ display: "flex", marginTop: 20 }}
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
                  <div className="ninjadash-datatable-filter__input">
                    <Form.Item
                      name="status"
                      label={null}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <Select
                        placeholder="Trạng thái"
                        listHeight={155}
                        className="custom-select"
                        style={{ width: "100%", height: 45 }}
                        // showSearch
                        filterOption={(input, option) =>
                          (option?.label?.toString() ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        optionLabelProp="label"
                        aria-required
                      >
                        {statusOptions?.map((option) => (
                          <Select.Option
                            key={option.value}
                            value={option.value}
                            label={option.label}
                          >
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
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

        <Modal
          centered
          open={qrLink ? true : false}
          onCancel={() => {
            setAmount(0);
            setAuctionId(0);
            setAtTimeStamp(0);
            setQrLink("");
          }}
          footer=""
          closable={true}
        >
          <div
            style={{
              fontSize: 18,
              color: "#000",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Quét mã qr để thanh toán phiên
          </div>
          {qrLink && (
            <div style={{ textAlign: "center", userSelect: "none" }}>
              <img style={{ width: 500, height: 500 }} alt="" src={qrLink} />
            </div>
          )}
        </Modal>

        {/* Modal Confirm */}
        <Modal
          title="Xác nhận hủy phiên"
          visible={state.IsOpenModalConfirm}
          onCancel={handleCancel} // Đóng modal khi nhấn "Hủy"
          footer={[
            <Button
              style={{ backgroundColor: "#aba8a8" }}
              onClick={handleCancel}
            >
              Hủy
            </Button>,
            <Button
              key="confirm"
              type="primary"
              style={{ backgroundColor: "#489077" }}
              onClick={() => handleDeleteAuction(state.inActiveAuctionId)}
            >
              Xác nhận
            </Button>,
          ]}
        >
          <p>Bạn có chắc chắn muốn hủy phiên đấu giá này không?</p>
        </Modal>
      </div>
    </div>
  );
});

export default CommonLayout(MyAuctions);
