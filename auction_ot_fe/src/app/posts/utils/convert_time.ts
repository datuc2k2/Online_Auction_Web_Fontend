export const convertTime = (time: string): string => {
    const date = new Date(time);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} ${years === 1 ? 'năm' : 'năm'} trước`;
    } else if (months > 0) {
        return `${months} ${months === 1 ? 'tháng' : 'tháng'} trước`;
    } else if (days > 0) {
        return `${days} ${days === 1 ? 'ngày' : 'ngày'} trước`;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? 'giờ' : 'giờ'} trước`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? 'phút' : 'phút'} trước`;
    } else if (seconds > 0) {
        return `${seconds} ${seconds === 1 ? 'giây' : 'giây'} trước`;
    } else {
        return 'Vừa xong';
    }
}