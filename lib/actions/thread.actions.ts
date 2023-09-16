"use server"

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {

        connectToDB()

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        })

        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);

    }
}

export async function fetchThread(pageNumber = 1, pageSize = 20) {
    connectToDB()

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the post the posts that have no parents (top-level threads...)
    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId iamge",
            }
        })

    const totalPostsCount = await Thread.countDocuments({ parentID: { $in: [null, undefined] } })
    const posts = await threadsQuery.exec()
    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext }

}


export async function fetchThreadById(id: string) {
    connectToDB()

    try {
        // TODO: Populate Community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image",
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

        return thread
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {

    connectToDB()

    try {
        const originalThread = await Thread.findById(threadId)

        if (!originalThread) {
            throw new Error("Thread not found")
        }

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })

        const savedCommentThread = await commentThread.save()

        originalThread.children.push(savedCommentThread._id)
        await originalThread.save()

        revalidatePath(path)

    } catch (error: any) {
        console.error('Error while adding comment:', error)
        throw new Error("Unable to add comment");
        
    }
}