import React, { PropsWithChildren } from "react";
import { RespondAddFriendTypes, DatabaseUser, ExtendedChat, Chat } from "./serverTypes";
import { User } from "firebase/auth";

export type PossibleArgs = {
    newGroup?: NewGroupMember[];
    setNewGroup?: React.Dispatch<React.SetStateAction<NewGroupMember[]>>;
    newGroupName?: string;
    setNewGroupName?: React.Dispatch<React.SetStateAction<string>>;
    user?: User;
};

export type SidePanelController = {
    nextWindow: () => void;
    previousWindow: () => void;
    setWindowType: React.Dispatch<React.SetStateAction<SidePanelStateTypes>>;
};

export type useMultiStepReturn = {
    multiStepState: [number, React.Dispatch<React.SetStateAction<number>>];
    previous: () => void;
    next: () => void;
    setCount: React.Dispatch<React.SetStateAction<number>>;
};

export type FocusableOptions = { focusTo: "leftbar" | "chatbar" | "rightbar" };

export type SidePanelStateTypes = "new_group" | "new_friend" | "new_group_2" | "";

export interface SidePanelState {
    open: boolean;
    type: SidePanelStateTypes;
}

export interface TopTitleProps extends PropsWithChildren {
    titleType: SidePanelStateTypes;
}

export type ModifiedUser = DatabaseUser & RespondAddFriendTypes;

export type NewGroupMember = DatabaseUser & { added: boolean };

export type useChat = [currentChat: Chat | null, setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>];

/**
 *  if 1, 2, 3 are all 0% that means first panel is visible
 *  if 1, 2 are -100% and third is not change then that means second panel is visible
 *  if 1, 2, 3 are -200% then third panel is visible
 */

export type PossiblePanelStates = {
    first: "0%" | "-100%" | "-200%";
    second: "0%" | "-100%" | "-200%";
    third: "0%" | "-200%";
};

export type UseChatListType = {
    chatList: ExtendedChat[];
    setChatList: React.Dispatch<React.SetStateAction<ExtendedChat[]>>;
    loading: boolean;
};

export type NecessaryMainPanelProps = UseChatListType;
