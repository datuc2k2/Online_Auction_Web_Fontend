class Like {
    like_id: string;
    post_id: string;
    user_id: string;
    cmt_id: string;
    created_at: string;

    constructor(like_id: string, post_id: string, user_id: string, cmt_id: string, created_at: string) {
        this.like_id = like_id;
        this.post_id = post_id;
        this.user_id = user_id;
        this.cmt_id = cmt_id;
        this.created_at = created_at;
    }
}

export { Like };