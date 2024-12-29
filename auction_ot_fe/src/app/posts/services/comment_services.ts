import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { PostComment } from "../models/comment";

export class CommentService {
    static async createComment(comment: PostComment) {
        const data = {
            postId: comment.post_id,
            content: comment.content,
            userId: comment.owner.user_id,
            parentId: comment.parent_id != '' ? comment.parent_id : null,
        }

        console.log("data shiet", data);
        const response = await axios.post(`${BASE_URL}api/Comments`, data);
        return response.data;
    }

    static async getCommentsByPostId(postId: string) {
        const response = await axios.get(`${BASE_URL}api/Comments?post_id=${postId}`);
        let list_result: PostComment[] = [];
        console.log("response", response.data);
        console.log('response.data.data.$values: ', response.data.data.$values);
        for (const comment of response.data.data.$values) {
            console.log('commentcomment: ', comment);
            console.log('postIdpostId: ', postId);

            list_result.push(PostComment.fromJson(comment, postId));
        }
        console.log("list_resultlist_result", list_result);
        return list_result;
    }

    static async updateComment(commentId: string, newContent: string) {
        const data = {
            id: commentId,
            content: newContent,
        }
        await axios.put(`${BASE_URL}api/Comments`, data);
    }

    static async deleteComment(commentId: string) {
        await axios.delete(`${BASE_URL}api/Comments?comment_id=${commentId}`);
    }
}
