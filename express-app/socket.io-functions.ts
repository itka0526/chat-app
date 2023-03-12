import { Server, Socket } from "socket.io";
import {
    ClientToServerEvents,
    DefaultNotification,
    InterServerEvents,
    MessageNotification,
    Notification,
    ServerToClientEvents,
    SocketData,
    UIMessage,
} from "./types";
import { prisma } from "./db";
import { writeFile } from "fs/promises";
import { exists } from "./functions";

export const consoleObject = async (...args: any) => await writeFile("../results.json", JSON.stringify([...args], null, 2));

class BaseHelperClass {
    public io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    public socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

    constructor(
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    ) {
        this.socket = socket;
        this.io = io;
    }

    public notify({
        socket,
        message,
        type,
    }: Notification<DefaultNotification | MessageNotification> & {
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    }) {
        this.io.to(socket.id).emit("notify", { message, type } as Notification<DefaultNotification | MessageNotification>);
    }
}

export class ServerSocketIOFunctions extends BaseHelperClass {
    public HandleFriendsInstance: HandleFriends;
    public HandleUserInstance: HandleUser;
    public HandleGroupInstance: HandleGroups;
    public HandleChatsInstance: HandleChats;

    constructor(
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    ) {
        super(io, socket);

        this.HandleChatsInstance = new HandleChats(this.io, this.socket);
        this.HandleFriendsInstance = new HandleFriends(this.io, this.socket);
        this.HandleUserInstance = new HandleUser(this.io, this.socket);
        this.HandleGroupInstance = new HandleGroups(this.io, this.socket);
    }
}

class HandleGroups extends BaseHelperClass {
    public CreateAndReturnUpdatedList() {
        this.socket.on("create_group", async ({ admin, chatName, members }) => {
            if (!admin || !chatName || !members)
                return this.io.to(this.socket.id).emit("notify", { message: "Failed to create group.", type: "Unknown Error" });

            // create chat with 'group'
            await prisma.chat.create({
                data: {
                    admin,
                    chatName,
                    members: {
                        connect: [{ email: admin }, ...members.map((member) => ({ email: member }))],
                    },
                },
            });

            const result = await prisma.databaseUser.findUnique({
                select: {
                    chat_list: {
                        include: {
                            /**
                             *  Select the latest message for display purposes
                             */
                            messages: {
                                orderBy: { createdAt: "desc" },
                                take: 1,
                                select: { messenger: { select: { displayName: true } }, text: true, createdAt: true },
                            },
                        },
                    },
                },
                where: {
                    email: this.socket.data.userInfo?.email,
                },
            });

            if (!result || !result.chat_list)
                return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });

            console.log(result);

            const chatIdList = result.chat_list.map((chat) => chat.id);
            this.socket.join(chatIdList);
            this.io.to(this.socket.id).emit("respond_chat_list", result.chat_list);

            /**
             * if there are online users who are connected to the server update their list too
             */

            for (const socket of this.io.of("/").sockets) {
                if (socket[1].data.userInfo?.email && members.includes(socket[1].data.userInfo?.email)) {
                    prisma.databaseUser
                        .findUnique({
                            select: {
                                chat_list: {
                                    include: {
                                        /**
                                         *  Select the latest message for display purposes
                                         */
                                        messages: {
                                            orderBy: { createdAt: "desc" },
                                            take: 1,
                                            select: { messenger: { select: { displayName: true } }, text: true, createdAt: true },
                                        },
                                    },
                                },
                            },
                            where: { email: socket[1].data.userInfo.email },
                        })
                        .then(
                            (successfulResult) => {
                                if (successfulResult?.chat_list) {
                                    const chatIdList = result.chat_list.map((chat) => chat.id);
                                    socket[1].join(chatIdList);
                                    return this.io.to(socket[1].id).emit("respond_chat_list", successfulResult?.chat_list);
                                } else {
                                    return this.io
                                        .to(this.socket.id)
                                        .emit("notify", { type: "Unknown Error", message: "Could not properly update chat list. Please reload." });
                                }
                            },
                            () => {
                                return this.io.to(this.socket.id).emit("notify", {
                                    type: "Unknown Error",
                                    message: "Failed to find user in database. Could not properly update chat list. Please reload.",
                                });
                            }
                        );
                }
            }
        });
    }

    public HandleReturnMembers() {
        this.socket.on("get_members", async (chatId) => {
            const result = await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    /**
                     *  Checking if the user is allowed to read chat if not its gonna return empty chat
                     */
                    members: { some: { email: this.socket.data.userInfo?.email } },
                },
                select: {
                    members: true,
                },
            });

            if (!result?.members)
                return this.io
                    .to(this.socket.id)
                    .emit("notify", { type: "Unknown Error", message: `Database failed to retreive members of '${chatId}' group.` });

            return this.io.to(this.socket.id).emit("respond_get_members", result.members);
        });
    }

    public HandleKickMember() {
        /**
         *  The things this function must do:
         *      - kick that socket out from SocketIO room 100%
         *      - remove ability to write to the chat ?
         *      - remove ability to read from that chat 100%
         *      - update the list for that user and for other users 100%
         */

        this.socket.on("kick_member", async (kickMemberEmail, chatId) => {
            /**
             *  Check if the user has enough privileges to kick a member from a chat
             */

            const privileged = Boolean(
                await prisma.chat.findFirst({
                    where: {
                        id: chatId,
                        admin: this.socket.data.userInfo?.email,
                    },
                    select: { id: true },
                })
            );

            /**
             *  If somehow user managed to find the kick button and sent a request notify the user that he does not have enough privileges.
             */

            if (!privileged)
                return this.io
                    .to(this.socket.id)
                    .emit("notify", { type: "Unknown Error", message: `User does not have enough privileges to kick ${kickMemberEmail}.` });

            /**
             *  If privileged then delete that the user with 'email' from the group
             */

            if (privileged) {
                /**
                 *  If user is trying to remove himself notify that you cannot remove yourself
                 */
                if (this.socket.data.userInfo?.email === kickMemberEmail) {
                    return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "You cannot remove yourself." });
                }

                /**
                 *  If somehow email is invalid email return notification
                 */
                if (!kickMemberEmail.includes("@"))
                    this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Invalid email was given." });

                const membersResult = await prisma.chat.update({
                    where: { id: chatId },
                    data: { members: { disconnect: { email: kickMemberEmail } } },
                    select: { members: true },
                });

                /**
                 *  If members's list is false then something went wrong with the database
                 */
                if (!membersResult)
                    return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Could not update member's list." });

                for (const socket of this.io.of("/").sockets) {
                    /**
                     *  ~ Kicked member should leave the live room
                     *  ~ Kicked member should get its the updated list
                     */
                    if (socket[1].data.userInfo?.email === kickMemberEmail) {
                        socket[1].leave(chatId);

                        const result = await prisma.databaseUser.findUnique({
                            select: {
                                chat_list: {
                                    include: {
                                        /**
                                         *  Select the latest message for display purposes
                                         */
                                        messages: {
                                            orderBy: { createdAt: "desc" },
                                            take: 1,
                                            select: { messenger: { select: { displayName: true } }, text: true, createdAt: true },
                                        },
                                    },
                                },
                            },
                            // Kicked member should get its the updated list
                            where: { email: socket[1].data.userInfo.email },
                        });

                        if (!result?.chat_list) {
                            this.io.to(socket[1].id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });
                        } else if (result?.chat_list) {
                            this.io.to(socket[1].id).emit("respond_chat_list", result.chat_list);
                        }
                    }
                }
                return this.io.to(chatId).emit("respond_get_members", membersResult.members);
            }
        });
    }

    public HandleDeleteGroup() {
        /**
         *  This function should handle deletion of group
         *  in order to delete a group the user must be an admin
         */

        this.socket.on("delete_group", async (chatId) => {
            /**
             *  Checking if the user is actually admin of that group and knows the group id!
             *  Or the group does not exist !
             */

            if (!(await exists(prisma.chat, { where: { id: chatId, admin: this.socket.data.userInfo?.email } })))
                return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "You do not have permission to delete." });

            /**
             *  Delete the group!
             */

            prisma.chat.delete({ where: { id: chatId }, select: { members: { select: { email: true } } } }).then(
                async (result) => {
                    if (!result)
                        return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "The group does not have any members." });

                    const onlyEmails = result.members.map((m) => m.email);

                    /**
                     *  Checking if in the list there is an email, if so, send a message to notify them!
                     *  And make sure that they all leave the socket room too!
                     */

                    for (const socket of this.io.of("/").sockets)
                        if (socket[1].data.userInfo?.email && onlyEmails.includes(socket[1].data.userInfo?.email)) {
                            socket[1].leave(chatId);

                            const result = await prisma.databaseUser.findUnique({
                                select: {
                                    chat_list: {
                                        include: {
                                            /**
                                             *  Select the latest message for display purposes
                                             */
                                            messages: {
                                                orderBy: { createdAt: "desc" },
                                                take: 1,
                                                select: { messenger: { select: { displayName: true } }, text: true, createdAt: true },
                                            },
                                        },
                                    },
                                },
                                where: { email: socket[1].data.userInfo.email },
                            });

                            if (!result?.chat_list) {
                                this.io.to(socket[1].id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });
                            } else if (result?.chat_list) {
                                this.io.to(socket[1].id).emit("respond_chat_list", result.chat_list);
                            }
                        }
                },
                (err) => {
                    console.log(err);
                }
            );
        });
    }
}

class HandleChats extends BaseHelperClass {
    public async getChatList() {
        this.socket.on("chat_list", async () => {
            const result = await prisma.databaseUser.findUnique({
                select: {
                    chat_list: {
                        include: {
                            /**
                             *  Select the latest message for display purposes
                             */
                            messages: {
                                orderBy: { createdAt: "desc" },
                                take: 1,
                                select: { messenger: { select: { displayName: true } }, text: true, createdAt: true },
                            },
                        },
                    },
                },
                where: {
                    email: this.socket.data.userInfo?.email,
                },
            });

            if (!result || !result.chat_list)
                return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });

            return this.io.to(this.socket.id).emit("respond_chat_list", result.chat_list);
        });
    }

    public postChat() {
        this.socket.on("post_chat", async (chat, user, message = "") => {
            const userA = this.socket.data.userInfo?.email;
            if (!userA) return this.socket.disconnect();

            if (!chat.id) return;

            const { id: messageId, createdAt: messageCreatedDate } = await prisma.message.create({
                data: {
                    text: message,
                    messengerEmail: userA,
                    chatId: chat.id,
                },
                select: { id: true, createdAt: true },
            });

            const msg: UIMessage = {
                chatId: chat.id,
                createdAt: messageCreatedDate,
                messageId: messageId,
                text: message,
                messengerEmail: userA,
                displayName: user.displayName,
                profileImageURL: user.profileImageURL,
            };

            /**
             *  Passing chatId so on click the user can be taken to that chat!
             */

            const messageNotification: Notification<MessageNotification> = {
                type: "New Message",
                /**
                 *  if message is too long send the first 25 characters
                 */
                message: { ...chat, displayName: msg.displayName, text: msg.text.substring(0, 25) },
            };

            this.io.to(chat.id).emit("notify", messageNotification);

            return this.io.to(chat.id).emit("respond_live_chat", msg);
        });
    }

    public getChat() {
        this.socket.on("get_chat", async (chatId, { skip, take }, type) => {
            const result = (await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    /**
                     *  Checking if the user is allowed to read chat if not its gonna return empty chat
                     */
                    members: { some: { email: this.socket.data.userInfo?.email } },
                },
                select: {
                    messages: {
                        orderBy: { id: "desc" },
                        select: {
                            id: true,
                            createdAt: true,
                            text: true,
                            messengerEmail: true,
                            messenger: { select: { displayName: true, profileImageURL: true } },
                        },
                        skip: skip,
                        take: take,
                    },
                },
            })) || { messages: [] };

            const formattedMessages: UIMessage[] = result.messages.map((message) => ({
                chatId: chatId,
                createdAt: message.createdAt,
                messageId: message.id,
                displayName: message.messenger.displayName,
                messengerEmail: message.messengerEmail,
                profileImageURL: message.messenger.profileImageURL,
                text: message.text,
            }));

            this.io.to(this.socket.id).emit("respond_get_chat", formattedMessages, type);
        });
    }
}

class HandleFriends extends BaseHelperClass {
    public handleReturningOfListOfFriends = () =>
        this.socket.on("request_list_of_friends", async (email) => {
            // handle for if the user wants list of his friends
            if (!email) {
                const result = await prisma.databaseUser.findUnique({
                    where: { email: this.socket.data.userInfo?.email },
                    select: { friends: true },
                });
                if (result?.friends) return this.io.to(this.socket.id).emit("respond_list_of_friends", result?.friends);
            }
            // handle for if the user wants list of someone else's friends
            if (email) {
                const result = await prisma.databaseUser.findUnique({
                    where: { email: email },
                    select: { friends: true },
                });
                if (result?.friends) return this.io.to(this.socket.id).emit("respond_list_of_friends", result?.friends);
            }
        });

    public handleAddingFriends = () => {
        this.socket.on("add_friend", async (email) => {
            const userA = this.socket.data.userInfo?.email,
                userB = email;

            // if 'email' is invalid automatically respond with false result
            if (typeof email != "string" || !email.includes("@"))
                return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "invalid_email" });

            /**
             *  if the 'email' is valid but the email is same as the requester's email [cannot friend yourself]
             */

            if (userA === userB) return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "cannot_friend_yourself" });

            const requestedUserExists = await exists(prisma.databaseUser, { where: { email: userB } });

            /**
             *  if 'email' is valid but the user does not exist then return false
             */

            if (!requestedUserExists) return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "user_does_not_exist" });

            /**
             *  if the users are already friends
             */

            const areFriends = await prisma.databaseUser.findUnique({
                where: { email: userA },
                select: { friends: { where: { email: userB }, select: { email: true } } },
            });

            if (areFriends?.friends[0]?.email === userB)
                return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "already_friends" });

            /**
             *  if 'email' is valid and 'user' exists, add the user to 'friends' and add this 'user' to the other 'user' 'friends'
             */

            const handleUserA = () =>
                prisma.databaseUser.update({
                    where: { email: this.socket.data.userInfo?.email },
                    data: { friends: { connect: { email: email } } },
                    select: { email: true },
                });

            const handleUserB = () =>
                prisma.databaseUser.update({
                    where: { email: email },
                    data: { friends: { connect: { email: this.socket.data.userInfo?.email } } },
                    select: { email: true },
                });

            Promise.allSettled([handleUserA(), handleUserB()]).then(async ([resultA, resultB]) => {
                if (resultA.status === "fulfilled") this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "success" });

                if (resultA.status === "rejected") this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "failed" });

                if (resultB.status === "fulfilled")
                    //notify userB that he has a new friend !
                    for (const socket of this.io.of("/").sockets)
                        if (socket[1].data.userInfo?.email === email) {
                            this.notify({ socket: socket[1], type: "New Friend", message: `${userA} added you as a friend.` });
                        }
            });
        });
    };
}

class HandleUser extends BaseHelperClass {
    public findUsers() {
        this.socket.on("find_users", async (email) => {
            // if 'email' is invalid type automatically respond with false result
            if (typeof email != "string") return this.io.to(this.socket.id).emit("respond_find_users", []);

            // find all the possible users and return
            const users = await prisma.databaseUser.findMany({
                where: {
                    email: {
                        startsWith: email,
                    },
                },
                select: {
                    email: true,
                    displayName: true,
                    profileImageURL: true,
                },
            });

            return this.io.to(this.socket.id).emit("respond_find_users", users);
        });
    }
}
