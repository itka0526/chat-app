import { Request, Response } from "express";
import { prisma } from "./db";
import { ErrorTypes } from "./types";

/**
 * This function also handles creation of new a "user"
 *
 */
export const returnChatList = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const { email, displayName } = req.body;

    /**
     * If there is a user with this 'email' then return user's 'chat_list'
     *
     */

    const chatList = await prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            chat_list: true,
        },
    });

    if (chatList) {
        return res.json(chatList);
    }

    /**
     * If there is no user with this 'email' then create a new 'user' and return a new 'chat_list'
     *
     */

    if (!chatList && displayName) {
        const newChatList = await prisma.user.create({
            data: {
                email: email,
                displayName: displayName,
            },
            select: {
                chat_list: true,
            },
        });
        return res.json(newChatList);
    }

    return handleFailedResponse(res, "Could not create a new user with this 'email' or return its 'chat list'.");
};

export const createNewChat = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const { email, chatName } = req.body;

    /**
     * Handle exception when email might be invalid
     *
     */

    if (typeof email != "string" || !email.includes("@")) return handleFailedResponse(res, "Email is invalid.");

    /**
     * Handle exception when email does not exist
     *
     */

    if (!(await exists(prisma.user, { where: { email: email } }))) return handleFailedResponse(res, "User does not exist.");

    /**
     * Handle the creation of a new 'chat' and
     * entering the 'user' into the 'chat' as an'admin' and as a 'member'
     *
     */

    return res.json(
        await prisma.chat.create({
            data: {
                chatName: chatName || `${email}'s chat`,
                admin: email,
                members: {
                    connect: {
                        email: email,
                    },
                },
            },
            select: {
                id: true,
                chatName: true,
                admin: true,
                members: true,
                messages: true,
                createdAt: true,
            },
        })
    );
};

export const getChat = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    const { id } = req.body;

    if (!id) return handleFailedResponse(res, "Invalid ID.");

    return res.json(
        await prisma.chat.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                admin: true,
                members: true,
                messages: true,
                createdAt: true,
            },
        })
    );
};

export const exists = async <Model extends { count: any }>(model: Model, args: Parameters<Model["count"]>[0]): Promise<boolean> => {
    const count = await model.count(args);
    return Boolean(count);
};

export const handleFailedResponse = (res: Response, err: ErrorTypes) =>
    res.status(500).json({ message: "Sorry, something went wrong with the server :/ ", error: err });
