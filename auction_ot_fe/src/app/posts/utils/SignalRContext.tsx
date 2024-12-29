import * as signalR from "@microsoft/signalr";
import React, { createContext, useContext, useEffect, useState } from "react";
import { COMMENT_HUB_URL, NOTIFICATION_HUB_URL } from "./constant";

interface SignalRContextType {
	commentConnection: signalR.HubConnection | null;
	notificationConnection: signalR.HubConnection | null;
	liveMessage: string | null;
	notificationMessage: string | null;
}

const SignalRContext = createContext<SignalRContextType | null>(null);

export const SignalRProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [commentConnection, setCommentConnection] = useState<signalR.HubConnection | null>(null);
	const [notificationConnection, setNotificationConnection] = useState<signalR.HubConnection | null>(null);

	const [liveMessage, setLiveMessage] = useState<string | null>(null);
	const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

	function createCommentHubConnection() {
		const con = new signalR.HubConnectionBuilder()
			.withUrl(COMMENT_HUB_URL, {
				skipNegotiation: true,
				transport: signalR.HttpTransportType.WebSockets,
			})
			.withAutomaticReconnect()
			.build();
		setCommentConnection(con);
	}

	function createNotificationHubConnection() {
		const con = new signalR.HubConnectionBuilder()
			.withUrl(NOTIFICATION_HUB_URL, {
				skipNegotiation: true,
				transport: signalR.HttpTransportType.WebSockets,
			})
			.withAutomaticReconnect()
			.build();
		setNotificationConnection(con);
	}

	useEffect(() => {
		createCommentHubConnection();
		createNotificationHubConnection();
	}, []);

	useEffect(() => {
		if (commentConnection) {
			try {
				commentConnection
					.start()
					.then(() => {
						console.log("Comment connection started");
					})
					.then(() => {
						commentConnection.on("SystemAppReceiveMessage", (message?: string) => {
							console.log("message in signalr", message);
							setLiveMessage(JSON.stringify(message) || null);
						});
					})
					.catch((err) =>
						console.log("Error while starting comment connection: ", err)
					);
			} catch (err) {
				console.log("Error while starting comment connection: ", err);
			}
		}

		return () => {
			if (commentConnection) {
				commentConnection.stop();
			}
		};
	}, [commentConnection]);

	useEffect(() => {
		if (notificationConnection) {
			try {
				notificationConnection
					.start()
					.then(() => {
						console.log("Notification connection started");
					})
					.then(() => {
						notificationConnection.on("SystemAppReceiveNotice", (message?: string) => {
							setNotificationMessage(JSON.stringify(message) || null);
						});
					})
					.catch((err) =>
						console.log("Error while starting notification connection: ", err)
					);
			} catch (err) {
				console.log("Error while starting notification connection: ", err);
			}
		}

		return () => {
			if (notificationConnection) {
				notificationConnection.stop();
			}
		};
	}, [notificationConnection]);

	return (
		<SignalRContext.Provider
			value={{ commentConnection, notificationConnection, liveMessage, notificationMessage }}>
			{children}
		</SignalRContext.Provider>
);
};

export const useSignalR = (): SignalRContextType => {
	const context = useContext(SignalRContext);
	if (!context) {
		throw new Error("useSignalR must be used within SignalRProvider");
	}
	return context;
};
