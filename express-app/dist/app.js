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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: "/api/socket",
});
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = socket.handshake.auth;
    socket.data.userInfo = userInfo;
    return (yield (0, functions_1.exists)(db_1.prisma.user, { where: { email: userInfo.email } })) ? next() : socket.disconnect();
}));
io.on("connection", (socket) => {
    const { HandleFriendsInstance, HandleUserInstance } = new socket_io_functions_1.ServerSocketIOFunctions(io, socket);
    HandleFriendsInstance.handleReturningOfListOfFriends();
    HandleFriendsInstance.handleAddingFriends();
    HandleUserInstance.findUsers();
});
//returns chat list
app.post("/api/chats", functions_1.returnChatList);
//handles chat creation and chat messages etc
app.route("/api/chat").post(functions_1.createNewChat).get(functions_1.getChat);
server.listen(PORT, () => console.log("server is running on port: " + PORT));