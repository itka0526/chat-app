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
exports.handleFailedResponse = exports.exists = exports.getChat = exports.createNewChat = exports.returnChatList = void 0;
const db_1 = require("./db");
/**
 * This function also handles creation of new a "user"
 *
 */
const returnChatList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, displayName } = req.body;
    /**
     * If there is a user with this 'email' then return user's 'chat_list'
     *
     */
    const chatList = yield db_1.prisma.user.findUnique({
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
        const newChatList = yield db_1.prisma.user.create({
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
    return (0, exports.handleFailedResponse)(res, "Could not create a new user with this 'email' or return its 'chat list'.");
});
exports.returnChatList = returnChatList;
const createNewChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, chatName } = req.body;
    /**
     * Handle exception when email might be invalid
     *
     */
    if (typeof email != "string" || !email.includes("@"))
        return (0, exports.handleFailedResponse)(res, "Email is invalid.");
    /**
     * Handle exception when email does not exist
     *
     */
    if (!(yield (0, exports.exists)(db_1.prisma.user, { where: { email: email } })))
        return (0, exports.handleFailedResponse)(res, "User does not exist.");
    /**
     * Handle the creation of a new 'chat' and
     * entering the 'user' into the 'chat' as an'admin' and as a 'member'
     *
     */
    return res.json(yield db_1.prisma.chat.create({
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
    }));
});
exports.createNewChat = createNewChat;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id)
        return (0, exports.handleFailedResponse)(res, "Invalid ID.");
    return res.json(yield db_1.prisma.chat.findUnique({
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
    }));
});
exports.getChat = getChat;
const exists = (model, args) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield model.count(args);
    return Boolean(count);
});
exports.exists = exists;
const handleFailedResponse = (res, err) => res.status(500).json({ message: "Sorry, something went wrong with the server :/ ", error: err });
exports.handleFailedResponse = handleFailedResponse;
