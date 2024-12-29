import { Post } from "../models/post";

import axios from "axios";
import { PostStatus } from "../utils/enum";
import { BASE_URL } from "../utils/constant";
import { openNotification } from "@/utility/Utility";
import AxiosInstance from "@/store/SetupAxios";

export class PostService {
    static async createPost(post) {
        const formData = new FormData();
        formData.append('Post.Title', post.title);
        formData.append('Post.Content', post.content);
        formData.append('Post.CategoryId', post.category);
        formData.append('Images', post.file);
        try {
            const response = await AxiosInstance.post(BASE_URL + 'api/Posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    static async getPostCategory() {
        const response = await axios.get(`${BASE_URL}api/Posts/getPostCategory`);
        const postCategory: any[] = [];
        console.log("response posts", response.data);
        for (const postCate of response.data.categories.$values) {
            postCategory.push({ id: postCate.id, name: postCate.name });
        }
        return postCategory;
    }
    

    static async getPosts(isAdmin: boolean) {
        const response = await axios.get(`${BASE_URL}api/Posts?isAdmin=${isAdmin}`);
        const posts: any[] = [];
        console.log("response posts", response.data);
        for (const post of response.data.data.$values) {
            posts.push({
                post_id: post.post_id,
                title: post.title,
                content: post.content,
                status: post.status,
                category: {
                    id: post.category.id,
                    name: post.category.name,
                },
                images: {
                    ...(post?.images?.$values?.map(i => i.mediaUrl) || [])
                },
                create_at: post.create_at,
                total_comment: post.total_comment,
                total_like: post.total_like,
                owner: {
                    name: post.owner.name,
                    avatar: post.owner.avatar,
                }
            });
        }
        return posts;
    }

    static async getPostByUserId(userId: number) {
        const response = await axios.get(`${BASE_URL}api/Posts/getPostByUserId/${userId}`);
        const posts: any[] = [];
        console.log("response posts", response.data);
        for (const post of response.data.data.$values) {
            posts.push({
                post_id: post.post_id,
                title: post.title,
                content: post.content,
                status: post.status,
                category: {
                    id: post.category.id,
                    name: post.category.name,
                },
                images: {
                    ...(post?.images?.$values?.map(i => i.mediaUrl) || [])
                },
                create_at: post.create_at,
                total_comment: post.total_comment,
                total_like: post.total_like,
                owner: {
                    name: post.owner.name,
                    avatar: post.owner.avatar,
                }
            });
        }
        return posts;
    }

    static async getPostByUserIdAndAuctionId(userId: number, auctionId: number) {
        const response = await axios.get(`${BASE_URL}api/Posts/getPostByUserIdAndAuctionId?UserId=${userId}&AuctionId=${auctionId}`);
        const posts: any[] = [];
        console.log("response posts", response.data);
        for (const post of response.data.data.$values) {
            posts.push({
                post_id: post.post_id,
                title: post.title,
                content: post.content,
                status: post.status,
                category: {
                    id: post.category.id,
                    name: post.category.name,
                },
                images: {
                    ...(post?.images?.$values?.map(i => i.mediaUrl) || [])
                },
                create_at: post.create_at,
                total_comment: post.total_comment,
                total_like: post.total_like,
                owner: {
                    name: post.owner.name,
                    avatar: post.owner.avatar,
                }
            });
        }
        return posts;
    }

    static async postStickPostToAuction(postIds: number[], auctionId: number) {
        try {
            const objSubmit = {
                auctionId: auctionId,
                postIds: postIds
            }              
            const response = await axios.post(`${BASE_URL}api/Posts/stickPostToAuction`, objSubmit);
            if(response) {
                openNotification('success', 'Thành công', 'Gán bài đăng thành công')
            }
        } catch (error) {
            openNotification('error', '', 'Gán bài đăng lỗi')
        }
    }


    static async getPostById(postId: string) {
        const response = await axios.get(`${BASE_URL}api/posts/${postId}`);
        return response.data.$values;
    }

    static async updateStatusPost(postId: string, status: PostStatus): Promise<void> {
        try {
            await axios.put(`${BASE_URL}api/Posts?PostId=${postId}&PostStatus=${status}`,{});
        } catch (error) {
            throw new Error('Failed to update post status');
        }
    }
    static async likePost(postId: string, commentId: string, userId: string) {
        let data = {}
        if (postId == '') {
            data = {
                commentId: Number(commentId) || '',
                userId: Number(userId) || ''
            }
        }

        if (commentId == '') {
            data = {
                postId: Number(postId) || '',
                userId: Number(userId) || ''
            }
        }

        const response = await axios.post(`${BASE_URL}api/Likes`, data);
        return response.data;
    }
}

