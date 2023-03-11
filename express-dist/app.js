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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functions_1 = require("./functions");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const db_1 = require("./db");
const socket_io_functions_1 = require("./socket.io-functions");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(process.cwd(), "/react-dist")));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: "/api/socket",
});
app.post("/api/userChecker", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req.body;
    const databaseUser = yield db_1.prisma.databaseUser.findUnique({ where: { email: userInfo.email } });
    try {
        if (!databaseUser) {
            const { displayName, email, profileImageURL } = userInfo;
            /**
             *  Insufficient data was somehow passed
             */
            if (!displayName || !profileImageURL || !email)
                return res.status(400).send("displayName or profileImageURL is missing.");
            /**
             *   Create the user in the database
             */
            yield db_1.prisma.databaseUser.create({
                data: {
                    email: email,
                    displayName: displayName,
                    profileImageURL: profileImageURL,
                },
                select: null,
            });
            return res.status(200).send("User successfully created.");
        }
        /**
         *  Updating user info, in case, user updated his google account or something.
         */
        if (databaseUser.displayName !== userInfo.displayName ||
            databaseUser.email !== userInfo.email ||
            databaseUser.profileImageURL !== userInfo.profileImageURL) {
            yield db_1.prisma.databaseUser.update({
                where: { email: userInfo.email },
                data: { email: userInfo.email, displayName: userInfo.displayName, profileImageURL: userInfo.profileImageURL },
            });
            return res.status(200).send("User already exists. User was updated. ");
        }
        return res.status(200).send("User already exists.");
    }
    catch (err) {
        console.log(err);
        res.status(503).send("Database connection is broken.");
    }
}));
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = socket.handshake.auth;
    const userExists = yield (0, functions_1.exists)(db_1.prisma.databaseUser, { where: { email: userInfo.email } });
    /**
     *  Interesting, react app is sending 2 requests and prisma is failing one of the requests
     *  because of unique key constraint if failing maybe creation of user should be handled in the
     *  express app API, hmmm, I hope this won't be a problem. Cannot figure it out.
     */
    try {
        /**
         *  Must do's
         *      - socket must join 'rooms'
         *      - socket must have userInfo
         *      - must call next() or disconnect()
         */
        /**
         *  If user does not exist that means express API somehow failed to create the user, therefore connection should be declined.
         */
        if (!userExists)
            return socket.disconnect();
        /**
         *  Add him to SocketIO rooms
         *   - Call database for list of chats he is in
         *   - Socket join them all
         *  Note:
         *   - Don't forget to update this list if the user leaves or the chat because after leaving the chat he might be in the room
         *      - And also its this will be nessesary because if we check each time user writes to a group
         *      - it would be very slow  !
         */
        const result = yield db_1.prisma.databaseUser.findUnique({
            select: {
                chat_list: {
                    select: {
                        id: true,
                    },
                },
            },
            where: {
                email: userInfo.email,
            },
        });
        /**
         *  if database returned nothing there must be something wrong with user
         *  it should always return User
         */
        if (!result)
            return socket.disconnect();
        /**
         *  Filtering down to get only the id
         */
        const chatIdList = result.chat_list.map((chat) => chat.id);
        socket.data.userInfo = userInfo;
        socket.join(chatIdList);
        next();
    }
    catch (err) {
        /**
         *  There seems to be some kind of caching involved with prisma
         *  When I create a user with a email it throws an error because with that email I created in the past caching even after deleting the user from 'prisma studio'
         *  I think this will not be a problem in the production
         */
        console.log(err);
        socket.disconnect();
    }
}));
io.on("connection", (socket) => {
    const { HandleChatsInstance, HandleGroupInstance, HandleFriendsInstance, HandleUserInstance } = new socket_io_functions_1.ServerSocketIOFunctions(io, socket);
    try {
        HandleChatsInstance.getChat();
        HandleChatsInstance.getChatList();
        HandleChatsInstance.postChat();
        HandleFriendsInstance.handleReturningOfListOfFriends();
        HandleFriendsInstance.handleAddingFriends();
        HandleUserInstance.findUsers();
        HandleGroupInstance.CreateAndReturnUpdatedList();
        HandleGroupInstance.HandleReturnMembers();
        HandleGroupInstance.HandleKickMember();
        HandleGroupInstance.HandleDeleteGroup();
    }
    catch (err) {
        console.error(err);
    }
});
server.listen(PORT, () => console.log("server is running on port: " + PORT));
