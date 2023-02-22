import { Server, Socket } from "socket.io";
import { ClientToServerEvents, InterServerEvents, NotifyFunctionArgs, ServerToClientEvents, SocketData, UIMessage } from "./types";
import { prisma } from "./db";
import { writeFile } from "fs/promises";
import { exists } from "./functions";
import { Message, DatabaseUser } from "@prisma/client";

export const consoleObject = async (args: any) => await writeFile("../results.json", JSON.stringify([...args], null, 2));

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

    public notify({ socket, message, type }: NotifyFunctionArgs) {
        this.io.to(socket.id).emit("notify", { message: message, type: type });
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
                    chat_list: true,
                },
                where: {
                    email: this.socket.data.userInfo?.email,
                },
            });

            if (!result || !result.chat_list)
                return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });

            this.io.to(this.socket.id).emit("respond_chat_list", result.chat_list);
        });
    }
}

class HandleChats extends BaseHelperClass {
    public async getChatList() {
        this.socket.on("chat_list", async () => {
            const result = await prisma.databaseUser.findUnique({
                select: {
                    chat_list: true,
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
        this.socket.on("post_chat", async (chatId, user, message = "") => {
            const userA = this.socket.data.userInfo?.email;
            if (!userA) return this.socket.disconnect();

            if (!chatId) return;

            const { id: messageId } = await prisma.message.create({
                data: {
                    text: message,
                    messengerEmail: userA,
                    chatId: chatId,
                },
                select: { id: true },
            });

            const msg: UIMessage = {
                messageId: messageId,
                text: message,
                messengerEmail: userA,
                displayName: user.displayName,
                profileImageURL: user.profileImageURL,
            };

            return this.io.to(chatId).emit("respond_live_chat", msg);
        });
    }

    public getChat() {
        this.socket.on("get_chat", async (chatId) => {
            const result = (await prisma.chat.findFirst({
                where: {
                    id: chatId,
                    /**
                     *  Checking if the user is allowed to read chat if not it most likely gonna return empty chat
                     */
                    members: { some: { email: this.socket.data.userInfo?.email } },
                },
                select: {
                    messages: {
                        select: {
                            id: true,
                            text: true,
                            messengerEmail: true,
                            messenger: { select: { displayName: true, profileImageURL: true } },
                        },
                        take: 10,
                    },
                },
            })) || { messages: [] };

            const formattedMessages: UIMessage[] = result.messages.map((message) => ({
                messageId: message.id,
                displayName: message.messenger.displayName,
                messengerEmail: message.messengerEmail,
                profileImageURL: message.messenger.profileImageURL,
                text: message.text,
            }));

            this.socket.emit("respond_get_chat", formattedMessages);
        });
    }

    public kickMember() {
        /**
         *  The things this function must do:
         *      - kick that socket out from SocketIO room
         *      - remove ability to write to the chat
         *      - remove ability to read from that chat (50%)
         *      - update the list for that user
         */
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
                            break;
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
