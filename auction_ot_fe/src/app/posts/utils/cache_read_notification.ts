import { NOTIFICATION_KEY } from "./constant";

export class CacheReadNotification {

    static markAsRead(notificationId: string) {
        const currentRead = localStorage.getItem(NOTIFICATION_KEY) || '[]';
        const readArray = JSON.parse(currentRead);
        if (!readArray.includes(notificationId)) {
            readArray.push(notificationId);
            localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(readArray));
        }
    }

    static markAsUnread(notificationId: string) {
        const currentRead = localStorage.getItem(NOTIFICATION_KEY) || '[]';
        const readArray = JSON.parse(currentRead);
        const filteredReadArray = readArray.filter((id: string) => id !== notificationId);
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(filteredReadArray));
    }

    static isRead(notificationId: string) {
        const currentRead = localStorage.getItem(NOTIFICATION_KEY) || '[]';
        const readArray = JSON.parse(currentRead);
        return readArray.includes(notificationId);
    }

    static getAllReadNotifications() {
        const currentRead = localStorage.getItem(NOTIFICATION_KEY) || '[]';
        return JSON.parse(currentRead);
    }

    static clearAllReadNotifications() {
        localStorage.setItem(NOTIFICATION_KEY, '[]');
    }
}
