"use client";

import { DataTableStyleWrap } from "@/components/component_base/components/table/Style";
import { CommonLayout } from "@/layout/CommonLayout";
import { fetchListAccount } from "@/store/account/Actions";
import { RootState } from "@/store/RootReducer";
import { DatePicker, Empty, Form, Input, Select, Table } from "antd";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UilSearch from "@iconscout/react-unicons/dist/icons/uil-search";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { TableWrapper } from "../container/Style";
import { useRouter } from "next/navigation";
import { themeColor } from "@/config/theme/ThemeVariables";
import { UilPen, UilTrashAlt } from "@iconscout/react-unicons";
import CustomTable from "@/components/custom-table/CustomTable";
import StatusBadge from "@/components/custom-table/StatusBadge";
import { EyeOutlined } from "@ant-design/icons";
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import Breadcrumb from "@/components/Breadcrumb/page";
import moment from "moment";

interface IAccountTableData {
  userId?: number | null;
  username?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  isActive?: string | ReactNode;
  startDate?: string | null;
  action1?: ReactNode | null;
  action2?: ReactNode | null;
}

const AccountList = React.memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();
  const loading = useSelector((states: RootState) => states.account.loading);
  const accountListDataPaging = useSelector(
    (states: RootState) => states.account.accountListData
  );
  const nameInput = Form.useWatch("name", form);
  const emailInput = Form.useWatch("email", form);
  const fromDateInput = Form.useWatch("fromDate", form);
  const toDateInput = Form.useWatch("toDate", form);
  const status = Form.useWatch("status", form);
  console.log("status : ", status);

  const [state, setState] = useState({
    // searchName: "",
    page: 1,
  });

  useEffect(() => {
    getListAccount();
  }, [state.page]);

  const getListAccount = () => {
    // let keyWord = state.searchName.trim();
    // setState({ ...state, searchName: keyWord });
    dispatch(
      fetchListAccount({
        displayCount: state.page,
        pageCount: 10,
        searchUserName: nameInput ? nameInput : "",
        searchEmail: emailInput ? emailInput : "",
        startDate: fromDateInput
          ? moment(fromDateInput).format("YYYY-MM-DD")
          : null,
        endDate: toDateInput ? moment(toDateInput).format("YYYY-MM-DD") : null,
        status: status,
      })
    );
  };
  const router = useRouter();

  const handleNavigate = (userId: number, event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/account-details-managerment?userId=${userId}`);
  };

  const dataTableColumn = [
    {
      title: () => {
        return <div style={{ fontWeight: 550 }}>Stt</div>;
      },
      dataIndex: "userId",
      key: "userId",
      align: "center" as const,
      width: "3vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>
            Tên người dùng
          </div>
        );
      },
      dataIndex: "username",
      key: "username",
      width: "15vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>
            Tên người dùng
          </div>
        );
      },
      dataIndex: "username",
      key: "username",
      width: "15vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>Email</div>
        );
      },
      dataIndex: "email",
      key: "email",
      width: "22vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>
            Số điện thoại
          </div>
        );
      },
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15vw",
      align: "center" as const,
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>Ngày tạo</div>
        );
      },
      dataIndex: "startDate",
      key: "startDate",
      width: "15vw",
    },
    {
      title: () => {
        return (
          <div style={{ fontWeight: 550, textAlign: "center" }}>Trạng thái</div>
        );
      },
      dataIndex: "isActive",
      key: "isActive",
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
  const { Option } = Select;
  let tableDataSource: IAccountTableData[] = [];
  accountListDataPaging?.users?.map((item, index) => {
    const {
      userId,
      username,
      isActive,
      userProfile: { email, phoneNumber },
    } = item;
    return tableDataSource.push({
      userId: (state.page - 1) * 10 + (index + 1),
      username,
      email,
      phoneNumber,
      isActive: (
        <StatusBadge
          bgcolor={isActive ? "#2DA354" : "#f5222d"}
          status={isActive ? `Hoạt động` : "Cấm"}
        />
      ),
      action1: (
        <div
          onClick={(e) => handleNavigate(Number(item?.userId), e)}
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
      getListAccount();
    } else {
      setState((state) => ({ ...state, page: 1 }));
    }
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Danh sách tài khoản" },
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
          Danh sách tài khoản
        </h3>
      </div>
      <div
      //  style={{ marginBottom: 100 }}
      >
        <CustomTable
          dataSource={tableDataSource}
          columns={dataTableColumn}
          pagination={{
            pageSize: 10,
            onChange: onChangePage,
            total: accountListDataPaging?.allRecords ?? 0,
            current: state.page,
          }}
          loading={loading}
          // header={`Danh sách tài khoản`}
          filterComponent={
            <div
              style={{ display: "flex", marginTop: 20 }}
              className="ninjadash-datatable-filter"
            >
              <Form
                name="accountList"
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
                    style={{ marginRight: "10px", width: "20%" }}
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
                  <div
                    className="ninjadash-datatable-filter__input"
                    style={{ marginRight: "10px", width: "30%" }}
                  >
                    <Form.Item
                      name="email"
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
                        placeholder="Email"
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
                  <div
                    className="ninjadash-datatable-filter__input"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Form.Item
                      name="status"
                      style={{ width: "100%", textAlign: "center" }}
                    >
                      <Select
                        placeholder="Trạng thái"
                        style={{
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                        dropdownStyle={{
                          minWidth: "200px",
                        }}
                      >
                        <Select.Option
                          value={true}
                          style={{ whiteSpace: "nowrap", textAlign: "left" }}
                        >
                          Hoạt động
                        </Select.Option>
                        <Select.Option
                          value={false}
                          style={{ whiteSpace: "nowrap", textAlign: "left" }}
                        >
                          Không hoạt động
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Button
                    style={{
                      width: 130,
                      backgroundColor: "#489077",
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
});

export default CommonLayout(AccountList);
