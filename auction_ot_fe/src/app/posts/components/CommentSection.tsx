import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Input, InputRef, message, Button, Spin } from 'antd';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { PostComment } from '../models/comment';
import { CommentService } from "../services/comment_services";
import { useSignalR } from "../utils/SignalRContext";
import { DEFAULT_AVATAR } from '../utils/constant';
import { convertTime } from '../utils/convert_time';
import { PostService } from '../services/post_services';
import { CachingCommentLike } from '../utils/caching_post_like';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/RootReducer';

interface CommentSectionProps {
	postId: string;
	onCommentCountChange?: (change: number) => void;
}

const ReplyInput: React.FC<{
	commentId: string;
	authorName: string;
	onSubmit: (commentId: string, content: string) => void;
	inputKey: number;
	currentUserAvatar: string;
}> = React.memo(
	({ commentId, authorName, onSubmit, inputKey, currentUserAvatar }) => {
		const [inputValue, setInputValue] = useState("");

		const handleSubmit = () => {
			if (inputValue.trim()) {
				onSubmit(commentId, inputValue);
				setInputValue("");
			}
		};

		return (
			<div
				style={{
					marginTop: "8px",
					display: "flex",
					alignItems: "center",
					marginLeft: "20px",
				}}>
				<Avatar
					src={currentUserAvatar+''}
					alt='người dùng hiện tại'
					size={32}
					style={{ marginRight: "8px" }}
				/>
				<div style={{ flex: 1, display: "flex" }}>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onPressEnter={handleSubmit}
						placeholder={`Trả lời ${authorName}...`}
						style={{ flex: 1, marginRight: "8px" }}
					/>
					<Button
						onClick={handleSubmit}
						type="text"
						style={{
							color: "#0095f6",
							fontWeight: "bold",
						}}>
						Trả lời
					</Button>
				</div>
			</div>
		);
	}
);

const MainCommentInput: React.FC<{
	onSubmit: (content: string) => void;
	inputKey: number;
	currentUserAvatar: string;
	isLoading?: boolean;
}> = React.memo(({ onSubmit, inputKey, currentUserAvatar, isLoading }) => {
	const [inputValue, setInputValue] = useState("");
	const myInfo = useSelector((states: RootState) => states.auth.myInfo) ;

	const handleSubmit = () => {
		if (inputValue.trim()) {
			onSubmit(inputValue);
			setInputValue("");
		}
	};

	return (
		<div
			style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
			<Avatar
				src={myInfo?.userProfile?.avatar+''+process.env.NEXT_PUBLIC_IMAGE_POSTFIX}
				alt='người dùng hiện tại'
				size={32}
				style={{ marginRight: "8px" }}
			/>
			<div style={{ flex: 1, display: "flex" }}>
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onPressEnter={handleSubmit}
					placeholder='Thêm bình luận...'
					style={{ flex: 1, marginRight: "8px" }}
					disabled={isLoading}
				/>
				<Button
					onClick={handleSubmit}
					type="text"
					style={{
						color: "#0095f6",
						fontWeight: "bold",
					}}
					disabled={isLoading}
				>
					Đăng
				</Button>
			</div>
		</div>
	);
});

// const scrollbarStyles = `
   
// `;

// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = scrollbarStyles;
// document.head.appendChild(styleSheet);

const CommentSection: React.FC<CommentSectionProps> = ({
	postId,
	onCommentCountChange,
}) => {
	const myInfo = useSelector((states: RootState) => states.auth.myInfo);
	const currentUserAvatar =
		myInfo?.userProfile?.avatar + "" + process.env.NEXT_PUBLIC_IMAGE_POSTFIX;

	const [commentState, setCommentState] = useState({
		comments: [] as PostComment[],
		replyingTo: null as string | null,
		showDropdown: null as string | null,
		editingCommentId: null as string | null,
		editContent: "",
		isLoading: true,
	});

	const editInputRef = useRef<InputRef>(null);

	const [commentInputKey, setCommentInputKey] = useState(0);
	const [replyInputKeys, setReplyInputKeys] = useState<Record<string, number>>(
		{}
	);

	const { commentConnection, liveMessage } = useSignalR();

	const [containerHeight, setContainerHeight] = useState(300);
	const [showMoreButton, setShowMoreButton] = useState(true);
	const [expandCount, setExpandCount] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		if (liveMessage) {
			console.log("liveMessage: ", liveMessage);
			if (JSON.parse(liveMessage).parent_id) {
				setCommentState((prev) => ({
					...prev,
					comments: addReplyToComment(
						prev.comments,
						JSON.parse(liveMessage).parent_id,
						JSON.parse(liveMessage) as PostComment
					),
				}));
			} else {
				setCommentState((prev) => ({
					...prev,
					comments: [JSON.parse(liveMessage!), ...prev.comments],
				}));
			}
		}
		if (commentConnection) {
			commentConnection.on("ReceiveComment", (comment: PostComment) => {
				setCommentState((prev) => ({
					...prev,
					comments: [comment, ...prev.comments],
				}));
			});

			return () => {
				commentConnection.off("ReceiveComment");
			};
		}
	}, [commentConnection, liveMessage]);

	useEffect(() => {
		CommentService.getCommentsByPostId(postId)
			.then((comments) => {
				const commentsWithLike = comments.map((comment) => ({
					...comment,
					isLiked: CachingCommentLike.isCommentLiked(comment.comment_id),
					sub_comments: comment.sub_comments.map((subComment) => ({
						...subComment,
						isLiked: CachingCommentLike.isCommentLiked(subComment.comment_id),
					})),
				}));
				setCommentState((prev) => ({
					...prev,
					comments: commentsWithLike,
					isLoading: false,
				}));
			})
			.catch((error) => {
				console.error("Lỗi khi tải bình luận:", error);
				setCommentState((prev) => ({ ...prev, isLoading: false }));
				message.error("Không thể tải bình luận. Vui lòng thử lại.");
			});

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				commentState.showDropdown &&
				!target.closest(".comment-dropdown") &&
				!target.closest(".dropdown-trigger")
			) {
				setCommentState((prev) => ({ ...prev, showDropdown: null }));
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [postId]);

	useEffect(() => {
		if (commentState.editingCommentId && editInputRef.current) {
			editInputRef.current.focus();
		}
	}, [commentState.editingCommentId]);

	const handleCommentSubmit = useCallback(
		async (content: string) => {
			//TODO call myInfor and update in user_id, name and avatar
			const owner = {
				user_id: myInfo?.userId + "",
				name: myInfo?.username + "",
				avatar: myInfo?.userProfile?.avatar + "",
			};
			try {
				const newCommentObj = new PostComment(
					crypto.randomUUID(),
					postId,
					owner,
					content,
					"",
					new Date().toISOString(),
					[],
					0,
					false
				);
				const response = await CommentService.createComment(newCommentObj);

				const newCommentResponse = PostComment.fromJsonGet(
					response.data,
					owner
				);

				commentConnection?.invoke("SystemAppSendMessage", newCommentResponse);
			} catch (error) {
				console.error("Lỗi khi tạo bình lưn:", error);
				message.error("Không thể tạo bình luận. Vui lòng thử lại.");
			}
		},
		[
			postId,
			currentUserAvatar,
			commentConnection,
			onCommentCountChange,
			commentState,
		]
	);

	const addReplyToComment = (
		comments: PostComment[],
		parentId: string,
		newReply: PostComment
	): PostComment[] => {
		return comments.map((comment) => {
			if (comment.comment_id === parentId) {
				return {
					...comment,
					sub_comments: [newReply, ...comment.sub_comments],
				};
			} else if (comment.sub_comments.length > 0) {
				return {
					...comment,
					sub_comments: addReplyToComment(
						comment.sub_comments,
						parentId,
						newReply
					),
				};
			}
			return comment;
		});
	};

	const handleReplySubmit = useCallback(
		async (parentId: string, content: string) => {
			//TODO call myInfor and update in user_id, name and avatar
			const owner = {
				user_id: myInfo?.userId + "",
				name: myInfo?.username + "",
				avatar:
					myInfo?.userProfile?.avatar +
					"" +
					process.env.NEXT_PUBLIC_IMAGE_POSTFIX,
			};
			console.log("data shiet parentId", parentId);
			try {
				const newReply = new PostComment(
					crypto.randomUUID(),
					postId,
					owner,
					content,
					parentId,
					new Date().toISOString(),
					[],
					0,
					false
				);

				const response = await CommentService.createComment(newReply);
				const newReplyResponse = PostComment.fromJsonGet(response.data, owner);

				console.log("data shiet newReplyResponse", newReplyResponse);
				commentConnection?.invoke("SystemAppSendMessage", newReplyResponse);
				setReplyInputKeys((prev) => ({
					...prev,
					[parentId]: (prev[parentId] || 0) + 1,
				}));
			} catch (error) {
				console.error("Lỗi khi tạo trả lời:", error);
				message.error("Không thể tạo trả lời. Vui lòng thử lại.");
			}
		},
		[postId, currentUserAvatar]
	);

	const handleLikeClick = useCallback(async (commentId: string) => {
		await PostService.likePost("", commentId, "1");

		handleCacheLike(commentId);

		setCommentState((prev) => ({
			...prev,
			comments: updateLikes(prev.comments, commentId),
		}));
	}, []);

	const handleCacheLike = (commentId: string) => {
		const isLiked = CachingCommentLike.isCommentLiked(commentId);
		if (isLiked) {
			CachingCommentLike.removeCommentLike(commentId);
		} else {
			CachingCommentLike.addCommentLike(commentId);
		}
	};

	const handleEditComment = useCallback(
		(commentId: string) => {
			const findComment = (comments: PostComment[]): PostComment | null => {
				for (const comment of comments) {
					if (comment.comment_id === commentId) {
						return comment;
					}
					const found = findComment(comment.sub_comments);
					if (found) return found;
				}
				return null;
			};

			const commentToEdit = findComment(commentState.comments);
			if (commentToEdit) {
				setCommentState((prev) => ({
					...prev,
					editContent: commentToEdit.content,
					editingCommentId: commentId,
					showDropdown: null,
				}));
			}
		},
		[commentState.comments]
	);

	const handleSaveEdit = useCallback(async (commentId: string) => {
		try {
			await CommentService.updateComment(commentId, commentState.editContent);
			setCommentState((prev) => ({
				...prev,
				comments: updateComment(prev.comments, commentId, prev.editContent),
				editingCommentId: null,
				editContent: "",
			}));
		} catch (error) {
			console.error("Lỗi khi cập nhật bình luận:", error);
			message.error("Không thể cập nhật bình luận. Vui lòng thử lại.");
		}
	}, [commentState.editContent]);

	const handleDeleteComment = useCallback(
		async (commentId: string) => {
			try {
				// Find the comment and collect all sub-comment IDs
				const findComment = (comments: PostComment[]): PostComment | null => {
					if (!comments || !Array.isArray(comments)) {
						return null;
					}
					
					for (let i = 0; i < comments.length; i++) {
						const comment = comments[i];
						if (comment.comment_id === commentId) {
							return comment;
						}
						const found = findComment(comment.sub_comments);
						if (found) return found;
					}
				return null;
				};
				console.log("commentState.comments: ", commentState.comments);
				if(commentState.comments.length <=0){
					return;
				}
				const commentToDelete = findComment(commentState.comments);
				if (commentToDelete) {
					// Collect all comment IDs to delete
					const commentIdsToDelete: string[] = [commentId];
					const collectSubCommentIds = (subComments: PostComment[]) => {
						for (const subComment of subComments) {
							commentIdsToDelete.push(subComment.comment_id);
							if (subComment.sub_comments.length > 0) {
								collectSubCommentIds(subComment.sub_comments);
							}
						}
					};

					collectSubCommentIds(commentToDelete.sub_comments);

					// Delete all comments in parallel
					await Promise.all(
						commentIdsToDelete.map(id => CommentService.deleteComment(id))
					);
					const totalCommentsDeleted = commentIdsToDelete.length;
					onCommentCountChange?.(-1 * totalCommentsDeleted);
					// Update state and comment count
					setCommentState((prev) => {
						const filterComments = (comments: PostComment[]): PostComment[] => {
							const filteredComments: PostComment[] = [];
							for (let i = 0; i < comments.length; i++) {
								const comment = comments[i];
								if (comment.comment_id !== commentId) {
									comment.sub_comments = filterComments(comment.sub_comments);
									filteredComments.push(comment);
								}
							}
							return filteredComments;
						};

						return {
							...prev,
							comments: filterComments(prev.comments),
							showDropdown: null,
							editingCommentId: null,
							editContent: "",
						};
					});
				}
			} catch (error) {
				console.error("Lỗi khi xóa bình luận:", error);
				message.error("Không thể xóa bình luận. Vui lòng thử lại.");
			}
		},
		[onCommentCountChange]
	);

	const updateLikes = (
		comments: PostComment[],
		commentId: string
	): PostComment[] => {
		return comments.map((comment) => {
			if (comment.comment_id === commentId) {
				return {
					...comment,
					total_like: !comment.isLiked
						? comment.total_like + 1
						: comment.total_like - 1,
					isLiked: !comment.isLiked,
				};
			}
			if (comment.sub_comments.length > 0) {
				return {
					...comment,
					sub_comments: updateLikes(comment.sub_comments, commentId),
				};
			}
			return comment;
		});
	};

	const updateComment = (
		comments: PostComment[],
		commentId: string,
		newContent: string
	): PostComment[] => {
		return comments.map((comment) => {
			if (comment.comment_id === commentId) {
				return { ...comment, content: newContent };
			}
			if (comment.sub_comments.length > 0) {
				return {
					...comment,
					sub_comments: updateComment(
						comment.sub_comments,
						commentId,
						newContent
					),
				};
			}
			return comment;
		});
	};

	const CommentComponent: React.FC<{
		comment: PostComment;
		depth?: number;
	}> = React.memo(({ comment, depth = 0 }) => {
		const maxDepth = 5;
		const indentation = Math.min(depth, maxDepth) * 40;

		return (
			<>
				<div
					style={{
						display: "flex",
						marginBottom: "12px",
						marginLeft: `${indentation}px`,
					}}>
					<div style={{ marginTop: "2px" }}>
						<Avatar
							src={
								comment.owner.avatar?.includes("?sv")
									? comment.owner.avatar
									: comment.owner.avatar +
									  "" +
									  process.env.NEXT_PUBLIC_IMAGE_POSTFIX
							}
							alt={comment.owner.name}
							size={32}
						/>
					</div>
					<div style={{ marginLeft: "12px", flex: 1 }}>
						<div
							style={{
								backgroundColor: "rgba(128, 128, 128, 0.1)",
								padding: "8px 12px",
								borderRadius: "12px",
								marginBottom: "8px",
							}}>
							<div
								style={{
									margin: "0",
									fontSize: "14px",
									display: "flex",
									alignItems: "center",
								}}>
								<strong style={{ marginRight: "8px" }}>
									{comment.owner.name}
								</strong>
							</div>
							{commentState.editingCommentId === comment.comment_id ? (
								<div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
									<Input
										ref={editInputRef}
										value={commentState.editContent}
										onChange={(e) =>
											setCommentState((prev) => ({
												...prev,
												editContent: e.target.value,
											}))
										}
										onPressEnter={() => handleSaveEdit(comment.comment_id)}
										style={{ flex: 1 }}
										autoFocus
									/>
									<Button
										onClick={() => handleSaveEdit(comment.comment_id)}
										type='primary'
										size='small'>
										Lưu
									</Button>
									<Button
										onClick={() => {
											setCommentState((prev) => ({
												...prev,
												editingCommentId: null,
												editContent: "",
											}));
										}}
										size='small'>
										Hủy
									</Button>
								</div>
							) : (
								<p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
									{comment.content}
								</p>
							)}
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								fontSize: "12px",
								color: "#8e8e8e",
							}}>
							<span>{convertTime(comment.created_at)}</span>
							<Button
								type='text'
								size='small'
								style={{
									margin: "0 8px",
									padding: 0,
									color: comment.isLiked ? "#0095f6" : "#8e8e8e",
									fontWeight: comment.isLiked ? "bold" : "normal",
								}}
								onClick={() => handleLikeClick(comment.comment_id)}>
								{comment.total_like || 0} lượt thích
							</Button>
							<Button
								type='text'
								size='small'
								style={{ padding: 0 }}
								onClick={() =>
									setCommentState((prev) => ({
										...prev,
										replyingTo: comment.comment_id,
									}))
								}>
								Trả lời
							</Button>
							<div style={{ position: "relative", marginLeft: "auto" }}>
								<FontAwesomeIcon
									icon={faEllipsisH as IconProp}
									style={{ cursor: "pointer" }}
									onClick={() =>
										setCommentState((prev) => ({
											...prev,
											showDropdown: comment.comment_id,
										}))
									}
									className='dropdown-trigger'
								/>
								{commentState.showDropdown === comment.comment_id && (
									<div
										className='comment-dropdown'
										style={{
											position: "absolute",
											right: 0,
											top: "20px",
											backgroundColor: "white",
											border: "1px solid #dbdbdb",
											borderRadius: "3px",
											boxShadow: "0 0 5px rgba(0,0,0,0.1)",
											zIndex: 1000,
										}}>
										<Button
											type='text'
											block
											style={{
												textAlign: "left",
												fontSize: "14px",
											}}
											onClick={(e) => {
												e.preventDefault();
												handleEditComment(comment.comment_id);
											}}>
											Chỉnh sửa
										</Button>
										<Button
											type='text'
											block
											danger
											style={{
												textAlign: "left",
												fontSize: "14px",
											}}
											onClick={(e) => {
												e.preventDefault();
												handleDeleteComment(comment.comment_id);
											}}>
											Xóa
										</Button>
									</div>
								)}
							</div>
						</div>
						{commentState.replyingTo === comment.comment_id && (
							<ReplyInput
								commentId={comment.comment_id}
								authorName={comment.owner.name}
								onSubmit={handleReplySubmit}
								inputKey={replyInputKeys[comment.comment_id] || 0}
								currentUserAvatar={currentUserAvatar}
							/>
						)}
					</div>
				</div>
				{Array.isArray(comment?.sub_comments) &&
					comment?.sub_comments.map((reply, index) => (
						<CommentComponent
							key={index + Math.random()}
							comment={reply}
							depth={depth + 1}
						/>
					))}
			</>
		);
	});

	const handleShowMoreLess = () => {
		if (!isExpanded) {
			// Show more
			const newHeight = containerHeight + 300;
			setContainerHeight(newHeight);
			setIsExpanded(true); // Set to expanded immediately after first expansion

			// Check if we've reached the maximum height
			const commentsContainer = document.querySelector(".comments-container");
			if (commentsContainer && newHeight >= commentsContainer.scrollHeight) {
				setShowMoreButton(false);
			}
		} else {
			// Show less
			setContainerHeight(300); // Reset to initial height
			setIsExpanded(false);
			setShowMoreButton(true);
		}
	};

	return (
		<div style={{ marginTop: "20px" }}>
			<MainCommentInput
				onSubmit={handleCommentSubmit}
				inputKey={commentInputKey}
				currentUserAvatar={currentUserAvatar}
				isLoading={commentState.isLoading}
			/>
			<div
				className='comments-container'
				style={{
					height: `${containerHeight}px`,
					overflowY: "auto",
					transition: "height 0.3s ease-in-out",
				}}>
				{commentState.isLoading ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
						}}>
						<Spin size='large' />
					</div>
				) : (
					commentState.comments.map((comment, index) => (
						<CommentComponent key={index + Math.random()} comment={comment} />
					))
				)}
			</div>
			{showMoreButton && (
				<Button
					onClick={handleShowMoreLess}
					style={{ display: "block", margin: "10px auto" }}>
					{isExpanded ? "Thu gọn" : "Xem thêm"}
				</Button>
			)}
		</div>
	);
};

export default CommentSection;
