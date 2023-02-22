import React, { PropsWithChildren } from "react";
import { Chat, RespondAddFriendTypes, ServerUser } from "./serverTypes";
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

export type FocusableOptions = "sidebar" | "chatbar";

export type SidePanelStateTypes = "new_group" | "new_friend" | "new_group_2" | "";

export interface SidePanelState {
    open: boolean;
    type: SidePanelStateTypes;
}

export interface TopTitleProps extends PropsWithChildren {
    titleType: SidePanelStateTypes;
}

export type ModifiedUser = ServerUser & RespondAddFriendTypes;

export type NewGroupMember = ServerUser & { added: boolean };

export type changeFocusArgs = { focusTo: FocusableOptions; chat: Chat | null };
