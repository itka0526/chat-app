import { PropsWithChildren } from "react";
import { RespondAddFriendTypes, ServerUser } from "./serverTypes";

export interface ChatInfo {
    admin: string;
    chatName: string;
    createdAt: string;
    id: number;
}

export type ChatInfoList = ChatInfo[];

export type FocusableOptions = "sidebar" | "chatbar";

export type SidePanelStateTypes = "new_group" | "new_friend" | "give_new_chat_name" | "";

export interface SidePanelState {
    open: boolean;
    type: SidePanelStateTypes;
}

export interface TopTitleProps extends PropsWithChildren {
    titleType: SidePanelStateTypes;
}

export type ModifiedUser = ServerUser & RespondAddFriendTypes;

export type NewGroupMember = ServerUser & { added: boolean };
