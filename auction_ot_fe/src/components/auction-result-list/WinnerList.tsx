"use client";
import { fetchWinnerList } from '@/store/auction/Actions';
import { RootState } from '@/store/RootReducer';
import { DatePicker, Form, Input, Modal } from 'antd';
import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import CustomTable from '../custom-table/CustomTable';
import { Button } from '../component_base/components/buttons/Buttons';
import { useRouter } from 'next/navigation';
import { CheckOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { callConfirmPaymentApi } from '@/store/CallDirectAxios';
import { openNotification } from '@/utility/Utility';

interface IWinnerListTableData {
    index?: number | null;
    productName?: string;
    categoryName?: string;
    endPrice?: number;
    isPrivate?: string;
    depositDeadline?: string;
    confirmStatus?: ReactNode | string;
    action?: ReactNode | null;
}

export default function WinnerList() {
    const dispatch = useDispatch<any>();
    const [form] = Form.useForm();
    const nameInput = Form.useWatch("name", form);
    const fromDateInput = Form.useWatch("fromDate", form);
    const toDateInput = Form.useWatch("toDate", form);
    const loading = useSelector((state: RootState) => state.payment.loading);
    const router = useRouter();
    // Lấy dữ liệu từ Redux store
    const winnerList = useSelector(
        (state: RootState) => state.auction.winnerList
    );

    const [state, setState] = useState({
        page: 1,
        IsOpenModalConfirmFromUser: false,
        currentAuctionClickId: 0,
      });
    const [loadingConfirm, setLoadingConfirm] = useState();
    const [fileConfirmUser, setFileConfirmUser] = useState();
    const [textConfirmUser, setTextConfirmUser] = useState('');

    useEffect(() => {
        getWinnerList();
    }, [state.page]);

    const handleFilter = () => {
        if (state.page === 1) {
            getWinnerList();
        } else {
            setState((state) => ({ ...state, page: 1 }));
        }
    };

    const getWinnerList = () => {
        dispatch(
          fetchWinnerList({
            displayCount: state.page,
            pageCount: 10,
            searchText: nameInput ? nameInput : "",
            startDate: fromDateInput
              ? moment(fromDateInput).format("YYYY-MM-DD")
              : null,
            endDate: toDateInput ? moment(toDateInput).format("YYYY-MM-DD") : null,
          })
        );
    };

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
          title: "Tên sản phẩm",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "Thể loại",
          dataIndex: "categoryName",
          key: "categoryName",
        },
        {
          title: "Giá đấu",
          dataIndex: "endPrice",
          key: "endPrice",
          align: "center" as const,
        },
        {
          title: "Riêng tư",
          dataIndex: "isPrivate",
          key: "isPrivate",
        },
        {
          title: "Hạn hoàn tiền cọc",
          dataIndex: "depositDeadline",
          key: "depositDeadline",
          align: "center" as const,
        },
        {
            title: "Trạng thái xác nhận",
            dataIndex: "confirmStatus",
            key: "confirmStatus",
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            align: "center" as const,
        },
    ];

    let tableDataSource: IWinnerListTableData[] = []; // 2 phut thoi

    winnerList?.winnerList?.map((item, index) => {
        const {
          confirmStatus,
          depositDlStatus,
          auctionId,
          auction: { productName, categoryName, endPrice, isPrivate, depositDeadline, },
        } = item;

        // Thêm dữ liệu vào tableDataSource
        tableDataSource.push({
        index: (state.page - 1) * 10 + (index + 1),
        productName,
        categoryName,
        endPrice,
        isPrivate: isPrivate ? 'Riêng tư' : 'Công khai',
        depositDeadline: moment(depositDeadline).format("DD-MM-YYYY hh:mm"),
        confirmStatus: <div style={{color: depositDlStatus != 'Chưa tới hạn xác nhận' ? 'red' : confirmStatus == 'Đã xác nhận thanh toán' ? 'green' : 'red', whiteSpace: 'nowrap'}}>
          { depositDlStatus != 'Chưa tới hạn xác nhận' ? depositDlStatus : confirmStatus}
        </div>,
        action: confirmStatus == 'Đã xác nhận thanh toán' ? (
            <div
            onClick={() => router.push(`/auction-details?auctionId=${auctionId}`)}
            style={{ cursor: "pointer" }}
            >
                <EyeIcon />
            </div>
        ) : 
        (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div
              onClick={() => router.push(`/auction-details?auctionId=${auctionId}`)}
              style={{ cursor: "pointer", marginRight: 20 }}
              >
                <EyeIcon />
            </div>
            <div
              onClick={() => {
                setState({
                  ...state,
                  IsOpenModalConfirmFromUser: true,
                  currentAuctionClickId: auctionId,
                })
              }}
              style={{ cursor: "pointer", }}
              >
                <CheckOutlined style={{ fontWeight: 700, fontSize: 16, padding: 0, width: 20, height: 20, backgroundColor: '#FFF', minWidth: 10}} />
            </div>
          </div>
        ),
        });
    });

    const onChangePage = (page: number) => {
        setState((state) => ({ ...state, page }));
    };

    const handleClickConfirmUser = () => {
      const formData = new FormData();
      formData.append("AuctionId", state.currentAuctionClickId+'');
      formData.append("IsPaid", 'true');
      formData.append("CreatorEvidence", '');
      formData.append("WinnerEvidence", textConfirmUser);
      if(fileConfirmUser) {
        formData.append("FileEvidence", fileConfirmUser);
      }
      callConfirmPaymentApi(formData, setLoadingConfirm, callbackWhenConfirmPaymentUserSuccess);
    }

    const callbackWhenConfirmPaymentUserSuccess = () => {
      setState({ ...state, IsOpenModalConfirmFromUser: false });
      setTextConfirmUser('');
      setFileConfirmUser(undefined);
      getWinnerList();
    }

    const handleTextConfirmUserChange = (e) => {
      setTextConfirmUser(e.target.value);
    };

    const handleInputFileUser = (e) => {
      const file = e.target.files[0];
      if (file) {
        const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        if (validImageTypes.includes(file.type)) {
          setFileConfirmUser(file);
        } else {
          openNotification('error', '', 'File không hợp lệ');
        }
      }
    };

    return (
    <div>
      <div>
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
          Danh sách kết quả phiên đấu giá cần xử lý
        </h3>
      </div>
      <div style={{ marginBottom: 100 }}>
        <CustomTable
          dataSource={tableDataSource}
          columns={dataTableColumn}
          pagination={{
            pageSize: 10,
            onChange: onChangePage,
            total: winnerList?.allRecords ?? 0,
            current: state.page,
          }}
          loading={loading}
          header={`Danh sách phiên đấu giá đã chiến thắng`}
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
      <Modal
        centered
        open={state.IsOpenModalConfirmFromUser}
        onCancel={() => {
          setState({ ...state, IsOpenModalConfirmFromUser: false });
          setTextConfirmUser('');
          setFileConfirmUser(undefined);
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
            marginBottom: 10
          }}
        >
          Xác nhận đã thanh toán sản phẩm
        </div>
        <div style={{
            fontSize: 18,
            color: "#000",
            textAlign: "left",
            fontWeight: 600,
            marginBottom: 4
          }}>
            Bằng chứng
        </div>
        <TextArea onChange={handleTextConfirmUserChange} style={{height: 120, marginBottom: 10}} />
        <input accept=".png, .jpeg, .jpg, .gif, .webp"  onChange={handleInputFileUser} type='file' style={{display: 'block'}} />
        <div style={{textAlign: 'center', marginTop: 20}}>
          <Button
              style={{ width: 120, marginLeft: 20,  }}
              mergetype="primary"
              key="submit"
              onClick={handleClickConfirmUser}
              loading={loadingConfirm}
            >
              Xác nhận
          </Button>
        </div>
      </Modal>
    </div>
    )
}
