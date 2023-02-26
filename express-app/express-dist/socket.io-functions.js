"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSocketIOFunctions = exports.consoleObject = void 0;
const db_1 = require("./db");
const promises_1 = require("fs/promises");
const functions_1 = require("./functions");
const consoleObject = (...args) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, promises_1.writeFile)("../results.json", JSON.stringify([...args], null, 2)); });
exports.consoleObject = consoleObject;
class BaseHelperClass {
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;
    }
    notify({ socket, message, type }) {
        this.io.to(socket.id).emit("notify", { message: message, type: type });
    }
}
class ServerSocketIOFunctions extends BaseHelperClass {
    constructor(io, socket) {
        super(io, socket);
        this.HandleChatsInstance = new HandleChats(this.io, this.socket);
        this.HandleFriendsInstance = new HandleFriends(this.io, this.socket);
        this.HandleUserInstance = new HandleUser(this.io, this.socket);
        this.HandleGroupInstance = new HandleGroups(this.io, this.socket);
    }
}
exports.ServerSocketIOFunctions = ServerSocketIOFunctions;
class HandleGroups extends BaseHelperClass {
    CreateAndReturnUpdatedList() {
        this.socket.on("create_group", ({ admin, chatName, members }) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!admin || !chatName || !members)
                return this.io.to(this.socket.id).emit("notify", { message: "Failed to create group.", type: "Unknown Error" });
            // create chat with 'group'
            yield db_1.prisma.chat.create({
                data: {
                    admin,
                    chatName,
                    members: {
                        connect: [{ email: admin }, ...members.map((member) => ({ email: member }))],
                    },
                },
            });
            const result = yield db_1.prisma.databaseUser.findUnique({
                select: {
                    chat_list: true,
                },
                where: {
                    email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email,
                },
            });
            if (!result || !result.chat_list)
                return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });
            const chatIdList = result.chat_list.map((chat) => chat.id);
            this.socket.join(chatIdList);
            this.io.to(this.socket.id).emit("respond_chat_list", result.chat_list);
            /**
             * if there are online users who are connected to the server update their list too
             */
            for (const socket of this.io.of("/").sockets) {
                if (((_b = socket[1].data.userInfo) === null || _b === void 0 ? void 0 : _b.email) && members.includes((_c = socket[1].data.userInfo) === null || _c === void 0 ? void 0 : _c.email)) {
                    db_1.prisma.databaseUser.findUnique({ select: { chat_list: true }, where: { email: socket[1].data.userInfo.email } }).then((successfulResult) => {
                        if (successfulResult === null || successfulResult === void 0 ? void 0 : successfulResult.chat_list) {
                            const chatIdList = result.chat_list.map((chat) => chat.id);
                            socket[1].join(chatIdList);
                            return this.io.to(socket[1].id).emit("respond_chat_list", successfulResult === null || successfulResult === void 0 ? void 0 : successfulResult.chat_list);
                        }
                        else {
                            return this.io
                                .to(this.socket.id)
                                .emit("notify", { type: "Unknown Error", message: "Could not properly update chat list. Please reload." });
                        }
                    }, () => {
                        return this.io.to(this.socket.id).emit("notify", {
                            type: "Unknown Error",
                            message: "Failed to find user in database. Could not properly update chat list. Please reload.",
                        });
                    });
                }
            }
        }));
    }
    HandleReturnMembers() {
        this.socket.on("get_members", (chatId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield db_1.prisma.chat.findFirst({
                where: {
                    id: chatId,
                    /**
                     *  Checking if the user is allowed to read chat if not its gonna return empty chat
                     */
                    members: { some: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email } },
                },
                select: {
                    members: true,
                },
            });
            if (!(result === null || result === void 0 ? void 0 : result.members))
                return this.io
                    .to(this.socket.id)
                    .emit("notify", { type: "Unknown Error", message: `Database failed to retreive members of '${chatId}' group.` });
            return this.io.to(this.socket.id).emit("respond_get_members", result.members);
        }));
    }
    HandleKickMember() {
        /**
         *  The things this function must do:
         *      - kick that socket out from SocketIO room 100%
         *      - remove ability to write to the chat ?
         *      - remove ability to read from that chat 100%
         *      - update the list for that user and for other users 100%
         */
        this.socket.on("kick_member", (kickMemberEmail, chatId) => __awaiter(this, void 0, void 0, function* () {
            /**
             *  Check if the user has enough privileges to kick a member from a chat
             */
            var _a, _b, _c;
            const privileged = Boolean(yield db_1.prisma.chat.findFirst({
                where: {
                    id: chatId,
                    admin: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email,
                },
                select: { id: true },
            }));
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
                if (((_b = this.socket.data.userInfo) === null || _b === void 0 ? void 0 : _b.email) === kickMemberEmail) {
                    return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "You cannot remove yourself." });
                }
                /**
                 *  If somehow email is invalid email return notification
                 */
                if (!kickMemberEmail.includes("@"))
                    this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Invalid email was given." });
                const membersResult = yield db_1.prisma.chat.update({
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
                    if (((_c = socket[1].data.userInfo) === null || _c === void 0 ? void 0 : _c.email) === kickMemberEmail) {
                        socket[1].leave(chatId);
                        const result = yield db_1.prisma.databaseUser.findUnique({
                            select: { chat_list: true },
                            where: { email: socket[1].data.userInfo.email },
                        });
                        if (!(result === null || result === void 0 ? void 0 : result.chat_list)) {
                            this.io.to(socket[1].id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });
                        }
                        else if (result === null || result === void 0 ? void 0 : result.chat_list) {
                            this.io.to(socket[1].id).emit("respond_chat_list", result.chat_list);
                        }
                    }
                }
                return this.io.to(chatId).emit("respond_get_members", membersResult.members);
            }
        }));
    }
}
class HandleChats extends BaseHelperClass {
    getChatList() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on("chat_list", () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const result = yield db_1.prisma.databaseUser.findUnique({
                    select: {
                        chat_list: true,
                    },
                    where: {
                        email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email,
                    },
                });
                if (!result || !result.chat_list)
                    return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });
                return this.io.to(this.socket.id).emit("respond_chat_list", result.chat_list);
            }));
        });
    }
    postChat() {
        this.socket.on("post_chat", (chatId, user, message = "") => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userA = (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email;
            if (!userA)
                return this.socket.disconnect();
            if (!chatId)
                return;
            const { id: messageId } = yield db_1.prisma.message.create({
                data: {
                    text: message,
                    messengerEmail: userA,
                    chatId: chatId,
                },
                select: { id: true },
            });
            const msg = {
                messageId: messageId,
                text: message,
                messengerEmail: userA,
                displayName: user.displayName,
                profileImageURL: user.profileImageURL,
            };
            return this.io.to(chatId).emit("respond_live_chat", msg);
        }));
    }
    getChat() {
        this.socket.on("get_chat", (chatId, { skip, take }, type) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = (yield db_1.prisma.chat.findFirst({
                where: {
                    id: chatId,
                    /**
                     *  Checking if the user is allowed to read chat if not its gonna return empty chat
                     */
                    members: { some: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email } },
                },
                select: {
                    messages: {
                        orderBy: { id: "desc" },
                        select: {
                            id: true,
                            text: true,
                            messengerEmail: true,
                            messenger: { select: { displayName: true, profileImageURL: true } },
                        },
                        skip: skip,
                        take: take,
                    },
                },
            })) || { messages: [] };
            const formattedMessages = result.messages.map((message) => ({
                messageId: message.id,
                displayName: message.messenger.displayName,
                messengerEmail: message.messengerEmail,
                profileImageURL: message.messenger.profileImageURL,
                text: message.text,
            }));
            this.io.to(this.socket.id).emit("respond_get_chat", formattedMessages, type);
        }));
    }
}
class HandleFriends extends BaseHelperClass {
    constructor() {
        super(...arguments);
        this.handleReturningOfListOfFriends = () => this.socket.on("request_list_of_friends", (email) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // handle for if the user wants list of his friends
            if (!email) {
                const result = yield db_1.prisma.databaseUser.findUnique({
                    where: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email },
                    select: { friends: true },
                });
                if (result === null || result === void 0 ? void 0 : result.friends)
                    return this.io.to(this.socket.id).emit("respond_list_of_friends", result === null || result === void 0 ? void 0 : result.friends);
            }
            // handle for if the user wants list of someone else's friends
            if (email) {
                const result = yield db_1.prisma.databaseUser.findUnique({
                    where: { email: email },
                    select: { friends: true },
                });
                if (result === null || result === void 0 ? void 0 : result.friends)
                    return this.io.to(this.socket.id).emit("respond_list_of_friends", result === null || result === void 0 ? void 0 : result.friends);
            }
        }));
        this.handleAddingFriends = () => {
            this.socket.on("add_friend", (email) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const userA = (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email, userB = email;
                // if 'email' is invalid automatically respond with false result
                if (typeof email != "string" || !email.includes("@"))
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "invalid_email" });
                /**
                 *  if the 'email' is valid but the email is same as the requester's email [cannot friend yourself]
                 */
                if (userA === userB)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "cannot_friend_yourself" });
                const requestedUserExists = yield (0, functions_1.exists)(db_1.prisma.databaseUser, { where: { email: userB } });
                /**
                 *  if 'email' is valid but the user does not exist then return false
                 */
                if (!requestedUserExists)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "user_does_not_exist" });
                /**
                 *  if the users are already friends
                 */
                const areFriends = yield db_1.prisma.databaseUser.findUnique({
                    where: { email: userA },
                    select: { friends: { where: { email: userB }, select: { email: true } } },
                });
                if (((_b = areFriends === null || areFriends === void 0 ? void 0 : areFriends.friends[0]) === null || _b === void 0 ? void 0 : _b.email) === userB)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "already_friends" });
                /**
                 *  if 'email' is valid and 'user' exists, add the user to 'friends' and add this 'user' to the other 'user' 'friends'
                 */
                const handleUserA = () => {
                    var _a;
                    return db_1.prisma.databaseUser.update({
                        where: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email },
                        data: { friends: { connect: { email: email } } },
                        select: { email: true },
                    });
                };
                const handleUserB = () => {
                    var _a;
                    return db_1.prisma.databaseUser.update({
                        where: { email: email },
                        data: { friends: { connect: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email } } },
                        select: { email: true },
                    });
                };
                Promise.allSettled([handleUserA(), handleUserB()]).then(([resultA, resultB]) => __awaiter(this, void 0, void 0, function* () {
                    var _c;
                    if (resultA.status === "fulfilled")
                        this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "success" });
                    if (resultA.status === "rejected")
                        this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "failed" });
                    if (resultB.status === "fulfilled")
                        //notify userB that he has a new friend !
                        for (const socket of this.io.of("/").sockets)
                            if (((_c = socket[1].data.userInfo) === null || _c === void 0 ? void 0 : _c.email) === email) {
                                this.notify({ socket: socket[1], type: "New Friend", message: `${userA} added you as a friend.` });
                            }
                }));
            }));
        };
    }
}
class HandleUser extends BaseHelperClass {
    findUsers() {
        this.socket.on("find_users", (email) => __awaiter(this, void 0, void 0, function* () {
            // if 'email' is invalid type automatically respond with false result
            if (typeof email != "string")
                return this.io.to(this.socket.id).emit("respond_find_users", []);
            // find all the possible users and return
            const users = yield db_1.prisma.databaseUser.findMany({
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
        }));
    }
}
