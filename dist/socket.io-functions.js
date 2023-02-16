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
exports.ServerSocketIOFunctions = void 0;
const db_1 = require("./db");
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
        this.HandleFriendsInstance = new HandleFriends(this.io, this.socket);
        this.HandleUserInstance = new HandleUser(this.io, this.socket);
    }
}
exports.ServerSocketIOFunctions = ServerSocketIOFunctions;
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
                var _a, _b, _c, _d, _e, _f, _g;
                // if 'email' is invalid automatically respond with false result
                if (typeof email != "string" || !email.includes("@"))
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "invalid_email" });
                // if the 'email' is valid but the email is same as the requester's email [cannot friend yourself]
                if (email === ((_a = this.socket.data.userInfo) === null || _a === void 0 ? void 0 : _a.email))
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "cannot_friend_yourself" });
                const requestedToThisUser = yield db_1.prisma.user.findUnique({ where: { email } });
                // if 'email' is valid but the user does not exist then return false
                if (!requestedToThisUser)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "user_does_not_exist" });
                // if the users are already friends
                const areFriends = yield db_1.prisma.user.findUnique({
                    where: { email: (_b = this.socket.data.userInfo) === null || _b === void 0 ? void 0 : _b.email },
                    select: { friends: { where: { email: email }, select: { email: true } } },
                });
                if (((_c = areFriends === null || areFriends === void 0 ? void 0 : areFriends.friends[0]) === null || _c === void 0 ? void 0 : _c.email) === email)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "already_friends" });
                /**
                 * if 'email' is valid and 'user' exists, add the user to 'friends' and add this 'user' to the other 'user' 'friends'
                 */
                // update the original user's friends list
                const original = yield db_1.prisma.user.update({
                    where: {
                        email: (_d = this.socket.data.userInfo) === null || _d === void 0 ? void 0 : _d.email,
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
                //update the other user's friends list
                const otherUser = yield db_1.prisma.user.update({
                    where: {
                        email: requestedToThisUser.email,
                    },
                    data: {
                        friends: {
                            connect: {
                                email: (_e = this.socket.data.userInfo) === null || _e === void 0 ? void 0 : _e.email,
                            },
                        },
                    },
                    select: {
                        email: true,
                    },
                });
                // notify the other user
                for (const socket of this.io.of("/").sockets) {
                    if (((_f = socket[1].data.userInfo) === null || _f === void 0 ? void 0 : _f.email) === otherUser.email) {
                        this.notify({ socket: socket[1], type: "New Friend", message: `${original.email} added you as a friend.` });
                        break;
                    }
                }
                // successfully friended both
                if (original.email === ((_g = this.socket.data.userInfo) === null || _g === void 0 ? void 0 : _g.email) && otherUser.email === email)
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "success" });
                // else some unknown exception happened along the way
                else
                    return this.io.to(this.socket.id).emit("respond_add_friend", { email: email, message: "failed" });
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
