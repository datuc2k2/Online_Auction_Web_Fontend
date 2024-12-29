import { PostStatus } from "../utils/enum";

class Owner {
    user_id: string;
    name: string;
    avatar: string;

    constructor(user_id: string, name: string, avatar: string) {
        this.user_id = user_id;
        this.name = name;
        this.avatar = avatar;
    }
}

class Post {
    post_id: string;
    owner: Owner;
    content: string;
    create_at: string;
    comment_count: number;
    total_likes: number;
    status: PostStatus;

    constructor(post_id: string, owner: Owner, content: string, create_at: string, comment_count: number, total_likes: number, status: PostStatus) {
        this.post_id = post_id;
        this.owner = owner;
        this.content = content;
        this.create_at = create_at;
        this.comment_count = comment_count;
        this.total_likes = total_likes;
        this.status = status;
    }

    static fromJson(json: any): Post {
        return new Post(json.post_id, json.owner, json.content, json.create_at, json.total_comment, json.total_like, json.status as PostStatus);
    }

    static initData: Post[] = [
        new Post('1', new Owner('1', 'John Doe', 'avatar1.jpg'), 'content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1content1', '2021-01-01', 10, 20, PostStatus.PENDING),
        new Post('2', new Owner('2', 'Jane Doe', 'avatar2.jpg'), 'content2', '2021-01-02', 15, 25, PostStatus.PENDING),
        new Post('3', new Owner('3', 'Jim Doe', 'avatar3.jpg'), 'content3', '2021-01-03', 20, 30, PostStatus.PENDING),
        new Post('4', new Owner('4', 'Jill Doe', 'avatar4.jpg'), 'content4', '2021-01-04', 25, 35, PostStatus.PENDING),
        new Post('5', new Owner('5', 'Jack Doe', 'avatar5.jpg'), 'content5', '2021-01-05', 30, 40, PostStatus.PENDING),
        new Post('6', new Owner('6', 'Jake Doe', 'avatar6.jpg'), 'content6', '2021-01-06', 35, 45, PostStatus.PENDING),
        new Post('7', new Owner('7', 'Jill Doe', 'avatar7.jpg'), 'content7', '2021-01-07', 40, 50, PostStatus.PENDING),
    ];
}

export { Post, Owner };
