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

export type SidePanelStateTypes = "new_group" | "new_friend" | "";

export interface SidePanelState {
    open: boolean;
    type: SidePanelStateTypes;
}

export interface SidePanelTopTitleProps extends PropsWithChildren {
    titleType: SidePanelStateTypes;
}

export type ModifiedUser = ServerUser & RespondAddFriendTypes;
