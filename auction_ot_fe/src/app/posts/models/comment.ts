import { CachingCommentLike } from "../utils/caching_post_like";
import { Owner } from "./post";

class PostComment {
    comment_id: string;
    post_id: string;
    owner: Owner;
    content: string;
    parent_id: string | null;
    created_at: string;
    sub_comments: PostComment[];
    total_like: number;
    isLiked: boolean;

    constructor(comment_id: string, post_id: string, owner: Owner, content: string, parent_id: string | null, created_at: string, sub_comments: PostComment[], total_like: number, isLiked: boolean) {
        this.comment_id = comment_id;
        this.post_id = post_id;
        this.owner = owner;
        this.content = content;
        this.parent_id = parent_id;
        this.created_at = created_at;
        this.sub_comments = sub_comments;
        this.total_like = total_like;
        this.isLiked = isLiked;
    }


    static fromJson(json: any, postId: string): PostComment {
        return new PostComment(json.comment_id, postId, json.owner, json.content, json.parent_id, json.created_at, json.sub_comments?.$values ?? [], json.total_like ?? 0, false);
    }

    static fromJsonGet(json: any, owner: Owner): PostComment {
        return new PostComment(json.id, json.postId, owner, json.content, json.parentId, json.createdAt, json.sub_comments?.$values ?? [], json.total_like ?? 0, json.isLiked ?? false);
    }
}

export { PostComment };