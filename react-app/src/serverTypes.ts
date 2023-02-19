// CLIENT-SIDE
import { Socket } from "socket.io-client";

export type SocketIOUser = { email: string; displayName: string };

// prisma schemes

export type ServerUser = {
    email: string;
    displayName: string;
    profileImageURL: string;
};

export interface Chat {
    id: number;
    chatName: string;
    admin: string;
    createdAt: Date;
}

export type SocketIOInstance = Socket<ServerToClientEvents, ClientToServerEvents> | null;

// After this line copy from 'express-app/types.ts'

export type RespondAddFriendTypes = {
    email: string;
    message: "invalid_email" | "cannot_friend_yourself" | "user_does_not_exist" | "success" | "failed" | "already_friends" | "";
};

export type Notification = { type: "New Friend" | "Group Update" | "Unknown Error"; message: string };

export type NotifyFunctionArgs = Notification & { socket: any };

export interface ServerToClientEvents {
    // only server to client events
    notify: (notification: Notification) => void;
    // respond with list of friends back to the 'socket'
    respond_list_of_friends: (friends: ServerUser[]) => void;
    respond_add_friend: (response: RespondAddFriendTypes) => void;
    respond_find_users: (user: ServerUser[]) => void;
    //
    respond_updated_chat_list: (list: Chat[]) => void;
}
export interface ClientToServerEvents {
    // can be empty if empty will default to own friends
    request_list_of_friends: (email: string | undefined) => void;
    add_friend: (email: string) => void;
    find_users: (email: string) => void;
    create_group: (args: { admin: string; chatName: string; members: string[] }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userInfo: SocketIOUser;
}
