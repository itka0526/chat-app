import express from "express";
import { createNewChat, exists, getChat, returnChatList } from "./functions";
import { Server } from "socket.io";
import http from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, SocketIOUser } from "./types";
import { prisma } from "./db";

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
    socket.on("request_list_of_friends", async (email) => {
        // handle for if the user wants list of his friends
        if (!email) {
            const result = await prisma.user.findUnique({
                where: { email: socket.data.userInfo?.email },
                select: { friends: true },
            });
            if (result?.friends) io.to(socket.id).emit("respond_list_of_friends", result?.friends);
        }
        // handle for if the user wants list of someone else's friends
        if (email) {
            const result = await prisma.user.findUnique({
                where: { email: email },
                select: { friends: true },
            });
            if (result?.friends) io.to(socket.id).emit("respond_list_of_friends", result?.friends);
        }
    });
});

//returns chat list
app.post("/api/chats", returnChatList);

//handles chat creation and chat messages etc
app.route("/api/chat").post(createNewChat).get(getChat);

server.listen(PORT, () => console.log("server is running on port: " + PORT));
