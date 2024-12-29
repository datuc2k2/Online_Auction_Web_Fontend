import { notification } from 'antd';
import { themeColor } from '../config/theme/ThemeVariables';
import { ReactNode } from 'react';
import { NotificationType } from '../types/Global';
import UilTimes from '@iconscout/react-unicons/dist/icons/uil-times';
import UilInfoCircle from '@iconscout/react-unicons/dist/icons/uil-info-circle';
import UilCheckCircle from '@iconscout/react-unicons/dist/icons/uil-check-circle';

/**
 * Return ellipsis of a given string
 * @param {string} text
 * @param {number} size
 */
export const ellipsis = (text: string, size: number) => {
  return `${text.split(' ').slice(0, size).join(' ')}...`;
};

export const openNotification = (type: NotificationType, title: ReactNode, message: ReactNode) => {
  notification[type]({
    message:
      title === 'Save failed' ? (
        <div style={{ color: themeColor['error-text-toast'], fontSize: 20, fontWeight: 600 }}>{title}</div>
      ) : type === 'error' ? (
        ''
      ) : (
        <div style={{ color: themeColor['white-color'], fontSize: 20 }}>{title}</div>
      ),
    description: (
      <div
        style={{ color: type === 'error' ? themeColor['error-text-toast'] : themeColor['white-color'], fontSize: 18 }}
      >
        {message}
      </div>
    ),
    closeIcon: <UilTimes color={type === 'error' ? themeColor['error-text-toast'] : themeColor['white-color']} />,
    icon:
      type === 'error' ? (
        <UilInfoCircle size={24} color={themeColor['error-text-toast']} />
      ) : (
        <UilCheckCircle size={24} color={themeColor['white-color']} />
      ),
    style: {
      backgroundColor: type === 'error' ? themeColor['error-background'] : themeColor['success-background'],
      borderRadius: 6,
    },
    duration: 3,
  });
};

export const notifyErrorFromApiCommon = (resp: any) => {
  var message = 'error';
  if(resp?.data?.messages?.common?.$values[0]?.information) {
    message = resp.data.messages.common.$values[0].information;
  }
  if(resp?.response?.data?.messages?.common?.$values[0]?.information) {
    message = resp?.response?.data?.messages?.common?.$values[0]?.information;
  }
  return message;
}
