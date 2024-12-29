import { NotificationType } from "../utils/enum";

class NotificationPost {
    title: string;
    content: string;
    users: string[];
    notificationType: NotificationType;
    constructor(title: string, body: string, users: string[], notificationType: NotificationType) {
        this.title = title;
        this.content = body;
        this.users = users;
        this.notificationType = notificationType;
    }
}

export { NotificationPost };

