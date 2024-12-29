import { put, takeEvery } from 'redux-saga/effects';
import { CHANGE_MY_PASSWORD, CHANGE_PASSWORD, ChangeMyPasswordAction, ChangePasswordAction, CONFIRM_RESET_PASSWORD, ConfirmResetPasswordAction, CREATE_NEW_PASSWORD, CreateNewPasswordAction, FETCH_MY_INFO, FetchMyInfoAction, LOGIN, LoginAction, LoginResponse, MyInfo, REGISTER, RegisterAction, RESET_PASSWORD, ResetPasswordAction, UPDATE_ACCOUNT_INFORMATION, UPDATE_PROFILE, UpdateAccountInformationAction, UpdateAccountInformationModel, UpdateProfileAction, VERIFY, VerifyAction } from './Types';
import { ApiResponse, apiCall, apiGetCall, apiPostCall, apiPostCallAuthen } from '../saga-effects/api';
import { API_CHANGE_MY_PASSWORD, API_CHANGE_PASSWORD, API_ENDPOINT_CONFIRM_RESET_PASSWORD, API_ENDPOINT_CREATE_NEW_PASSWORD, API_ENDPOINT_FETCH_MYINFO, API_ENDPOINT_LOGIN, API_ENDPOINT_REGISTER, API_ENDPOINT_RESET_PASSWORD, API_ENDPOINT_UPDATE_PROFILE, API_ENDPOINT_VERIFY, API_UPDATE_ACCOUNT_INFORMATION, prepare } from '../../services/Endpoints';
import { changeMyPassworddErr, confirmResetPasswordErr, confirmResetPasswordSuccess, createNewPassworddErr, createNewPasswordSuccess, fetchMyInfo, fetchMyInfoError, fetchMyInfoSuccess, loginErr, loginSuccess, registerErr, registerSuccess, resetPasswordErr, resetPasswordSuccess, updateProfileErr, updateProfileSuccess } from './Actions';
import { notifyErrorFromApiCommon, openNotification } from '../../utility/Utility';

function* login(action: LoginAction) {
  try {
    console.log('vafoaofoasfosao');
    
    const response: ApiResponse<any> = yield apiCall(apiPostCallAuthen, API_ENDPOINT_LOGIN, {
      email: action.payload.Email,
      password: action.payload.Password,
    });
    console.log('response.data___: ', response.data);

    if (response.data.resultCd === 1) {
      localStorage.setItem("access_token", response.data.accessToken);
      localStorage.setItem("Email", action.payload.Email);
      localStorage.setItem("Password", action.payload.Password);
      localStorage.setItem('checkRemember', action.payload.isRemember + '')
      action.callback();
      yield put(loginSuccess(response.data));
      yield put(fetchMyInfo());
      openNotification('success', 'Thành công', 'Đăng nhập thành công');
    } else {
      yield put(loginErr(notifyErrorFromApiCommon(response)));
      openNotification('error', '', notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification('error', '', notifyErrorFromApiCommon(error));
    yield put(loginErr(notifyErrorFromApiCommon(error)));
  }
}

function* registerSaga(action: RegisterAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(apiPostCallAuthen, API_ENDPOINT_REGISTER, {
      email: action.payload.email,
      userName: action.payload.userName,
      password: action.payload.password,
    });
    if (response.data.resultCd === 1) {
      yield put(registerSuccess());
      action.payload.callback()
    } else {
      yield put(registerErr(notifyErrorFromApiCommon(response)));
      openNotification('error', '', notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification('error', '', notifyErrorFromApiCommon(error));
    yield put(loginErr(notifyErrorFromApiCommon(error)));
  }
}

function* verifySaga(action: VerifyAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(apiPostCallAuthen, API_ENDPOINT_VERIFY, {
      email: action.payload.email,
      code: action.payload.code
    });
    if (response.data.resultCd === 1) {
      action.payload.callback()
    } else {
      yield put(registerErr(notifyErrorFromApiCommon(response)));
      openNotification('error', '', notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification('error', '', notifyErrorFromApiCommon(error));
    yield put(loginErr(notifyErrorFromApiCommon(error)));
  }
}

function* fetchMyInfoSaga(action: FetchMyInfoAction) {
  try {
    console.log('vaof sagaaaa');
    const response: ApiResponse<any> = yield apiCall(apiGetCall, prepare(API_ENDPOINT_FETCH_MYINFO, {}, {}));
    if (response.data.resultCd === 1) {
      yield put(fetchMyInfoSuccess(response.data.user));
    } else {
      yield put(fetchMyInfoError());
    }
  } catch (error) {
    console.log(error);
    yield put(fetchMyInfoError());
  }
}


function* updateProfileSaga(action: UpdateProfileAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_UPDATE_PROFILE,
      {
        ...action.payload,
      }
    );
    if (response.data.resultCd === 1) {
      yield put(updateProfileSuccess());
      yield put(fetchMyInfo());
      openNotification(
        "success",
        "Thành công",
        "Trang cá nhân đã được cập nhật"
      );
    } else {
      yield put(updateProfileErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(updateProfileErr(notifyErrorFromApiCommon(error)));
  }
}

function* resetPasswordSaga(action: ResetPasswordAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_RESET_PASSWORD,
      {
        email: action.payload.email,
      }
    );
    if (response.data.resultCd === 1) {
      yield put(resetPasswordSuccess());
      openNotification("success", "Thành công", "Hãy kiểm tra email của bạn");
      localStorage.setItem("currentEmailResetPass", action.payload.email);
      if (action.payload.callback) action.payload.callback();
    } else {
      yield put(resetPasswordErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(resetPasswordErr(notifyErrorFromApiCommon(error)));
  }
}

function* confirmResetPasswordSaga(action: ConfirmResetPasswordAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_CONFIRM_RESET_PASSWORD,
      {
        email: action.payload.email,
        code: action.payload.code,
      }
    );
    if (response.data.resultCd === 1) {
      yield put(confirmResetPasswordSuccess());
      openNotification(
        "success",
        "Thành công",
        "Confirm reset password success"
      );
      if (action.payload.callback) action.payload.callback();
    } else {
      yield put(confirmResetPasswordErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(confirmResetPasswordErr(notifyErrorFromApiCommon(error)));
  }
}

function* createNewPasswordSaga(action: CreateNewPasswordAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_ENDPOINT_CREATE_NEW_PASSWORD,
      {
        email: action.payload.email,
        password: action.payload.password,
      }
    );
    if (response.data.resultCd === 1) {
      yield put(createNewPasswordSuccess());
      openNotification("success", "Thành công", "Mật khẩu đã được thay đổi");
      if (action.payload.callback) action.payload.callback();
    } else {
      yield put(createNewPassworddErr(notifyErrorFromApiCommon(response)));
      openNotification("error", "", notifyErrorFromApiCommon(response));
    }
  } catch (error) {
    console.log(error);
    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(createNewPassworddErr(notifyErrorFromApiCommon(error)));
  }
}

function* changeMyPasswordSaga(action: ChangeMyPasswordAction) {
  try {
    const response: ApiResponse<any> = yield apiCall(
      apiPostCall,
      API_CHANGE_MY_PASSWORD,
      {
        oldPassword: action.payload.oldPassword,
        newPassword: action.payload.newPassword,
      }
    );
    if (response.data.resultCd === 1) {
      openNotification("success", "Thành công", "Mật khẩu đã được thay đổi");
      if (action.payload.callback) action.payload.callback();
    } else {
      openNotification("error", "", notifyErrorFromApiCommon(response));
      yield put(changeMyPassworddErr(notifyErrorFromApiCommon(response)));
    }
  } catch (error: any) {
    console.log(error);

    openNotification("error", "", notifyErrorFromApiCommon(error));
    yield put(changeMyPassworddErr(notifyErrorFromApiCommon(error)));
  }
}

// function* updateAccountInformation(action: UpdateAccountInformationAction) {
//   try {
//     const response: ApiResponse<any> = yield apiCall(apiPostCall, API_UPDATE_ACCOUNT_INFORMATION, {
//       Email: action.payload.Email,
//       Name: action.payload.Name,
//       Birthday: action.payload.Birthday,
//       PhoneNumber: action.payload.PhoneNumber,
//       Gender: action.payload.Gender,
//       Address: action.payload.Address,
//     });
//     if (response.data.Success) {
//       const loginResString = localStorage.getItem('LoginResponse');
//       if (loginResString) {
//         const loginResponse: LoginResponse = JSON.parse(loginResString);     
//         loginResponse.User.Email = action.payload.Email;
//         loginResponse.User.Name = action.payload.Name;
//         loginResponse.User.Birthday = action.payload.Birthday;
//         loginResponse.User.PhoneNumber = action.payload.PhoneNumber;
//         loginResponse.User.Gender = action.payload.Gender;
//         loginResponse.User.Address = action.payload.Address;
//         localStorage.setItem("LoginResponse", JSON.stringify(loginResponse));
//         yield put(loginSuccess(loginResponse));
//       }
//       openNotification('success', 'Success', 'Saved successfully');
//     } else {
//       openNotification('error', '', response.data.Message);
//     }
//   } catch (error) {
//     openNotification('error', '', 'Saved Error');
//   }
// }

export function* watchAuthActions() {
  yield takeEvery(LOGIN, login);
  // yield takeEvery(CHANGE_PASSWORD, changePassword);
  // yield takeEvery(UPDATE_ACCOUNT_INFORMATION, updateAccountInformation);
  yield takeEvery(REGISTER, registerSaga);
  yield takeEvery(VERIFY, verifySaga);
  yield takeEvery(FETCH_MY_INFO, fetchMyInfoSaga);
  yield takeEvery(UPDATE_PROFILE, updateProfileSaga);
  yield takeEvery(RESET_PASSWORD, resetPasswordSaga);
  yield takeEvery(CONFIRM_RESET_PASSWORD, confirmResetPasswordSaga);
  yield takeEvery(CREATE_NEW_PASSWORD, createNewPasswordSaga);
  yield takeEvery(CHANGE_MY_PASSWORD, changeMyPasswordSaga);
}