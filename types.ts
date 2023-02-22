import { Chat, User } from "@prisma/client";
import { Socket } from "socket.io";

export type ErrorTypes =
    | "Email is invalid."
    | "Could not create a new user with this 'email' or return its 'chat list'."
    | "User does not exist."
    | "Invalid ID.";

export type SocketIOUser = { email: string; displayName: string; profileImageURL: string };

// after this line copy and paste to 'react-app/src/serverTypes.ts'

export type RespondAddFriendTypes = {
    email: string;
    message: "invalid_email" | "cannot_friend_yourself" | "user_does_not_exist" | "success" | "failed" | "already_friends" | "";
};

export type Notification = { type: "New Friend" | "Group Update" | "Unknown Error"; message: string };

export type NotifyFunctionArgs = Notification & { socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> };

export interface ServerToClientEvents {
    // only server to client events
    notify: (notification: Notification) => void;
    // respond with list of friends back to the 'socket'
    respond_list_of_friends: (friends: User[]) => void;
    respond_add_friend: (response: RespondAddFriendTypes) => void;
    respond_find_users: (user: User[]) => void;
    respond_chat_list: (list: Chat[]) => void;
}
export interface ClientToServerEvents {
    // can be empty if empty will default to own friends
    request_list_of_friends: (email: User["email"] | undefined) => void;
    add_friend: (email: User["email"]) => void;
    find_users: (email: User["email"]) => void;
    create_group: (args: { admin: Chat["admin"]; chatName: Chat["chatName"]; members: User["email"][] }) => void;
    chat_list: () => void;
    chat: () => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userInfo: SocketIOUser;
}
