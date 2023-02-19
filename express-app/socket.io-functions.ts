import { Server, Socket } from "socket.io";
import { ClientToServerEvents, InterServerEvents, NotifyFunctionArgs, ServerToClientEvents, SocketData } from "./types";
import { prisma } from "./db";
import { writeFile } from "fs/promises";

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
    public Initializer: Initializer;

    constructor(
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    ) {
        super(io, socket);

        this.Initializer = new Initializer(this.io, this.socket);

        this.HandleFriendsInstance = new HandleFriends(this.io, this.socket);
        this.HandleUserInstance = new HandleUser(this.io, this.socket);
        this.HandleGroupInstance = new HandleGroups(this.io, this.socket);
    }
}

class Initializer extends BaseHelperClass {
    public HandleChats: HandleChats;

    constructor(
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    ) {
        super(io, socket);

        this.HandleChats = new HandleChats(this.io, this.socket);
    }

    public async initialize() {
        await this.HandleChats.returnChatListOfCurrentUser();
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

            await new HandleChats(this.io, this.socket).returnChatListOfCurrentUser();
        });
    }
}

class HandleChats extends BaseHelperClass {
    public async returnChatListOfCurrentUser() {
        const newChats = await prisma.user.findUnique({
            select: {
                chat_list: true,
            },
            where: {
                email: this.socket.data.userInfo?.email,
            },
        });

        if (!newChats || !newChats.chat_list)
            return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });

        this.io.to(this.socket.id).emit("respond_updated_chat_list", newChats.chat_list);
    }
}

class HandleFriends extends BaseHelperClass {
    public handleReturningOfListOfFriends = () =>
        this.socket.on("request_list_of_friends", async (email) => {
            // handle for if the user wants list of his friends
            if (!email) {
                const result = await prisma.user.findUnique({
                    where: { email: this.socket.data.userInfo?.email },
                    select: { friends: true },
                });
                if (result?.friends) return this.io.to(this.socket.id).emit("respond_list_of_friends", result?.friends);
            }
            // handle for if the user wants list of someone else's friends
            if (email) {
                const result = await prisma.user.findUnique({
                    where: { email: email },
                    select: { friends: true },
                });
                if (result?.friends) return this.io.to(this.socket.id).emit("respond_list_of_friends", result?.friends);
            }
        });

    public handleAddingFriends = () => {
        this.socket.on("add_friend", async (email) => {
            // if 'email' is invalid automatically respond with false result
            if (typeof email != "string" || !email.includes("@"))
                return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "invalid_email" });

            // if the 'email' is valid but the email is same as the requester's email [cannot friend yourself]
            if (email === this.socket.data.userInfo?.email)
                return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "cannot_friend_yourself" });

            const requestedToThisUser = await prisma.user.findUnique({ where: { email } });

            // if 'email' is valid but the user does not exist then return false
            if (!requestedToThisUser) return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "user_does_not_exist" });

            // if the users are already friends
            const areFriends = await prisma.user.findUnique({
                where: { email: this.socket.data.userInfo?.email },
                select: { friends: { where: { email: email }, select: { email: true } } },
            });

            if (areFriends?.friends[0]?.email === email)
                return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "already_friends" });

            /**
             * if 'email' is valid and 'user' exists, add the user to 'friends' and add this 'user' to the other 'user' 'friends'
             */

            // update the original user's friends list
            const original = await prisma.user.update({
                where: {
                    email: this.socket.data.userInfo?.email,
                },
                data: {
                    friends: {
                        connect: {
                            email: requestedToThisUser.email,
                        },
                    },
                },
                select: {
                    email: true,
                },
            });

            // notify the other user
            for (const socket of this.io.of("/").sockets) {
                if (socket[1].data.userInfo?.email === email) {
                    this.notify({ socket: socket[1], type: "New Friend", message: `${original.email} added you as a friend.` });
                    break;
                }
            }

            // success
            if (original.email === this.socket.data.userInfo?.email)
                return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "success" });
            // else some unknown exception happened along the way
            else return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "failed" });
        });
    };
}

class HandleUser extends BaseHelperClass {
    public findUsers() {
        this.socket.on("find_users", async (email) => {
            // if 'email' is invalid type automatically respond with false result
            if (typeof email != "string") return this.io.to(this.socket.id).emit("respond_find_users", []);

            // find all the possible users and return
            const users = await prisma.user.findMany({
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
