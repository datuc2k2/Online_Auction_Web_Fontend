"use client";
import { CommonLayout } from "@/layout/CommonLayout";
import {
  Form,
  Upload,
  Tooltip,
  Input,
  Modal,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";
// import Picture from "../../../public/assets/img/svg/";
import Link from "next/link";
import Picture from "../../../public/assets/img/avatar-default.jpg";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/component_base/components/buttons/Buttons";
import { FormInstance } from "antd/es/form/Form";
import moment from "moment";
import { useRouter } from "next/navigation";
import { openNotification } from "@/utility/Utility";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyInfo, setProfile, updateProfile } from "@/store/auth/Actions";
import { RootState } from "@/store/RootReducer";
import { callEKycApi, callUpdateProfileApi } from "@/store/CallDirectAxios";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload";
import "./AccountDetails.css";
import Breadcrumb from "@/components/Breadcrumb/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function accountDetails() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance<any>>(null);
  const formImageRef = useRef<FormInstance<any>>(null);
  const nameInput = Form.useWatch("Name", form);
  const emailInput = Form.useWatch("Email", form);
  const phoneNumberInput = Form.useWatch("PhoneNumber", form);
  const dateOfBirthInput = Form.useWatch("DateOfBirth", form);
  console.log("dateOfBirthInput : ", dateOfBirthInput);
  const adressInput = Form.useWatch("Address", form);
  const idetityNumberInput = Form.useWatch("IdetityNumber", form);
  const avatarInput = Form.useWatch("Avatar", form);
  const frontCardInput = Form.useWatch("frontCard", form);
  const backCardInput = Form.useWatch("backCard", form);
  const myInfo = useSelector((states: RootState) => states.auth.myInfo);
  console.log("myInfomyInfo: ", myInfo);

  const loading = useSelector((states: RootState) => states.auth.loading);

  const [state, setState] = useState({
    loadingApiCallDirect: false,
    IsOpenModalScanPortrait: false,
  });

  const fileInputAvatarRef = useRef<any>(null);
  const fileInputFrontCardRef = useRef<any>(null);
  const fileInputBackCardRef = useRef<any>(null);

  const handleClick = (type: number) => {
    if (type == 1) {
      if (fileInputAvatarRef.current) {
        fileInputAvatarRef.current.click();
      }
    } else if (type == 2) {
      if (fileInputFrontCardRef.current) {
        fileInputFrontCardRef.current.click();
      }
    } else {
      if (fileInputBackCardRef.current) {
        fileInputBackCardRef.current.click();
      }
    }
  };
  // const [dateOfBirthInputFormat, setDateOfBirthInputFormat] = useState(null);
  // const handleDateChange = (date) => {
  //   if (date) {
  //     setDateOfBirthInputFormat(date.toISOString()); // Chuyển đổi thành định dạng ISO 8601
  //   } else {
  //     setDateOfBirthInputFormat(null);
  //   }
  // };
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [frontCardUrl, setFrontCardUrl] = useState<any>(null);
  console.log("frontCardUrl: ", frontCardUrl);

  const [backCardUrl, setBackCardUrl] = useState<any>(null);

  const handleFileChange = (event: any, type: number) => {
    const file = event.target.files[0]; // Get the first file
    if (type == 1) {
      if (file) {
        setAvatarUrl(file);
      }
    } else if (type == 2) {
      if (file) {
        setFrontCardUrl(file);
      }
    } else {
      if (file) {
        setBackCardUrl(file);
      }
    }
  };
  const validateDateOfBirth = (_: any, value: moment.Moment) => {
    if (!value) {
      return Promise.reject(new Error("Ngày sinh không được để trống"));
    }

    const currentDate = moment();
    const birthDate = moment(value);
    const age = currentDate.diff(birthDate, "years");

    if (age < 16 || age > 150) {
      return Promise.reject(new Error("Năm sinh không hợp lệ."));
    }

    return Promise.resolve();
  };
  const validateIdentityNumber = (_: any, value: string) => {
    const identityNumberRegex = /^\d{12}$/;
    if (!value) {
      return Promise.resolve();
    }
    if (identityNumberRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Căn cước công dân phải gồm 12 chữ số"));
  };

  const base64ToBlob = (base64: string, type = "image/png") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  };

  useEffect(() => {
    if (myInfo) {
      formRef.current?.setFieldsValue({
        Name: myInfo?.username,
        Email: myInfo?.userProfile?.email,
        PhoneNumber: myInfo?.userProfile?.phoneNumber,
        DateOfBirth: myInfo?.userProfile?.dob
          ? moment(myInfo.userProfile.dob)
          : null,
        Address: myInfo?.userProfile?.address,
        IdetityNumber: myInfo?.userProfile?.cccd,
      });
      formImageRef.current?.setFieldsValue({
        frontCard: myInfo?.userProfile?.frontIdCard,
        backCard: myInfo?.userProfile?.backIdCard,
        Avatar: myInfo?.userProfile?.avatar,
      });
      if (myInfo?.userProfile?.avatar) {
        // const blobAvatar = base64ToBlob(myInfo.userProfile.avatar);
        setAvatarUrl(myInfo.userProfile.avatar);
      }
      if (myInfo?.userProfile?.frontIdCard) {
        const blobFrontIdCard = base64ToBlob(myInfo.userProfile.frontIdCard);
        setFrontCardUrl(blobFrontIdCard);
      }
      if (myInfo?.userProfile?.backIdCard) {
        const blobBackIdCard = base64ToBlob(myInfo.userProfile.backIdCard);
        setBackCardUrl(blobBackIdCard);
      }
      // setFrontCardUrl(base64ToBlob(myInf?.userProfile?.frontIdCard));
      // setBackCardUrl(base64ToBlob(myInf?.userProfile?.backIdCard));
      // setAvatarUrl(base64ToBlob(myInf?.userProfile?.avatar));
    }
  }, [myInfo]);
  // useEffect(() => {
  //   console.log("dob123 : ", dateOfBirthInputFormat);
  // }, [dateOfBirthInputFormat]);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const validatePhone = (_: any, value: string) => {
    const phoneRegex = /^\d{10}$/; // Chỉ chấp nhận 10 chữ số
    if (!value) {
      return Promise.resolve(); // Bỏ qua nếu giá trị rỗng, quy tắc 'required' sẽ xử lý
    }
    if (phoneRegex.test(value)) {
      return Promise.resolve(); // Số điện thoại hợp lệ
    }
    return Promise.reject(new Error("Số điện thoại phải có đúng 10 chữ số"));
  };
  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/png, image/jpeg, image/jpg, image/webp",
    beforeUpload: (file: any) => {
      // Logic upload file nếu cần thiết
      return false; // Trả về false để ngăn không upload tự động
    },
  };

  const handleSaveChange = async () => {
    try {
      // Validate both forms simultaneously
      await form.validateFields();
      // If validation passes for both, submit both forms
      form.submit();

      const formData = new FormData();
      formData.append("Username", nameInput);
      formData.append("FullName", nameInput);
      formData.append("Email", emailInput);
      formData.append("PhoneNumber", phoneNumberInput);
      formData.append("Address", adressInput);
      formData.append("Avatar", avatarUrl);
      formData.append(
        "Cccd",
        idetityNumberInput ? idetityNumberInput : myInfo?.userProfile?.cccd
      );
      formData.append("FrontIdCard", frontCardUrl);
      formData.append("BackIdCard", backCardUrl);
      formData.append("Dob", moment(dateOfBirthInput).format("YYYY-MM-DD"));

      // formData.append("Dob", moment(dateOfBirthInput).toISOString());
      setState({
        ...state,
        loadingApiCallDirect: true,
      });
      callUpdateProfileApi(
        formData,
        () => dispatch(fetchMyInfo()),
        callBackWhenFinally
      );
    } catch (error) {
      setState({
        ...state,
        loadingApiCallDirect: false,
      });
    }
  };

  const callBackWhenFinally = () => {
    setState({
      ...state,
      loadingApiCallDirect: false,
    });
  };
  //Tên đường dẫn
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tài khoản của tôi" },
  ];

  const webcamRef = useRef<any>(null);
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [loadingCccd, setLoadingCccd] = useState(false);

  useEffect(() => {
    if (imgSrc) {
      const formData = new FormData();
      formData.append("portrait_img", imgSrc);
      formData.append(
        "clientSession",
        "IOS_iphone6plus_ios13_Device_1.3.6_CC332797-E3E5-475F-8546-C9C4AA348837_1581429032"
      );
      callEKycApi(formData, setLoadingCccd, callBackSuccess, callBackFinally);
    }
  }, [imgSrc]);

  const callBackSuccess = () => {
    dispatch(
      setProfile({
        ...myInfo,
        isEkyc: true,
      })
    );
  };

  const callBackFinally = () => {
    setState({ ...state, IsOpenModalScanPortrait: false });
    setImgSrc(null);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      const base64ToBlob = (base64: string) => {
        const byteString = atob(base64.split(",")[1]);
        const mimeType = base64.match(/data:(.*?);base64/)?.[1] || "image/png";
        const arrayBuffer = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          arrayBuffer[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: mimeType });
      };

      const blob = base64ToBlob(imageSrc);
      setImgSrc(blob);
    }
  }, [webcamRef, setImgSrc]);

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
          Tài khoản của tôi
        </h3>
      </div>
      <div className="dashboard-section pt-50 mb-110">
        <div className="container">
          <div
            className="dashboard-wrapper"
            style={{ gridTemplateColumns: "24% 76%" }}
          >
            <div className="dashboard-sidebar-menu">
              <ul>
                <li>
                  <Link href="/my-auctions">
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="M0.576752 14.7397C1.06384 15.2274 1.85313 15.2276 2.34107 14.7397L8.75357 8.32749L9.71579 9.28972C9.36131 9.64867 9.36219 10.2284 9.71942 10.5856L10.2652 11.1317C10.6232 11.4902 11.2074 11.4906 11.5658 11.1317L14.8359 7.8616C15.1945 7.50301 15.1945 6.91991 14.8359 6.56128L14.2898 6.0152C13.9331 5.65797 13.3526 5.65681 12.9937 6.01157L9.30489 2.3228C9.65937 1.96386 9.65849 1.38389 9.30127 1.02666L8.75519 0.480582C8.39712 0.121988 7.81321 0.121426 7.45462 0.480582L4.1848 3.75068C3.82621 4.10927 3.82621 4.69265 4.1848 5.05125L4.73088 5.59708C5.08681 5.953 5.66569 5.95726 6.02678 5.6007L6.98901 6.56293L0.576787 12.9754C0.0893805 13.4628 0.088607 14.2521 0.576752 14.7397ZM13.3776 6.40357C13.5173 6.26358 13.7612 6.26358 13.9014 6.40357L14.4475 6.94965C14.5916 7.09372 14.5926 7.32811 14.4475 7.4732L11.1774 10.7433C11.0374 10.8836 10.7936 10.8833 10.6536 10.7433L10.1078 10.1972C9.96368 10.0531 9.96266 9.81875 10.1078 9.67366C11.2649 8.51646 12.2299 7.55145 13.3776 6.40357ZM5.6428 5.20868C5.50281 5.34867 5.25925 5.34867 5.11926 5.20868L4.57317 4.66288C4.42917 4.51888 4.42801 4.28421 4.57317 4.13905L7.84299 0.868953C7.98298 0.728961 8.22654 0.728961 8.36681 0.868953L8.9129 1.41504C9.05806 1.5602 9.0569 1.79486 8.9129 1.93886L5.6428 5.20868ZM6.41557 5.21272L8.91694 2.7116L12.6049 6.39956L10.1038 8.90093L6.41557 5.21272ZM0.965123 13.3638L7.37734 6.95127L8.36516 7.93909L1.95266 14.3513C1.68846 14.6155 1.22876 14.615 0.965087 14.3513C0.692064 14.0783 0.692064 13.6369 0.965123 13.3638ZM16.7378 14.6636V14.0134C16.7378 13.3284 16.1804 12.771 15.4954 12.771H10.233C9.54803 12.771 8.99066 13.3284 8.99066 14.0134V14.6636C8.39673 14.7564 7.93953 15.2671 7.93953 15.8866V17.5144C7.9395 17.5505 7.94659 17.5862 7.96038 17.6195C7.97418 17.6529 7.99441 17.6832 8.01991 17.7087C8.04542 17.7342 8.07571 17.7544 8.10904 17.7682C8.14237 17.782 8.17809 17.7891 8.21417 17.7891H17.5143C17.5503 17.7891 17.5861 17.782 17.6194 17.7682C17.6527 17.7544 17.683 17.7342 17.7085 17.7087C17.734 17.6832 17.7542 17.6529 17.768 17.6195C17.7818 17.5862 17.7889 17.5505 17.7889 17.5144V15.8866C17.7889 15.2671 17.3317 14.7564 16.7378 14.6636ZM9.53998 14.0134C9.53998 13.6312 9.85083 13.3203 10.233 13.3203H15.4954C15.8777 13.3203 16.1885 13.6312 16.1885 14.0134V14.6442H9.53998V14.0134ZM17.2397 17.2397H8.48884V15.8866C8.48884 15.5044 8.79969 15.1935 9.18191 15.1935H16.5466C16.9288 15.1935 17.2397 15.5044 17.2397 15.8866V17.2397Z" />
                      </g>
                    </svg>
                    <h6>Phiên đấu giá của tôi</h6>
                  </Link>
                </li>
                <li>
                  <Link href="/payment-list">
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="M17.1816 9.07549V6.54563C17.1816 5.68778 16.5162 4.99012 15.6755 4.92247L13.326 0.818843C13.1083 0.439316 12.7568 0.168054 12.3361 0.0554156C11.9174 -0.0564561 11.4796 0.00229861 11.1048 0.220404L3.05087 4.90928H1.63635C0.733897 4.90928 0 5.64314 0 6.54563V16.3636C0 17.2661 0.733859 18 1.63635 18H15.5452C16.4477 18 17.1816 17.2661 17.1816 16.3636V13.8338C17.6567 13.6643 17.9997 13.2145 17.9997 12.6819V10.2274C17.9997 9.69476 17.6567 9.24493 17.1816 9.07549ZM14.7248 4.90928H11.1592L13.8334 3.35235L14.7248 4.90928ZM13.4269 2.64235L9.53311 4.90928H7.918L13.0231 1.93702L13.4269 2.64235ZM11.5167 0.927494C11.7017 0.819227 11.9178 0.790463 12.1243 0.845613C12.3333 0.90153 12.5075 1.03657 12.6157 1.22552L12.6166 1.22702L6.29201 4.90928H4.67698L11.5167 0.927494ZM16.3634 16.3636C16.3634 16.8147 15.9962 17.1818 15.5452 17.1818H1.63635C1.18533 17.1818 0.818194 16.8147 0.818194 16.3636V6.54563C0.818194 6.09461 1.18533 5.72747 1.63635 5.72747H15.5452C15.9962 5.72747 16.3634 6.09461 16.3634 6.54563V9.00013H13.9089C12.5554 9.00013 11.4544 10.1011 11.4544 11.4546C11.4544 12.8081 12.5554 13.9091 13.9089 13.9091H16.3634V16.3636ZM17.1816 12.6819C17.1816 12.9076 16.9982 13.091 16.7725 13.091H13.9089C13.0064 13.091 12.2725 12.3571 12.2725 11.4546C12.2725 10.5522 13.0064 9.81829 13.9089 9.81829H16.7725C16.9982 9.81829 17.1816 10.0016 17.1816 10.2274V12.6819Z" />
                        <path d="M13.908 10.6367C13.457 10.6367 13.0898 11.0039 13.0898 11.4549C13.0898 11.9059 13.457 12.273 13.908 12.273C14.359 12.273 14.7262 11.9059 14.7262 11.4549C14.7262 11.0039 14.3591 10.6367 13.908 10.6367Z" />
                      </g>
                    </svg>
                    <h6>Lịch sử giao dịch</h6>
                  </Link>
                </li>
                <li>
                  <Link href="/account-details">
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="M9.84 18H8.16C7.88533 17.9997 7.62026 17.8989 7.41491 17.7165C7.20955 17.534 7.07814 17.2827 7.0455 17.01L6.86625 15.603C6.51207 15.488 6.16751 15.3454 5.83575 15.1763L4.71525 16.047C4.4989 16.2171 4.22747 16.3014 3.95283 16.284C3.67819 16.2666 3.41961 16.1486 3.2265 15.9525L2.04525 14.7712C1.85026 14.5783 1.73315 14.3204 1.71627 14.0466C1.69939 13.7728 1.78393 13.5024 1.95375 13.287L2.8245 12.1658C2.65477 11.8343 2.51206 11.4897 2.39775 11.1353L0.98775 10.956C0.715368 10.9224 0.464659 10.7904 0.282761 10.5849C0.100863 10.3793 0.00030711 10.1145 0 9.84L0 8.16C0 7.59225 0.42525 7.113 0.99 7.0455L2.397 6.86625C2.51196 6.51207 2.65465 6.16751 2.82375 5.83575L1.95375 4.71525C1.78325 4.49889 1.69867 4.22717 1.71625 3.95227C1.73383 3.67736 1.85233 3.41863 2.049 3.22575L3.23025 2.0445C3.42325 1.84966 3.6812 1.73265 3.95493 1.71578C4.22866 1.6989 4.49903 1.78334 4.7145 1.953L5.835 2.8245C6.16695 2.65527 6.51178 2.51257 6.86625 2.39775L7.0455 0.98775C7.113 0.42525 7.59225 0 8.16 0H9.84C10.4078 0 10.887 0.42525 10.9545 0.99L11.1337 2.397C11.4923 2.51325 11.8372 2.6565 12.165 2.82375L13.2855 1.953C13.5018 1.78271 13.7734 1.69826 14.0481 1.71584C14.3228 1.73342 14.5814 1.85179 14.7743 2.04825L15.9555 3.2295C16.3582 3.62025 16.3988 4.26 16.047 4.71375L15.1763 5.835C15.3443 6.16275 15.4875 6.50775 15.603 6.8655L17.013 7.04475C17.2852 7.07839 17.5357 7.2103 17.7175 7.41568C17.8992 7.62105 17.9997 7.88575 18 8.16V9.84C18 10.4078 17.5748 10.887 17.01 10.9545L15.603 11.1337C15.488 11.4879 15.3454 11.8325 15.1763 12.1642L16.047 13.2847C16.2173 13.5011 16.3017 13.7726 16.2842 14.0473C16.2666 14.3221 16.1482 14.5807 15.9517 14.7735L14.7705 15.9548C14.5777 16.1499 14.3197 16.2671 14.0459 16.284C13.772 16.3009 13.5016 16.2162 13.2863 16.0462L12.165 15.1755C11.8335 15.3452 11.4889 15.4879 11.1345 15.6022L10.9552 17.0123C10.9218 17.2846 10.7899 17.5353 10.5846 17.7172C10.3792 17.8991 10.1144 17.9997 9.84 18ZM5.7975 14.355C5.85975 14.355 5.9235 14.3707 5.9805 14.4022C6.40142 14.6366 6.84784 14.8218 7.311 14.9542C7.38141 14.9745 7.44436 15.0148 7.49207 15.0704C7.53979 15.126 7.57018 15.1943 7.5795 15.267L7.7895 16.917C7.812 17.1052 7.97475 17.25 8.16 17.25H9.84C9.93093 17.2488 10.0184 17.2148 10.0863 17.1543C10.1542 17.0939 10.198 17.0109 10.2098 16.9207L10.4205 15.2677C10.4298 15.1951 10.4602 15.1268 10.5079 15.0712C10.5556 15.0156 10.6186 14.9752 10.689 14.955C11.1522 14.8225 11.5986 14.6373 12.0195 14.403C12.0837 14.3671 12.1571 14.351 12.2305 14.3566C12.3039 14.3622 12.374 14.3893 12.432 14.4345L13.7445 15.4545C13.8152 15.5114 13.9044 15.5403 13.995 15.5355C14.0856 15.5308 14.1713 15.4929 14.2358 15.429L15.4245 14.2402C15.4895 14.1759 15.5285 14.0897 15.5339 13.9983C15.5393 13.907 15.5107 13.8169 15.4537 13.7452L14.4338 12.4327C14.3886 12.3747 14.3616 12.3046 14.356 12.2312C14.3504 12.1579 14.3665 12.0845 14.4022 12.0203C14.6366 11.5993 14.8218 11.1529 14.9542 10.6898C14.9745 10.6193 15.0148 10.5564 15.0704 10.5087C15.126 10.461 15.1943 10.4306 15.267 10.4213L16.917 10.2113C17.0079 10.1999 17.0917 10.1561 17.1529 10.0878C17.214 10.0196 17.2485 9.93162 17.25 9.84V8.16C17.2488 8.06907 17.2148 7.98163 17.1543 7.91372C17.0939 7.84581 17.0109 7.80197 16.9207 7.79025L15.2677 7.5795C15.1951 7.57018 15.1268 7.53979 15.0712 7.49207C15.0156 7.44436 14.9752 7.38141 14.955 7.311C14.8225 6.84784 14.6373 6.40142 14.403 5.9805C14.3669 5.91632 14.3507 5.84289 14.3563 5.76948C14.3619 5.69607 14.3891 5.62596 14.4345 5.568L15.4545 4.2555C15.5116 4.18509 15.5407 4.09605 15.5361 4.00551C15.5315 3.91497 15.4936 3.82931 15.4298 3.765L14.241 2.57625C14.1769 2.51076 14.0906 2.47149 13.9991 2.46609C13.9076 2.46068 13.8174 2.48952 13.746 2.547L12.4335 3.567C12.3753 3.61228 12.3051 3.63942 12.2316 3.64503C12.1581 3.65063 12.0846 3.63445 12.0203 3.5985C11.5994 3.36399 11.153 3.17877 10.6898 3.0465C10.6193 3.02629 10.5564 2.9859 10.5087 2.93032C10.461 2.87474 10.4306 2.80641 10.4213 2.73375L10.2113 1.08375C10.2 0.992692 10.1563 0.908757 10.0881 0.847421C10.0198 0.786085 9.93173 0.751484 9.84 0.75H8.16C8.06907 0.751226 7.98163 0.785191 7.91372 0.845666C7.84581 0.906141 7.80197 0.989072 7.79025 1.07925L7.5795 2.73225C7.57013 2.80497 7.53974 2.87338 7.49204 2.92907C7.44434 2.98477 7.38142 3.02532 7.311 3.04575C6.84779 3.17776 6.40134 3.36273 5.9805 3.597C5.91622 3.63305 5.84274 3.64936 5.76924 3.64389C5.69574 3.63842 5.62549 3.61142 5.56725 3.56625L4.25475 2.54625C4.18434 2.48915 4.0953 2.46009 4.00476 2.46466C3.91422 2.46923 3.82856 2.5071 3.76425 2.571L2.5755 3.7605C2.51047 3.82489 2.47152 3.91104 2.46612 4.0024C2.46072 4.09376 2.48926 4.18389 2.54625 4.2555L3.56625 5.568C3.61138 5.62609 3.63843 5.69617 3.64403 5.76951C3.64963 5.84286 3.63354 5.91623 3.59775 5.9805C3.36313 6.40127 3.17791 6.84772 3.04575 7.311C3.02554 7.38141 2.98515 7.44436 2.92957 7.49207C2.87399 7.53979 2.80566 7.57018 2.733 7.5795L1.083 7.7895C0.992079 7.80055 0.908243 7.84418 0.847018 7.9123C0.785792 7.98042 0.751326 8.06842 0.75 8.16V9.84C0.75 10.0252 0.89475 10.188 1.07925 10.2098L2.73225 10.4205C2.80491 10.4298 2.87324 10.4602 2.92882 10.5079C2.9844 10.5556 3.02479 10.6186 3.045 10.689C3.18 11.1585 3.366 11.6062 3.597 12.0195C3.63307 12.0837 3.64933 12.1571 3.64373 12.2305C3.63812 12.3039 3.6109 12.374 3.5655 12.432L2.5455 13.7445C2.4884 13.8149 2.45934 13.904 2.46391 13.9945C2.46848 14.085 2.50635 14.1707 2.57025 14.235L3.759 15.4237C3.82331 15.4889 3.90948 15.528 4.00089 15.5334C4.09229 15.5388 4.18246 15.5102 4.254 15.453L5.5665 14.433C5.63306 14.3827 5.7141 14.3554 5.7975 14.355Z" />
                        <path d="M9 12.75C6.93225 12.75 5.25 11.0678 5.25 9C5.25 6.93225 6.93225 5.25 9 5.25C11.0678 5.25 12.75 6.93225 12.75 9C12.75 11.0678 11.0678 12.75 9 12.75ZM9 6C7.3455 6 6 7.3455 6 9C6 10.6545 7.3455 12 9 12C10.6545 12 12 10.6545 12 9C12 7.3455 10.6545 6 9 6Z" />
                      </g>
                    </svg>
                    <h6>Thông tin cá nhân</h6>
                  </Link>
                </li>
                <li>
                  <Link href="/change-password">
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="M9 0C6.1875 0 3.9375 2.25 3.9375 5.0625V7.3125C2.98125 7.3125 2.25 8.04375 2.25 9V16.3125C2.25 17.2687 2.98125 18 3.9375 18H14.0625C15.0188 18 15.75 17.2687 15.75 16.3125V9C15.75 8.04375 15.0188 7.3125 14.0625 7.3125V5.0625C14.0625 2.25 11.8125 0 9 0ZM14.625 9V16.3125C14.625 16.65 14.4 16.875 14.0625 16.875H3.9375C3.6 16.875 3.375 16.65 3.375 16.3125V9C3.375 8.6625 3.6 8.4375 3.9375 8.4375H14.0625C14.4 8.4375 14.625 8.6625 14.625 9ZM5.0625 7.3125V5.0625C5.0625 2.86875 6.80625 1.125 9 1.125C11.1938 1.125 12.9375 2.86875 12.9375 5.0625V7.3125H5.0625Z" />
                        <path d="M9 10.1248C8.04375 10.1248 7.3125 10.856 7.3125 11.8123C7.3125 12.5435 7.7625 13.1623 8.4375 13.3873V14.6248C8.4375 14.9623 8.6625 15.1873 9 15.1873C9.3375 15.1873 9.5625 14.9623 9.5625 14.6248V13.3873C10.2375 13.1623 10.6875 12.5435 10.6875 11.8123C10.6875 10.856 9.95625 10.1248 9 10.1248ZM9 12.3748C8.6625 12.3748 8.4375 12.1498 8.4375 11.8123C8.4375 11.4748 8.6625 11.2498 9 11.2498C9.3375 11.2498 9.5625 11.4748 9.5625 11.8123C9.5625 12.1498 9.3375 12.3748 9 12.3748Z" />
                      </g>
                    </svg>
                    <h6>Thay đổi mật khẩu</h6>
                  </Link>
                </li>
              </ul>
            </div>{" "}
            <div className="dashboard-content-wrap two">
              <div className="settings-wrap">
                <Form
                  name="accountDetails"
                  form={form}
                  // layout="horizontal"
                  // requiredMark={false}
                  // colon={false}
                  // labelCol={{ span: 6 }}
                  // labelAlign="left"
                  ref={formRef}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className="edit-info-area"
                  >
                    <div>
                      <h6>Ảnh đại diện</h6>
                      <div className="edit-profile-img-area">
                        <div className="profile-img">
                          <Form.Item
                            name="Avatar"
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Hình ảnh đại diện không được để trống",
                            //   },
                            // ]}
                            validateTrigger="onChange"
                          >
                            <div
                              className="profile-img"
                              onClick={() => handleClick(1)}
                            >
                              <input
                                ref={fileInputAvatarRef} // Attach the ref to the input
                                style={{ display: "none" }} // Hide the default file input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 1)}
                              />
                              {!avatarUrl && (
                                <img
                                  src={"/assets/img/avatar-default.jpg"}
                                  alt="Uploaded"
                                  style={{
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                              {avatarUrl && (
                                <img
                                  src={
                                    typeof avatarUrl === "string"
                                      ? avatarUrl +
                                        process.env.NEXT_PUBLIC_IMAGE_POSTFIX
                                      : URL.createObjectURL(avatarUrl)
                                  }
                                  alt="Uploaded"
                                />
                              )}
                            </div>
                          </Form.Item>
                        </div>
                        <div className="upload-img-area">
                          <h6>Tải ảnh tại đây</h6>
                          <div className="upload-filed">
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e, 1)}
                            />
                          </div>
                          <span>Hỗ trợ: PNG, JPG, JPEG, WEBP</span>
                        </div>
                      </div>
                    </div>
                    {myInfo?.userProfile?.frontIdCard && !myInfo?.isEkyc ? (
                      <Button
                        style={{
                          width: 130,
                          backgroundColor: "#01AA85",
                          color: "#FFF",
                          marginTop: 10,
                        }}
                        onClick={() =>
                          setState({ ...state, IsOpenModalScanPortrait: true })
                        }
                      >
                        Xác thực danh tính
                      </Button>
                    ) : myInfo?.isEkyc ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: 18,
                        }}
                      >
                        <CheckCircleOutlined
                          style={{
                            fontSize: 24,
                            color: "#01AA85",
                            marginRight: 8,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: "#01AA85",
                          }}
                        >
                          Đã xác thực danh tính
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{ fontSize: 20, color: "#000", fontWeight: 600 }}
                      >
                        Vui lòng cập nhật thông tin để xác thực
                      </div>
                    )}
                  </div>

                  <div className="edit-info-area" style={{ marginTop: "30px" }}>
                    <h6>Thông tin cá nhân</h6>
                    <div className="edit-info-form">
                      <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-md-12">
                          <Form.Item
                            name="Name"
                            label={
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Tên người dùng
                              </span>
                            }
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: "Tên người dùng không được để trống",
                              },
                            ]}
                          >
                            <Input
                              style={{ fontSize: "15px" }}
                              className="custom-input"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-12">
                          <Form.Item
                            name="Email"
                            label={
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Email
                              </span>
                            }
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: "Email không được để trống",
                              },
                            ]}
                          >
                            <Input
                              style={{ fontSize: "15px" }}
                              disabled
                              className="custom-input"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-12">
                          <Form.Item
                            name="PhoneNumber"
                            label={
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Số điện thoại
                              </span>
                            }
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            validateTrigger="onChange"
                            rules={[{ validator: validatePhone }]}
                          >
                            <Input
                              style={{ fontSize: "15px" }}
                              className="custom-input"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-12 ">
                          <Form.Item
                            name="DateOfBirth"
                            label={
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Ngày sinh
                              </span>
                            }
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ validator: validateDateOfBirth }]}
                          >
                            <DatePicker
                              style={{
                                width: "100%",
                                height: "40px",
                                fontSize: "15px",
                              }}
                              // onChange={handleDateChange}
                              format={"DD-MM-YYYY"}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-12">
                          <Form.Item
                            name="Address"
                            label={
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                }}
                              >
                                Địa chỉ
                              </span>
                            }
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                              {
                                required: true,
                                message: "Địa chỉ không được để trống",
                              },
                            ]}
                          >
                            <Input
                              style={{ fontSize: "15px" }}
                              className="custom-input"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="edit-info-area" style={{ marginTop: "30px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h6
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        Thông tin căn cước công dân
                      </h6>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        style={{
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                        onClick={toggleExpand}
                      />
                    </div>
                    {isExpanded && (
                      <div className="edit-info-form">
                        <div className="row" style={{ marginTop: "20px" }}>
                          <div className="col-md-6">
                            <Form.Item
                              name="IdetityNumber"
                              label={
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                  }}
                                >
                                  Số căn cước công dân{" "}
                                </span>
                              }
                              labelCol={{ span: 24 }}
                              wrapperCol={{ span: 24 }}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Căn cước công dân không được để trống",
                                },
                                { validator: validateIdentityNumber },
                              ]}
                              validateTrigger="onChange"
                            >
                              <Input
                                style={{ fontSize: "15px" }}
                                className="custom-input"
                              />
                            </Form.Item>
                          </div>
                          <div className="col-md-6 ">
                            <Row gutter={[16, 0]} justify="end">
                              <Col span={12}>
                                <Form.Item
                                  name="frontCard"
                                  style={{
                                    borderRadius: "15px",
                                  }}
                                  // rules={[
                                  //   {
                                  //     required: true,
                                  //     message:
                                  //       "Mặt trước căn cước không được để trống",
                                  //   },
                                  // ]}
                                  validateTrigger="onChange"
                                >
                                  <div
                                    style={{
                                      border: "4px dashed rgba(0, 0, 0, 0.5)",
                                      borderRadius: "15px",
                                      position: "relative",
                                      height: "162px",
                                      cursor: "pointer",
                                      textAlign: "center",
                                      width: "100%",
                                    }}
                                    onClick={() => handleClick(2)} // Trigger file input on div click
                                  >
                                    <input
                                      ref={fileInputFrontCardRef} // Attach the ref to the input
                                      style={{ display: "none" }} // Hide the default file input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFileChange(e, 2)}
                                    />
                                    {!frontCardUrl && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          color: "rgba(0, 0, 0, 0.5)",
                                          fontSize: "18px",
                                          width: "100%",
                                        }}
                                      >
                                        Mặt trước căn cước
                                      </div>
                                    )}
                                    {frontCardUrl && (
                                      <img
                                        src={
                                          typeof frontCardUrl === "string" &&
                                          frontCardUrl.includes("iVBOR")
                                            ? `data:image/png;base64,${frontCardUrl}`
                                            : URL.createObjectURL(frontCardUrl)
                                        }
                                        alt="Uploaded"
                                        style={{
                                          height: "156px",
                                          width: "100%",
                                          borderRadius: "15px",
                                        }}
                                      />
                                    )}
                                  </div>
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  name="backCard"
                                  style={{
                                    borderRadius: "15px",
                                  }}
                                  // rules={[
                                  //   {
                                  //     required: true,
                                  //     message:
                                  //       "Mặt sau căn cước không được để trống",
                                  //   },
                                  // ]}
                                  validateTrigger="onChange"
                                >
                                  <div
                                    style={{
                                      border: "4px dashed rgba(0, 0, 0, 0.5)",
                                      borderRadius: "15px",
                                      position: "relative",
                                      height: "162px",
                                      cursor: "pointer",
                                      textAlign: "center",
                                      width: "100%",
                                    }}
                                    onClick={() => handleClick(3)} // Trigger file input on div click
                                  >
                                    <input
                                      ref={fileInputBackCardRef} // Attach the ref to the input
                                      style={{ display: "none" }} // Hide the default file input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFileChange(e, 3)}
                                    />
                                    {!backCardUrl && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                          color: "rgba(0, 0, 0, 0.5)",
                                          fontSize: "18px",
                                          width: "100%",
                                        }}
                                      >
                                        Mặt sau căn cước
                                      </div>
                                    )}
                                    {backCardUrl && (
                                      <img
                                        src={
                                          typeof backCardUrl === "string" &&
                                          backCardUrl.includes("iVBOR")
                                            ? `data:image/png;base64,${backCardUrl}`
                                            : URL.createObjectURL(backCardUrl)
                                        }
                                        alt="Uploaded"
                                        style={{
                                          height: "156px",
                                          width: "100%",
                                          borderRadius: "15px",
                                        }}
                                      />
                                    )}
                                  </div>
                                </Form.Item>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginTop: "30px",
                    }}
                  >
                    <Button
                      style={{
                        width: 130,
                        backgroundColor: "#01AA85",
                        color: "#FFF",
                        marginTop: 10,
                      }}
                      onClick={handleSaveChange}
                      loading={loading || state.loadingApiCallDirect}
                    >
                      Lưu thông tin
                    </Button>
                    <Button
                      style={{
                        width: 100,
                        backgroundColor: "#01AA85",
                        color: "#FFF",
                        marginTop: 10,
                      }}
                      onClick={() => router.push("/")}
                    >
                      Thoát
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        width={800}
        centered
        open={state.IsOpenModalScanPortrait}
        onCancel={() => {
          setState({ ...state, IsOpenModalScanPortrait: false });
          setImgSrc(null);
        }}
        footer=""
        // closable={false}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          width={"100%"}
        />

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            style={{ width: 120, marginLeft: 20 }}
            mergetype="primary"
            key="submit"
            onClick={capture}
            loading={loadingCccd}
          >
            Chụp hình
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default CommonLayout(React.memo(accountDetails));