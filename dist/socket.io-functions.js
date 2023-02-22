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
const consoleObject = (args) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, promises_1.writeFile)("../results.json", JSON.stringify([...args], null, 2)); });
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
            var _a;
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
            const result = yield db_1.prisma.user.findUnique({
                select: {
                    chat_list: true,
                },
                where: {
                    email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email,
                },
            });
            if (!result || !result.chat_list)
                return this.io.to(this.socket.id).emit("notify", { type: "Unknown Error", message: "Unable to find chat list." });
            this.io.to(this.socket.id).emit("respond_chat_list", result.chat_list);
        }));
    }
}
class HandleChats extends BaseHelperClass {
    getChatList() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on("chat_list", () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const result = yield db_1.prisma.user.findUnique({
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
    getChat() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on("chat", () => __awaiter(this, void 0, void 0, function* () {
                // check if the user actually is in the group after that return the chat hmmm maybe its a good idea to keep user in the iniitialization phase add user to rooms so i we dont have too call db for checking
                // if chat list changes update it on socket too
            }));
        });
    }
}
class HandleFriends extends BaseHelperClass {
    constructor() {
        super(...arguments);
        this.handleReturningOfListOfFriends = () => this.socket.on("request_list_of_friends", (email) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // handle for if the user wants list of his friends
            if (!email) {
                const result = yield db_1.prisma.user.findUnique({
                    where: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email },
                    select: { friends: true },
                });
                if (result === null || result === void 0 ? void 0 : result.friends)
                    return this.io.to(this.socket.id).emit("respond_list_of_friends", result === null || result === void 0 ? void 0 : result.friends);
            }
            // handle for if the user wants list of someone else's friends
            if (email) {
                const result = yield db_1.prisma.user.findUnique({
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
                
     * if the 'email' is valid but the email is same as the requester's email [cannot friend yourself]
     *  */
                if (userA === userB)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "cannot_friend_yourself" });
                const requestedUserExists = yield (0, functions_1.exists)(db_1.prisma.user, { where: { email: userB } });
                /**
                 * if 'email' is valid but the user does not exist then return false
                 */
                if (!requestedUserExists)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "user_does_not_exist" });
                /**
                 * if the users are already friends
                 */
                const areFriends = yield db_1.prisma.user.findUnique({
                    where: { email: userA },
                    select: { friends: { where: { email: userB }, select: { email: true } } },
                });
                if (((_b = areFriends === null || areFriends === void 0 ? void 0 : areFriends.friends[0]) === null || _b === void 0 ? void 0 : _b.email) === userB)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: userB, message: "already_friends" });
                /**
                 * if 'email' is valid and 'user' exists, add the user to 'friends' and add this 'user' to the other 'user' 'friends'
                 */
                const handleUserA = () => {
                    var _a;
                    return db_1.prisma.user.update({
                        where: { email: (_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email },
                        data: { friends: { connect: { email: email } } },
                        select: { email: true },
                    });
                };
                const handleUserB = () => {
                    var _a;
                    return db_1.prisma.user.update({
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
                                break;
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
            const users = yield db_1.prisma.user.findMany({
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
