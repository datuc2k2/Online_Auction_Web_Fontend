import axios from "axios";
import { NotificationPost } from '../models/notification';
import { BASE_URL } from "../utils/constant";
import { convertTime } from "../utils/convert_time";
import { openNotification } from "@/utility/Utility";

export class NotificationServices {
	static async createNotification(notification: NotificationPost) {
		const payload = {
			userIds: notification.users,
			title: notification.title,
			content: notification.content,
			type: notification.notificationType,
		};
		console.log("payload", payload);
		await axios.post(`${BASE_URL}api/Notifications`, payload);
		return payload;
	}

	static async getNotificationsByUserId(userId: string) {
		const response = await axios.get(
			`${BASE_URL}api/Notifications/Users?userId=${userId}`
		);
		let data: { id: string; title: string; content: string; time: string }[] =
			[];
		console.log("response ccccc", response);
		for (const item of response.data.$values) {
			const itemNoti = {
				id: item.notificationId,
				title: item.title,
				content: item.content,
				time: convertTime(item.createdAt),
				isRead: item.isRead,
			};
			data = [...data, itemNoti];
		}
		return data;
	}

	static async acceptAuctionInvitation(params) {
		try {
			const result = await axios.post(
				`${BASE_URL}api/JoinTheAuction/acceptOrRejectAuctionInvitation?InvitationId=${params.InvitationId}&AcceptOrReject=${params.AcceptOrReject}`,
				{}
			);
			if (result.status === 200 || result.status === 201) {
				openNotification(
					"success",
					"Thành công",
					params.AcceptOrReject === true
						? "Chấp thuận thành công"
						: "Từ chối thành công"
				);
			} else {
				openNotification("error", "", "Đã xảy ra lỗi");
			}
		} catch (error) {
			openNotification("error", "", "Đã xảy ra lỗi");
			console.error("Error accepting auction invitation:", error);
		}
		return params;
	}

	static async getAuctionInvitationByUserId(userId: string) {
		const response = await axios.get(
			`${BASE_URL}api/JoinTheAuction/getAllAuctionInvitationByUserId/${userId}`
		);
		let data: {
			invitationId: number;
			auctionId: number;
			invitedUserId: number;
			isAccepted: boolean | null;
			invitedAt: string | null;
			acceptedAt: string | null;
			inviterId: number;
			inviterAvatar: string;
			inviterName: string;
		}[] = [];
		for (const item of response.data.$values) {
			const itemNoti = {
				invitationId: item.invitationId,
				auctionId: item.auctionId,
				invitedUserId: item.invitedUserId,
				isAccepted: item.isAccepted,
				invitedAt: item.invitedAt,
				acceptedAt: item.acceptedAt,
				inviterId: item.inviterId,
				inviterAvatar: item.inviterAvatar,
				inviterName: item.inviterName,
			};
			data = [...data, itemNoti];
		}
		return data;
	}

	static async addChat(CreatorId: string, ReceiverId: string) {
		try {
			const result = await axios.post(
				`${BASE_URL}api/Chat/addChat?CreatorId=${CreatorId}&ReceiverId=${ReceiverId}`,
				{}
			);
		} catch (error) {
			openNotification("error", "", "Đã xảy ra lỗi");
			console.error("Error accepting auction invitation:", error);
		}
	}

	static async setIsReadForUser(UserId: string, ChatId: string, UserToNotiId: string) {
		try {
			const result = await axios.post(
				`${BASE_URL}api/Chat/setIsReadForUser?UserId=${UserId}&ChatId=${ChatId}&UserToNotiId=${UserToNotiId}`,
				{}
			);
		} catch (error) {
			openNotification("error", "", "Đã xảy ra lỗi");
		}
	}

	static async addChatMessage(ChatId, SenderId, ContentText, ContentImage) {
		try {
			const formData = new FormData();
			formData.append("ChatId", ChatId);
			formData.append("SenderId", SenderId);
			formData.append("ContentText", ContentText);
			formData.append("ContentImage", ContentImage);
			const result = await axios.post(
				`${BASE_URL}api/Chat/addChatMessage`,
				formData, 
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			return result.data;
		} catch (error) {
			openNotification("error", "", "Đã xảy ra lỗi");
			console.error("Error accepting auction invitation:", error);
		}
	}
	

	static async getAllChatAndMessage(userId: string) {
		const response = await axios.get(
			`${BASE_URL}api/Chat/getAllUserChatWithByUserId/${userId}`
		);
		let data: {
			userIdWith: number;
			userNameWith: string;
			userAvatarWidth: string;
			chatId: number;
			isAdmin: boolean;
			chatMessages: {
				messageID: number;
				chatID: number;
				senderID: number;
				senderName: string;
				senderAvatar: string;
				content: string;
				sendAt: string;
				isDeleted: boolean;
				isRead: boolean;
			}[];
		}[] = [];

		for (const item of response.data.$values) {
			const itemChat = {
				userIdWith: item.userIdWith,
				userNameWith: item.userNameWith,
				userAvatarWidth: item.userAvatarWidth,
				chatId: item.chatId,
				isAdmin: item.isAdmin,
				chatMessages: item.chatMessages.$values?.map(i => {
					return {
						messageID: i.messageID,
						chatID: i.chatID,
						senderID: i.senderID,
						senderName: i.senderName,
						senderAvatar: i.senderAvatar,
						content: i.content,
						sendAt: i.sendAt,
						isDeleted: i.isDeleted,
						isRead: i.isRead,
					}
				})
			};
			data = [...data, itemChat];
		}
		const dataReturn = {
			ChatAdmin: data?.filter(c => c.isAdmin) || [],
			ChatUser: data?.filter(c => !c.isAdmin) || []
		};
		return dataReturn;
	}

	static async getUserExceptMe(userId: string) {
		const response = await axios.get(
			`${BASE_URL}api/Chat/getUserExceptMe/${userId}`
		);
		let data: {
			userId: number;
			userName: string;
			userEmail: string;
			userAvatar: string;
		}[] = [];

		for (const item of response.data.$values) {
			const itemUser = {
				userId: item.userId,
				userName: item.userName,
				userEmail: item.userEmail,
				userAvatar: item.userAvatar,
			};
			data = [...data, itemUser];
		}
		return data;
	}

	static async getAdminExceptMe(userId: string) {
		const response = await axios.get(
			`${BASE_URL}api/Chat/getAdminExceptMe/${userId}`
		);
		let data: {
			userId: number;
			userName: string;
			userEmail: string;
			userAvatar: string;
		}[] = [];

		for (const item of response.data.$values) {
			const itemUser = {
				userId: item.userId,
				userName: item.userName,
				userEmail: item.userEmail,
				userAvatar: item.userAvatar,
			};
			data = [...data, itemUser];
		}
		return data;
	}

	static async setNotificationAsRead(notificationId: string) {
		await axios.put(`${BASE_URL}api/Notifications/${notificationId}/setRead`);
	}
}