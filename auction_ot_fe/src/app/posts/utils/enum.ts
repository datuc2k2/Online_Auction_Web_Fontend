export enum PostStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2
}

export enum NotificationType {
    SYSTEM = 15,
    SESSION = 16,
    POST = 17,
}

export function getPostStatusText(status: PostStatus): string {
    switch (status) {
        case PostStatus.PENDING:
            return 'Đang chờ';
        case PostStatus.APPROVED:
            return 'Đã duyệt';
        case PostStatus.REJECTED:
            return 'Từ chối';
        default:
            return 'Không xác định';
    }
}
