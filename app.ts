import express from "express";
import { exists } from "./functions";
import { Server } from "socket.io";
import http from "http";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, SocketIOUser } from "./types";
import { prisma } from "./db";
import { ServerSocketIOFunctions, consoleObject } from "./socket.io-functions";
import { DatabaseUser } from "@prisma/client";
import path from "path";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "/react-dist")));

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    path: "/api/socket",
});

app.post("/api/userChecker", async (req, res) => {
    const userInfo: DatabaseUser = req.body;
    const databaseUser = await prisma.databaseUser.findUnique({ where: { email: userInfo.email } });

    try {
        if (!databaseUser) {
            const { displayName, email, profileImageURL } = userInfo;

            /**
             *  Insufficient data was somehow passed
             */

            if (!displayName || !profileImageURL || !email) return res.status(400).send("displayName or profileImageURL is missing.");

            /**
             *   Create the user in the database
             */

            await prisma.databaseUser.create({
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

        if (
            databaseUser.displayName !== userInfo.displayName ||
            databaseUser.email !== userInfo.email ||
            databaseUser.profileImageURL !== userInfo.profileImageURL
        ) {
            await prisma.databaseUser.update({
                where: { email: userInfo.email },
                data: { email: userInfo.email, displayName: userInfo.displayName, profileImageURL: userInfo.profileImageURL },
            });

            return res.status(200).send("User already exists. User was updated. ");
        }

        return res.status(200).send("User already exists.");
    } catch (err) {
        console.log(err);
        res.status(503).send("Database connection is broken.");
    }
});

io.use(async (socket, next) => {
    const userInfo = socket.handshake.auth as SocketIOUser;
    const userExists = await exists(prisma.databaseUser, { where: { email: userInfo.email } });

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

        if (!userExists) return socket.disconnect();

        /**
         *  Add him to SocketIO rooms
         *   - Call database for list of chats he is in
         *   - Socket join them all
         *  Note:
         *   - Don't forget to update this list if the user leaves or the chat because after leaving the chat he might be in the room
         *      - And also its this will be nessesary because if we check each time user writes to a group
         *      - it would be very slow  !
         */

        const result = await prisma.databaseUser.findUnique({
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

        if (!result) return socket.disconnect();

        /**
         *  Filtering down to get only the id
         */

        const chatIdList = result.chat_list.map((chat) => chat.id);

        socket.data.userInfo = userInfo;
        socket.join(chatIdList);
        next();
    } catch (err) {
        /**
         *  There seems to be some kind of caching involved with prisma
         *  When I create a user with a email it throws an error because with that email I created in the past caching even after deleting the user from 'prisma studio'
         *  I think this will not be a problem in the production
         */

        console.log(err);
        socket.disconnect();
    }
});

io.on("connection", (socket) => {
    const { HandleChatsInstance, HandleGroupInstance, HandleFriendsInstance, HandleUserInstance } = new ServerSocketIOFunctions(io, socket);

    HandleChatsInstance.getChat();
    HandleChatsInstance.getChatList();
    HandleChatsInstance.postChat();

    HandleFriendsInstance.handleReturningOfListOfFriends();
    HandleFriendsInstance.handleAddingFriends();

    HandleUserInstance.findUsers();

    HandleGroupInstance.CreateAndReturnUpdatedList();
});

server.listen(PORT, () => console.log("server is running on port: " + PORT));
