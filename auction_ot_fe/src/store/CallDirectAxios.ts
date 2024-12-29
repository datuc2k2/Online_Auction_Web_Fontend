import { notifyErrorFromApiCommon, openNotification } from "@/utility/Utility";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const AxiosInstanceMultipartData = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_DEV,
    timeout: 10000,
    headers: {
    },
});

AxiosInstanceMultipartData.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // const {
        //   auth: { access_token },
        // } = store.getState();
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';')?.shift(); // Using optional chaining
            return undefined; // Explicitly return undefined if the cookie is not found
        };
        // Get the access token from cookies
        const access_token = getCookie('accessTokenAuction');

        if (access_token) config.headers['Authorization'] = `Bearer ${access_token}`;

        return config;
    },
    (err: Error | AxiosError) => Promise.reject(err),
);

// Response interceptor to handle 401 Unauthorized
AxiosInstanceMultipartData.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            document.cookie = "accessTokenAuction=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "myInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            sessionStorage.setItem('reduxState', '{}');
            localStorage.removeItem('accessTokenAuction');
            localStorage.removeItem("myInfo");
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

const callRequestAnAuctionApi = async (formData: FormData, setLoading: any, callBackWhenSuccess: any) => {
    setLoading(true);
    try {
        const response = await AxiosInstanceMultipartData.post('/api/Auction/requestCreateAuction', formData);
        if (response.data.resultCd === 1) {
            openNotification('success', 'Thành công', 'Tạo yêu cầu phiên đấu giá thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', notifyErrorFromApiCommon(response));
        }
    } catch (error) {
        openNotification('error', '', notifyErrorFromApiCommon(error));
    } finally {
        setLoading(false);
    }
}

const callRequestToUpdateAnAuctionApi = async (formData: FormData, setLoading: any, callBackWhenSuccess: any) => {
    setLoading(true);
    try {
        const response = await AxiosInstanceMultipartData.post('/api/Auction/requestUpdateAuction', formData);
        if (response.data.resultCd === 1) {
            openNotification('success', 'Thành công', 'Cập nhật yêu cầu phiên đấu giá thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', notifyErrorFromApiCommon(response));
        }
    } catch (error) {
        openNotification('error', '', notifyErrorFromApiCommon(error));
    } finally {
        setLoading(false);
    }
}

const callCreateAnAuctionApi = async (formData: FormData, setLoading: any, callBackWhenSuccess: any) => {
    setLoading(true);
    try {
        const response = await AxiosInstanceMultipartData.post('/api/Auction/createAuction', formData);
        if (response.data.resultCd === 1) {
            openNotification('success', 'Thành công', 'Tạo yêu cầu phiên đấu giá thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', notifyErrorFromApiCommon(response));
        }
    } catch (error) {
        openNotification('error', '', notifyErrorFromApiCommon(error));
    } finally {
        setLoading(false);
    }
}

const callConfirmPaymentApi = async (formData: FormData, setLoading: any, callBackWhenSuccess: any) => {
    setLoading(true);
    try {
        const response = await AxiosInstanceMultipartData.post('/api/PaymentConfirmation/confirmPayment', formData);
        if (response.data.resultCd === 1) {
            openNotification('success', 'Thành công', 'Xác nhận thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', notifyErrorFromApiCommon(response));
        }
    } catch (error) {
        openNotification('error', '', notifyErrorFromApiCommon(error));
    } finally {
        setLoading(false);
    }
}

const callAdminConfirmPaymentApi = async (formData: FormData, setLoading: any, callBackWhenSuccess: any) => {
    setLoading(true);
    try {
        const response = await AxiosInstanceMultipartData.post('/api/PaymentConfirmation/AdminConfirmed', formData);
        if (response.data.resultCd === 1) {
            openNotification('success', 'Thành công', 'Giải quyết thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', notifyErrorFromApiCommon(response));
        }
    } catch (error) {
        openNotification('error', '', notifyErrorFromApiCommon(error));
    } finally {
        setLoading(false);
    }
}

const callUpdateProfileApi = async (formData: FormData, callBackWhenSuccess: any, callBackWhenFinally: any) => {
    try {
        const response = await AxiosInstanceMultipartData.post('api/PersonalAccount/EditProfile', formData);
        if (response.data.resultCd === 1) {
            openNotification('success', 'Thành công', 'Chỉnh sửa thông tin thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', notifyErrorFromApiCommon(response));
        }
    } catch (error) {
        openNotification('error', '', notifyErrorFromApiCommon(error));
    } finally {
        callBackWhenFinally();
    }
}

const callEKycApi = async (formData: FormData, setLoading: any, callBackWhenSuccess: any, callBackWhenFinally: any) => {
    try {
        setLoading(true);
        const response = await AxiosInstanceMultipartData.post('api/PersonalAccount/eKyc', formData);
        if (response) {
            openNotification('success', 'Thành công', 'Nhận tick xanh thành công');
            callBackWhenSuccess();
        } else {
            openNotification('error', '', 'Ảnh chưa đúng yêu cầu');
        }
    } catch (error) {
        openNotification('error', '', 'Ảnh chưa đúng yêu cầu');
    } finally {
        callBackWhenFinally();
        setLoading(false);
    }
}

const callUpdateAccountManagerApi = async (
  formData: FormData,
  callBackWhenSuccess: any
) => {
  try {
    const response = await AxiosInstanceMultipartData.post(
      "api/AccountDetails/Edit",
      formData
    );
    if (response.data.resultCd === 1) {
      openNotification(
        "success",
        "Thành công",
        "Chỉnh sửa thông tin thành công"
      );
      callBackWhenSuccess();
    } else {
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    openNotification("error", "", notifyErrorFromApiCommon(error));
  } finally {
  }
};

export {
  callRequestAnAuctionApi,
  callCreateAnAuctionApi,
  callUpdateProfileApi,
  callUpdateAccountManagerApi,
  callRequestToUpdateAnAuctionApi,
  callConfirmPaymentApi,
  callAdminConfirmPaymentApi,
  callEKycApi
};