import express from "express";
import { createNewChat, exists, getChat, returnChatList } from "./functions";
import { Server } from "socket.io";
import http from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, SocketIOUser } from "./types";
import { prisma } from "./db";
import { ServerSocketIOFunctions, consoleObject } from "./socket.io-functions";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    path: "/api/socket",
});

io.use(async (socket, next) => {
    const userInfo = socket.handshake.auth as SocketIOUser;
    socket.data.userInfo = userInfo;
    return (await exists(prisma.user, { where: { email: userInfo.email } })) ? next() : socket.disconnect();
});

io.on("connection", (socket) => {
    const { Initializer, HandleGroupInstance, HandleFriendsInstance, HandleUserInstance } = new ServerSocketIOFunctions(io, socket);

    Initializer.initialize();

    HandleFriendsInstance.handleReturningOfListOfFriends();
    HandleFriendsInstance.handleAddingFriends();

    HandleUserInstance.findUsers();

    HandleGroupInstance.CreateAndReturnUpdatedList();
});

//returns chat list
app.post("/api/chats", returnChatList);

//handles chat creation and chat messages etc
app.route("/api/chat").post(createNewChat).get(getChat);

server.listen(PORT, () => console.log("server is running on port: " + PORT));
