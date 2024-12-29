export class CachingPostLike {
    private static key = 'PostLiked';
    static addPostLike(postId: string) {
        const currentPostLiked = localStorage.getItem(this.key) || '[]';
        const postLikedArray = JSON.parse(currentPostLiked);
        postLikedArray.push(postId);
        localStorage.setItem(this.key, JSON.stringify(postLikedArray));
    }

    static removePostLike(postId: string) {
        const currentPostLiked = localStorage.getItem(this.key) || '[]';
        const postLikedArray = JSON.parse(currentPostLiked);
        const filteredPostLikedArray = postLikedArray.filter((id: string) => id !== postId);
        localStorage.setItem(this.key, JSON.stringify(filteredPostLikedArray));
    }

    static isPostLiked(postId: string) {
        const currentPostLiked = localStorage.getItem(this.key) || '[]';
        const postLikedArray = JSON.parse(currentPostLiked);
        return postLikedArray.includes(postId);
    }
}

export class CachingCommentLike {
    private static key = 'CommentLiked';

    static addCommentLike(commentId: string) {
        const currentCommentLiked = localStorage.getItem(this.key) || '[]';
        const commentLikedArray = JSON.parse(currentCommentLiked);
        commentLikedArray.push(commentId);
        localStorage.setItem(this.key, JSON.stringify(commentLikedArray));
    }

    static removeCommentLike(commentId: string) {
        const currentCommentLiked = localStorage.getItem(this.key) || '[]';
        const commentLikedArray = JSON.parse(currentCommentLiked);
        const filteredCommentLikedArray = commentLikedArray.filter((id: string) => id !== commentId);
        localStorage.setItem(this.key, JSON.stringify(filteredCommentLikedArray));
    }

    static isCommentLiked(commentId: string) {
        const currentCommentLiked = localStorage.getItem(this.key) || '[]';
        const commentLikedArray = JSON.parse(currentCommentLiked);
        return commentLikedArray.includes(commentId);
    }
}
