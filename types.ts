import { User } from "@prisma/client";

export type ErrorTypes =
    | "Email is invalid."
    | "Could not create a new user with this 'email' or return its 'chat list'."
    | "User does not exist."
    | "Invalid ID.";

export type SocketIOUser = { email: string; displayName: string };

export interface ServerToClientEvents {
    respond_list_of_friends: (friends: User[]) => void;
    // noArg: () => void;
    // basicEmit: (arg: string) => void;
    // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    // hello: () => void;
    // can be empty if empty will default to own friends
    request_list_of_friends: (email: string | undefined) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userInfo: SocketIOUser;
}
