import { Chat, DatabaseUser, Message } from "@prisma/client";
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

export type MessageNotification = {
    type: "New Message";
    message: { displayName: UIMessage["displayName"]; text: UIMessage["text"] } & Chat;
};

export type DefaultNotification = {
    type: "New Friend" | "Group Update" | "Unknown Error";
    message: string;
};

export type Notification<T> = T extends MessageNotification ? MessageNotification : T extends DefaultNotification ? DefaultNotification : never;

export type MessageLoadingOptions = "initial" | "more";

export interface ServerToClientEvents {
    // only server to client events
    notify: (notification: Notification<any>) => void;
    // respond with list of friends back to the 'socket'
    respond_list_of_friends: (friends: DatabaseUser[]) => void;
    respond_add_friend: (response: RespondAddFriendTypes) => void;
    respond_find_users: (user: DatabaseUser[]) => void;
    respond_chat_list: (list: Chat[]) => void;
    respond_get_chat: (messages: UIMessage[], type: MessageLoadingOptions) => void;
    respond_live_chat: (message: UIMessage) => void;
    respond_get_members: (updatedMembers: DatabaseUser[]) => void;
}
export interface ClientToServerEvents {
    // can be empty if empty will default to own friends
    request_list_of_friends: (email: DatabaseUser["email"] | undefined) => void;
    add_friend: (email: DatabaseUser["email"]) => void;
    find_users: (email: DatabaseUser["email"]) => void;
    create_group: (args: { admin: Chat["admin"]; chatName: Chat["chatName"]; members: DatabaseUser["email"][] }) => void;
    chat_list: () => void;
    get_chat: (chatId: Chat["id"], filter: { skip: number; take: number }, type: MessageLoadingOptions) => void;
    post_chat: (chat: Chat, user: DatabaseUser, message: Message["text"]) => void;
    get_members: (chatId: Chat["id"]) => void;
    kick_member: (email: DatabaseUser["email"], chatId: Chat["id"]) => void;
    delete_group: (chatId: Chat["id"]) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userInfo: SocketIOUser;
}

export type UIMessage = {
    chatId: Chat["id"];
    messageId: Message["id"];
    text: Message["text"];
    messengerEmail: DatabaseUser["email"];
    displayName: DatabaseUser["displayName"];
    profileImageURL: DatabaseUser["profileImageURL"];
};
