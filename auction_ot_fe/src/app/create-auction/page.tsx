// "use client";
// import { CommonLayout } from "@/layout/CommonLayout";
// import payment from "../../../public/assets/img/svg/Rectangle 28.svg";
// import {
//   Form,
//   Upload,
//   Tooltip,
//   Input,
//   Modal,
//   Row,
//   Col,
//   DatePicker,
//   Select,
//   Radio,
//   UploadProps,
//   UploadFile,
// } from "antd";
// import Picture from "../../../public/assets/img/svg/Picture.png";
// import Image from "next/image";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Button } from "@/components/component_base/components/buttons/Buttons";
// import { FormInstance } from "antd/es/form/Form";
// import moment from "moment";
// import { useRouter } from "next/navigation";
// import { openNotification } from "@/utility/Utility";
// import { useDispatch, useSelector } from "react-redux";
// import { updateProfile } from "@/store/auth/Actions";
// import { RootState } from "@/store/RootReducer";
// import type { UploadChangeParam } from "antd/es/upload";
// import { PictureOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import './RequestAuction.css'
// import { fetchCategory, requestAnAuction } from "@/store/auction/Actions";
// import { RequestAnAuctionModel } from "@/store/auction/Types";
// import { callCreateAnAuctionApi } from "../../store/CallDirectAxios";
// import TextArea from "antd/lib/input/TextArea";
// import { fetchListAccount } from "@/store/account/Actions";
// import Breadcrumb from "@/components/Breadcrumb/page";

// function requestAuction() {
//   const router = useRouter();
//   const dispatch = useDispatch<any>();
//   const [form] = Form.useForm();
//   const formRef = useRef<FormInstance<any>>(null);
//   const { Option } = Select;
//   const createForInput = Form.useWatch("createFor", form);
//   const nameInput = Form.useWatch("name", form);
//   const categoryInput = Form.useWatch("category", form);
//   const auctionMethodInput = Form.useWatch("auctionMethod", form);
//   const auctionModeInput = Form.useWatch("auctionMode", form);
//   const startPriceInput = Form.useWatch("startPrice", form);
//   const priceStepInput = Form.useWatch("priceStep", form);
//   const depositeAmountInput = Form.useWatch("depositeAmount", form);
//   const startTimeInput = Form.useWatch("startTime", form);
//   const endTimeInput = Form.useWatch("endTime", form);
//   const depositDeadlineInput = Form.useWatch("depositeDeadline", form);
//   const descriptionInput = Form.useWatch("description", form);
//   const userInvitesInput = Form.useWatch("userInvites", form);
//   const myInfo = useSelector((states: RootState) => states.auth.myInfo);
//   const categoryData = useSelector(
//     (state: RootState) => state.auction.categoryData
//   );

//   const [loading, setLoading] = useState(false);
//   const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

//   const accountList = useSelector(
//     (states: RootState) => states.account.accountListData
//   );

//   useEffect(() => {
//     fetchDataPageMount();
//   }, []);

//   const accountListExceptMe = useMemo(() => {
//     const accountListReturn = accountList?.users
//       ?.map((a) => {
//         return { value: a?.userId, label: a?.userProfile?.email };
//       })
//       ?.filter((a) => a?.value !== myInfo?.userId);
//     return accountListReturn;
//   }, [accountList]);

//   const fetchDataPageMount = () => {
//     dispatch(
//       fetchListAccount({
//         displayCount: 1,
//         pageCount: 10,
//         searchUserName: "",
//         searchEmail: "",
//         startDate: null,
//         endDate: null,
//         status: null,
//       })
//     );
//     dispatch(fetchCategory());
//   };

//   const uploadProps: UploadProps = {
//     listType: "picture-card",
//     fileList,
//     maxCount: 6, // Restrict to a maximum of 6 files
//     onChange: ({ fileList: newFileList }) => {
//       // Limit fileList to a maximum of 6 files
//       setFileList(newFileList.slice(0, 6) as UploadFile[]);
//     },
//     onPreview: async (file) => {
//       let src = file.url;
//       if (!src) {
//         src = await new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.readAsDataURL(file.originFileObj as Blob);
//           reader.onload = () => resolve(reader.result as string);
//         });
//       }
//       const imgWindow = window.open(src);
//       imgWindow?.document.write(`<img src="${src}" />`);
//     },
//     beforeUpload: (file) => {
//       // Prevent auto-upload and keep file in state
//       return false;
//     },
//   };

//   const validateStartTime = (_: any, value: any) => {
//     if (!value) {
//       return Promise.resolve();
//     }
//     const now = new Date();
//     if (value.isAfter(now)) {
//       return Promise.resolve();
//     }
//     return Promise.reject(
//       new Error("Thời điểm bắt đầu phải sau thời điểm hiện tại")
//     );
//   };

//   const validateDepositDealineTime = (_: any, value: any) => {
//     if (!value) {
//       return Promise.resolve();
//     }
//     const now = new Date();
//     if (value.isAfter(now)) {
//       return Promise.resolve();
//     }
//     return Promise.reject(
//       new Error("Hạn trả tiền phải sau thời điểm hiện tại")
//     );
//   };

//   const validateEndTime = (_: any, value: any) => {
//     if (!value) {
//       return Promise.resolve();
//     }

//     const now = new Date();
//     const startTime = new Date(startTimeInput);

//     if (value.isAfter(now) && (!startTime || value.isAfter(startTime))) {
//       return Promise.resolve();
//     }

//     return Promise.reject(
//       new Error(
//         "Thời điểm kết thúc phải sau thời điểm hiện tại và thời điểm bắt đầu"
//       )
//     );
//   };

//   const validateImages = () => {
//     if (fileList?.length < 1) {
//       return Promise.reject(new Error("Nhập ít nhất 1 ảnh"));
//     }
//     return Promise.resolve();
//   };

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       form.submit();
//       const formData = new FormData();

//       formData.append("Auction.UserID", createForInput);
//       formData.append("Auction.ProductName", nameInput);
//       formData.append("Auction.CategoryId", "1");
//       formData.append(
//         "Auction.IsPrivate",
//         auctionMethodInput === "public" ? "false" : "true"
//       );
//       formData.append("Auction.Mode", auctionModeInput);
//       formData.append("Auction.Currency", "VND");
//       formData.append("Auction.StartingPrice", startPriceInput);
//       formData.append("Auction.StepPrice", priceStepInput);
//       formData.append("Auction.DepositAmount", depositeAmountInput);
//       formData.append(
//         "Auction.StartTime",
//         startTimeInput?.format("YYYY-MM-DD HH:mm:ss")
//       );
//       formData.append(
//         "Auction.EndTime",
//         endTimeInput?.format("YYYY-MM-DD HH:mm:ss")
//       );
//       formData.append("Auction.Description", descriptionInput);
//       formData.append(
//         "Auction.DepositDeadline",
//         depositDeadlineInput?.format("YYYY-MM-DD HH:mm:ss")
//       );
//       // Append each file to FormData
//       fileList.forEach((file) => {
//         if (file.originFileObj) {
//           formData.append("images", file.originFileObj);
//         }
//       });

//       if (auctionMethodInput === "private") {
//         userInvitesInput?.map((id: number) => {
//           formData.append("Auction.InvitedIds", id + "");
//         });
//       }
//       callCreateAnAuctionApi(formData, setLoading, callBackWhenSuccess);
//     } catch (errorInfo) {}
//   };

//   const callBackWhenSuccess = () => {
//     formRef.current?.resetFields();
//     setFileList([]);
//   };
//   //Tên đường dẫn
//   const breadcrumbItems = [
//     { label: "Trang chủ", href: "/" },
//     { label: "Tạo yêu cầu tạo phiên đấu giá" },
//   ];
//   return (
//     <>
//       <div>
//         <Breadcrumb items={breadcrumbItems} />
//         <h3
//           style={{
//             fontSize: "1.5em",
//             fontWeight: "bold",
//             color: "#333",
//             margin: "20px 0",
//             textAlign: "left",
//             borderBottom: "2px solid #007bff",
//             paddingBottom: "10px",
//             fontFamily: "Arial, sans-serif",
//           }}
//         >
//           Tạo yêu cầu tạo phiên đấu giá
//         </h3>
//       </div>
//       <Form
//         name="requestAuction"
//         form={form}
//         layout="horizontal"
//         requiredMark={false}
//         colon={false}
//         labelCol={{ span: 6 }}
//         wrapperCol={{ span: 18 }}
//         labelAlign="left"
//         ref={formRef}
//       >
//         <Row gutter={[16, 16]} style={{ marginBottom: 100, marginTop: 50 }}>
//           {/* Col 1 */}
//           <Col xs={24} md={24} lg={12} span={12}>
//             <Row style={{justifyContent: 'space-between'}}>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="createFor"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Tạo cho
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     { required: true, message: "Tạo cho không được để trống" },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <Select
//                     listHeight={155}
//                     className="custom-select"
//                     style={{ width: "100%", fontSize: "15px" }}
//                     showSearch
//                     filterOption={(input, option) =>
//                       (option?.label?.toString() ?? "")
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                     optionLabelProp="label"
//                     aria-required
//                   >
//                     {accountListExceptMe?.map((option) => (
//                       <Select.Option
//                         key={option.value}
//                         value={option.value}
//                         label={option.label}
//                       >
//                         {option.label}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="name"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Tên sản phẩm
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     { required: true, message: "Tên sản phầm không được để trống" },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <Input
//                     style={{ height: 45, fontSize: "15px" }}
//                     className="custom-input"
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row style={{justifyContent: 'space-between'}}>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="category"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Loại sản phẩm
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Loại sản phẩm không được để trống",
//                     },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <Select>
//                     {categoryData?.categories?.map((c) => {
//                       return (
//                         <Option
//                           style={{ height: 45, fontSize: "15px" }}
//                           value={c?.id}
//                         >
//                           {c?.name}
//                         </Option>
//                       );
//                     })}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="auctionMode"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Chế độ đấu giá
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Chế độ đấu giá không được để trống",
//                     },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <Select style={{ height: 45, fontSize: "15px" }}>
//                     {categoryData?.modes?.map((m) => {
//                       return <Option value={m?.id}>{m?.name}</Option>;
//                     })}
//                   </Select>
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row style={{justifyContent: 'space-between'}}>
//               <Col span={12}>
//                 <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                   Phương thức đấu giá
//                 </span></Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="auctionMethod"
//                   label={null}
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Phương thức đấu giá không được để trống",
//                     },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <Radio.Group
//                     style={{ display: "flex", gap: "16px", fontSize: "15px", justifyContent: 'flex-end' }}
//                   >
//                     <Radio value="public">
//                       <div style={{whiteSpace: 'nowrap'}}>Công khai</div>
//                     </Radio>
//                     <Radio value="private">
//                       <div style={{whiteSpace: 'nowrap'}}>Nhóm kín</div>
//                       </Radio>
//                   </Radio.Group>
//                 </Form.Item>
//               </Col>
//             </Row>

//             {auctionMethodInput === "private" && (
//               <Form.Item
//                 name="userInvites"
//                 label={
//                   <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                     Danh sách mời
//                   </span>
//                 }
//                 labelCol={{ span: 24 }}
//                 wrapperCol={{ span: 24 }}
//                 rules={[
//                   {
//                     required: true,
//                     message: "Danh sách mời không được để trống",
//                   },
//                 ]}
//                 validateTrigger="onSubmit"
//               >
//                 <Select
//                   mode="multiple"
//                   listHeight={155}
//                   className="custom-select"
//                   style={{ width: "100%", fontSize: "15px" }}
//                   showSearch
//                   filterOption={(input, option) =>
//                     (option?.label?.toString() ?? "")
//                       .toLowerCase()
//                       .includes(input.toLowerCase())
//                   }
//                   optionLabelProp="label"
//                   aria-required
//                 >
//                   {accountListExceptMe?.map((option) => (
//                     <Select.Option
//                       key={option.value}
//                       value={option.value}
//                       label={option.label}
//                     >
//                       {option.label}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             )}

//             <Row style={{justifyContent: 'space-between'}}>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="startPrice"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Giá khởi điểm
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Giá khởi điểm không được để trống",
//                     },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <div style={{ position: "relative" }}>
//                     <Input
//                       style={{ height: 45, paddingRight: 45, fontSize: "15px" }}
//                       min={1}
//                       type="number"
//                       className="custom-input"
//                     />
//                     <span
//                       style={{
//                         position: "absolute",
//                         right: 10,
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         fontWeight: "bold",
//                         color: "#888",
//                       }}
//                     >
//                       VND
//                     </span>
//                   </div>
//                 </Form.Item>
//               </Col>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="priceStep"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Bước giá
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     { required: true, message: "Bước giá không được để trống" },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <div style={{ position: "relative" }}>
//                     <Input
//                       style={{ height: 45, paddingRight: 45, fontSize: "15px" }}
//                       min={1}
//                       type="number"
//                       className="custom-input"
//                     />
//                     <span
//                       style={{
//                         position: "absolute",
//                         right: 10,
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         fontWeight: "bold",
//                         color: "#888",
//                       }}
//                     >
//                       VND
//                     </span>
//                   </div>
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row style={{justifyContent: 'space-between'}}>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="depositeAmount"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Tiền cọc
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     { required: true, message: "Tiền cọc không được để trống" },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <div style={{ position: "relative" }}>
//                     <Input
//                       style={{ height: 45, paddingRight: 45, fontSize: "15px" }}
//                       min={1}
//                       type="number"
//                       className="custom-input"
//                     />
//                     <span
//                       style={{
//                         position: "absolute",
//                         right: 10,
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         fontWeight: "bold",
//                         color: "#888",
//                       }}
//                     >
//                       VND
//                     </span>
//                   </div>
//                 </Form.Item>
//               </Col>
//               <Col xs={24} md={11} span={11}>
//                 <Form.Item
//                   name="depositeDeadline"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Hạn trả tiền
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     { required: true, message: "Hạn trả tiền không được để trống" },
//                     { validator: validateDepositDealineTime },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <DatePicker
//                     style={{ width: "100%", height: 45, fontSize: "15px" }}
//                     placeholder="yyyy-mm-dd hh:mm:ss"
//                     format="YYYY-MM-DD HH:mm:ss"
//                     showTime={true}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row>
//               <Col span={11}>
//                 <Form.Item
//                   name="startTime"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Thời gian bắt đầu
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Thời gian bắt đầu không được để trống",
//                     },
//                     { validator: validateStartTime },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <DatePicker
//                     style={{ width: "100%", height: 45, fontSize: "15px" }}
//                     placeholder="yyyy-mm-dd hh:mm:ss"
//                     format="YYYY-MM-DD HH:mm:ss"
//                     showTime={true}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={2}></Col>
//               <Col span={11}>
//                 <Form.Item
//                   name="endTime"
//                   label={
//                     <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                       Ngày kết thúc
//                     </span>
//                   }
//                   labelCol={{ span: 24 }}
//                   wrapperCol={{ span: 24 }}
//                   rules={[
//                     {
//                       required: true,
//                       message: "Ngày kết thúc không được để trống",
//                     },
//                     { validator: validateEndTime },
//                   ]}
//                   validateTrigger="onSubmit"
//                 >
//                   <DatePicker
//                     style={{ width: "100%", height: 45, fontSize: "15px" }}
//                     placeholder="yyyy-mm-dd hh:mm:ss"
//                     format="YYYY-MM-DD HH:mm:ss"
//                     showTime={true}
//                   />
//                   {/* <Input type="date" /> */}
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Col>

//           {/* Col 2 */}
//           <Col xs={24} md={24} lg={12} span={12} style={{}}>
//             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
//               Tải lên hình ảnh (Tối đa 6 ảnh, ảnh đầu tiên sẽ là ảnh chính,
//               các ảnh tiếp theo là ảnh phụ)
//             </span>
//             <Form.Item
//               name="mainImage"
//               label={null}
//               labelCol={{ span: 24 }}
//               wrapperCol={{ span: 24 }}
//               style={{
//                 // border: "4px solid rgba(145, 175, 233, 0.1)",
//                 borderRadius: "15px",
//                 // padding: "40px",
//                 // marginBottom: 50,
//               }}
//               rules={[{ validator: validateImages }]}
//             >
//               <Upload.Dragger {...uploadProps} multiple>
//                 <p className="ant-upload-drag-icon">
//                   <Image
//                     src={Picture}
//                     alt="avatar"
//                     style={{ width: "94px", height: "94px" }}
//                   />
//                 </p>
//                 <p style={{ fontWeight: "bold", fontSize: "16px" }}>
//                   Thả hình ảnh của bạn tại đây, hoặc <a href="#">chọn</a>
//                 </p>
//                 <p>Hỗ trợ: PNG, JPG, JPEG, WEBP</p>
//               </Upload.Dragger>
//             </Form.Item>

//             <Row>
//               <Form.Item
//                 name="description"
//                 label={
//                   <span style={{ fontWeight: "bold", fontSize: "17px" }}>
//                     Miêu tả
//                   </span>
//                 }
//                 labelCol={{ span: 24 }}
//                 wrapperCol={{ span: 24 }}
//                 rules={[
//                   { required: true, message: "Miêu tả không được để trống" },
//                 ]}
//                 validateTrigger="onSubmit"
//                 style={{ width: "100%" }}
//               >
//                 <TextArea
//                   className="custom-input"
//                   style={{
//                     height: "180px",
//                     width: "100%",
//                     fontSize: "15px",
//                   }}
//                 />
//               </Form.Item>
//             </Row>

//             <Row>
//               <Col span={24} style={{ textAlign: "end" }}>
//                 <Button
//                   style={{
//                     width: 130,
//                     backgroundColor: "#489077",
//                     color: "#FFF",
//                     marginTop: 10,
//                     marginRight: 20,
//                   }}
//                   onClick={() => router.push("/")}
//                   disabled={loading}
//                 >
//                   Hủy
//                 </Button>
//                 <Button
//                   style={{
//                     width: 130,
//                     backgroundColor: "#489077",
//                     color: "#FFF",
//                     marginTop: 10,
//                     marginBottom: 60,
//                   }}
//                   onClick={handleSave}
//                   loading={loading}
//                 >
//                   Lưu
//                 </Button>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </Form>
//     </>
//   );
// }

// export default CommonLayout(React.memo(requestAuction));
