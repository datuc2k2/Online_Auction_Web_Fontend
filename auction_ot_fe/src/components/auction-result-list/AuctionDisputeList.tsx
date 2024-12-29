"use client";
import { fetchDisputeDetail, fetchDisputeList } from '@/store/auction/Actions';
import { RootState } from '@/store/RootReducer';
import { DatePicker, Form, Input, Modal } from 'antd';
import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { EyeIcon } from "@/components/icon-svg/IconSvg";
import CustomTable from '../custom-table/CustomTable';
import { Button } from '../component_base/components/buttons/Buttons';
import { useRouter } from 'next/navigation';
import { CheckOutlined, ScissorOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { callAdminConfirmPaymentApi, callConfirmPaymentApi } from '@/store/CallDirectAxios';
import { openNotification } from '@/utility/Utility';

interface IAuctionDisputeListTableData {
    index?: number | null;
    productName?: string;
    categoryName?: string;
    endPrice?: number;
    depositDeadline?: string;
    creatorName?: string;
    winnerName?: string;
    action?: ReactNode | null;
}

export default function AuctionDisputeList() {
    const dispatch = useDispatch<any>();
    const [form] = Form.useForm();
    const nameInput = Form.useWatch("name", form);
    const fromDateInput = Form.useWatch("fromDate", form);
    const toDateInput = Form.useWatch("toDate", form);
    const loading = useSelector((state: RootState) => state.payment.loading);
    const router = useRouter();
    // Lấy dữ liệu từ Redux store
    const disputeList = useSelector(
        (state: RootState) => state.auction.disputeList
    );
    const disputeDetail = useSelector(
        (state: RootState) => state.auction.disputeDetail
    );

    console.log('disputeDetail: ',disputeDetail);
    

    const [state, setState] = useState({
        page: 1,
        IsOpenModalConfirmFromUser: false,
        currentDisputeClickId: 0,
      });
    const [loadingConfirm, setLoadingConfirm] = useState();

    const [textConfirmCreator, setTextConfirmCreator] = useState('');
    const [textConfirmUser, setTextConfirmUser] = useState('');
    const [textConfirmAdmin, setTextConfirmAdmin] = useState('');

    useEffect(() => {
        if(disputeDetail) {
            setTextConfirmCreator(
                typeof disputeDetail?.disputeDto?.creatorEvidence === 'string'
                  ? disputeDetail?.disputeDto?.creatorEvidence
                  : ''
              );
              setTextConfirmUser(
                typeof disputeDetail?.disputeDto?.winnerEvidence === 'string'
                  ? disputeDetail?.disputeDto.winnerEvidence
                  : ''
              );
        }
    }, [disputeDetail])

    useEffect(() => {
        getDisputeList();
    }, [state.page]);

    const handleFilter = () => {
        if (state.page === 1) {
            getDisputeList();
        } else {
            setState((state) => ({ ...state, page: 1 }));
        }
    };

    const getDisputeList = () => {
        dispatch(
          fetchDisputeList({
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
          title: () => {
            return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Tên sản phẩm</div>;
          },
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: () => {
            return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Thể loại</div>;
          },
          dataIndex: "categoryName",
          key: "categoryName",
        },
        {
          title: () => {
            return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Giá đấu</div>;
          },
          dataIndex: "endPrice",
          key: "endPrice",
          align: "center" as const,
        },
        {
          title: () => {
            return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Hạn hoàn tiền cọc</div>;
          },
          dataIndex: "depositDeadline",
          key: "depositDeadline",
          align: "center" as const,
        },
        {
            title: () => {
                return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Tên người tạo phiên</div>;
              },
            dataIndex: "creatorName",
            key: "creatorName",
            align: "center" as const,
        },
        {
            title: () => {
                return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Tên người thắng</div>;
              },
            dataIndex: "winnerName",
            key: "winnerName",
            align: "center" as const,
        },
        {
            title: () => {
                return <div style={{ fontWeight: 550, whiteSpace: 'nowrap' }}>Hành động</div>;
              },
            dataIndex: "action",
            key: "action",
            align: "center" as const,
        },
    ];

    let tableDataSource: IAuctionDisputeListTableData[] = []; // 2 phut thoi

    disputeList?.disputeList?.map((item, index) => {
        const {
            disputeId,
            auctionId,
            winnerName,
            creatorName,
            auction: { productName, categoryName, endPrice, depositDeadline }
        } = item;

        // Thêm dữ liệu vào tableDataSource
        tableDataSource.push({
        index: (state.page - 1) * 10 + (index + 1),
        productName,
        categoryName: categoryName ? categoryName : '',
        endPrice,
        winnerName,
        creatorName,
        depositDeadline: moment(depositDeadline).format("DD-MM-YYYY hh:mm"),
        action: (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div
              onClick={() => router.push(`/auction-details?auctionId=${auctionId}`)}
              style={{ cursor: "pointer", marginRight: 20 }}
              >
                <EyeIcon />
            </div>
            <div
              onClick={() => {
                dispatch(fetchDisputeDetail(disputeId));
                setState({
                  ...state,
                  IsOpenModalConfirmFromUser: true,
                  currentDisputeClickId: disputeId,
                })
              }}
              style={{ cursor: "pointer", }}
              >
                <ScissorOutlined style={{ fontWeight: 700, fontSize: 16, padding: 0, width: 20, height: 20, backgroundColor: '#FFF', minWidth: 10}} />
            </div>
          </div>
        ),
        });
    });

    const onChangePage = (page: number) => {
        setState((state) => ({ ...state, page }));
    };

    const handleClickAccept = () => {
      const formData = new FormData();
      formData.append("DisputeID", state.currentDisputeClickId+'');
      formData.append("IsCreatorTrue", 'true');
      formData.append("Decision", textConfirmAdmin);
      callAdminConfirmPaymentApi(formData, setLoadingConfirm, callbackWhenConfirmPaymentUserSuccess);
    }

    const callbackWhenConfirmPaymentUserSuccess = () => {
      setState({ ...state, IsOpenModalConfirmFromUser: false });
      setTextConfirmUser('');
      setTextConfirmCreator('');
      setTextConfirmAdmin('');
      getDisputeList();
    }

    const handleClickReject = () => {
        const formData = new FormData();
        formData.append("DisputeID", state.currentDisputeClickId+'');
        formData.append("IsCreatorTrue", 'false');
        formData.append("Decision", textConfirmAdmin);
        callAdminConfirmPaymentApi(formData, setLoadingConfirm, callbackWhenConfirmPaymentUserSuccess);
    }

    const handleTextConfirmAdminChange = (e) => {
        setTextConfirmAdmin(e.target.value);
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
            Danh sách phiên đấu giá cần xử lý
          </h3>
        </div>
        <div style={{ marginBottom: 100 }}>
          <CustomTable
            dataSource={tableDataSource}
            columns={dataTableColumn}
            pagination={{
              pageSize: 10,
              onChange: onChangePage,
              total: disputeList?.allRecords ?? 0,
              current: state.page,
            }}
            loading={loading}
            header={`Danh sách phiên đấu giá có tranh chấp`}
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
        {!loading && (
          <Modal
            width={800}
            centered
            open={state.IsOpenModalConfirmFromUser}
            onCancel={() => {
              setState({ ...state, IsOpenModalConfirmFromUser: false });
              setTextConfirmUser("");
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
                marginBottom: 10,
              }}
            >
              Giải quyết phiên có tranh chấp
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "45%", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 18,
                    color: "#000",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Bằng chứng của người bán
                </div>
                <TextArea
                  value={textConfirmCreator}
                  disabled={true}
                  style={{ height: 120, marginBottom: 10 }}
                />
                {disputeDetail?.creatorEvidence?.fileUrl && (
                  <img
                    style={{ height: 250 }}
                    src={
                      disputeDetail?.creatorEvidence?.fileUrl +
                      process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                    }
                  />
                )}
              </div>
              <div style={{ width: "45%", textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 18,
                    color: "#000",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Bằng chứng của người mua
                </div>
                <TextArea
                  value={textConfirmUser}
                  disabled={true}
                  style={{ height: 120, marginBottom: 10 }}
                />
                {disputeDetail?.winnerEvidence?.fileUrl && (
                  <img
                    style={{ height: 250 }}
                    src={
                      disputeDetail?.winnerEvidence?.fileUrl +
                      process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                    }
                  />
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#000",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Lý do từ chối hoặc chấp thuận{" "}
              <span style={{ color: "red" }}> *</span>
            </div>
            <TextArea
              value={textConfirmAdmin}
              onChange={handleTextConfirmAdminChange}
              style={{ height: 120, marginBottom: 10 }}
            />
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Button
                style={{
                  width: 120,
                  marginLeft: 20,
                  backgroundColor: "#FFF",
                  color: "#164D9E",
                  border: "1px solid #164D9E",
                }}
                key="submit"
                onClick={handleClickReject}
                loading={loadingConfirm}
                disabled={!textConfirmAdmin}
              >
                Từ chối
              </Button>
              <Button
                style={{ width: 120, marginLeft: 20 }}
                mergetype="primary"
                key="submit"
                onClick={handleClickAccept}
                loading={loadingConfirm}
                disabled={!textConfirmAdmin}
              >
                Chấp thuận
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
}
