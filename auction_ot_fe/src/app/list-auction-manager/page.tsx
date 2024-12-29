"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
import {
  fetchListAuction,
  auctionIsAccepted,
  fetchListStatusAuction,
  fetchListAuctionAdmin,
} from "@/store/auction/Actions";
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import Breadcrumb from "@/components/Breadcrumb/page";

import AuctionRequest from "@/components/auction/AuctionRequest";
import CustomTable from "@/components/custom-table/CustomTable";

interface IAuctionListAdminTableData {
  index?: number | null;
  productName?: string | null;
  createdDate?: string | null;
  statusName?: string | null;
  description?: string | ReactNode;
  action1?: ReactNode | null;
}

// const PaymentListPage: React.FC = () => {
function AuctionListPage() {
  const dispatch = useDispatch<any>();
  const loading = useSelector((states: RootState) => states.auction.loading);
  const auctionStatus = useSelector(
    (states: RootState) => states.auction.auctionStatusList
  );
  const [form] = Form.useForm();
  // Lấy dữ liệu từ Redux store
  const auctionListDataPaging = useSelector(
    (state: RootState) => state.auction.auctionListAdmin
  );
  const nameInput = Form.useWatch("name", form);
  const fromDateInput = Form.useWatch("fromDate", form);
  const toDateInput = Form.useWatch("toDate", form);
  const statusInput = Form.useWatch("status", form);
  const [state, setState] = useState({
    page: 1,
  });
  useEffect(() => {
    getListAuctionAdmin();
    dispatch(fetchListStatusAuction());
  }, [state.page]);
  console.log("fet : ", fetchListStatusAuction);
  const router = useRouter();
  const getListAuctionAdmin = () => {
    dispatch(
      fetchListAuctionAdmin({
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
  const statusOptions = useMemo(() => {
    let statusReturn = [{ value: 0, label: "Tất cả" }];
    auctionStatus?.status.forEach((s) => {
      statusReturn.push({ value: s?.id, label: s?.name });
    });
    return statusReturn;
  }, [auctionStatus]);
  console.log("check333: ", auctionStatus);
  const handleClickDetail = (auctionId: number) => {
    router.push(`view-auction-detail?id=${auctionId}`);
  };
  // Cấu hình các cột cho bảng
  const dataTableColumn = [
    {
      title: () => {
        return <div style={{ fontWeight: 550 }}>Stt</div>;
      },
      dataIndex: "index",
      key: "index",
      align: "center" as const,
      width: "3vw",
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
      width: "15vw",
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
          <div style={{ fontWeight: 550, textAlign: "center" }}>Tình trạng</div>
        );
      },
      dataIndex: "statusName",
      key: "statusName",
      width: "10vw",
      align: "center" as const,
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>Mô tả</div>
        );
      },
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      dataIndex: "action1",
      key: "action1",
      width: 50,
    },
  ];
  let tableDataSource: IAuctionListAdminTableData[] = [];
  auctionListDataPaging?.auctionListAdmin?.map((item, index) => {
    const { auctionId, productName, createdAt, statusName, description } = item;
    return tableDataSource.push({
      index: (state.page - 1) * 10 + (index + 1),
      productName,
      createdDate: moment(createdAt).format("DD-MM-YYYY"),
      statusName: statusName,
      description,
      action1: (
        <div
          onClick={() => handleClickDetail(auctionId)}
          style={{ cursor: "pointer" }}
        >
          <EyeIcon />
        </div>
      ),
    });
  });
  const onChangePage = (page: number) => {
    setState((state) => ({ ...state, page }));
  };

  const handleFilter = () => {
    if (state.page === 1) {
      getListAuctionAdmin();
    } else {
      setState((state) => ({ ...state, page: 1 }));
    }
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Danh sách các phiên đấu giá" },
  ];

  return (
    <>
      {" "}
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
          Danh sách các phiên đấu giá
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
      </div>
    </>
  );
}
export default CommonLayout(React.memo(AuctionListPage));
