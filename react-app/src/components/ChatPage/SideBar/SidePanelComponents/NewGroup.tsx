import { useContext, useState } from "react";
import { SocketIOContext } from "../../Chat";
import { GradientDelimiter } from "../../Shared/GradientDelimiter";
import { useAddNewMembers } from "../../../hooks/useAddNewMembers";
import { AddingNewMembers } from "./AddingNewMembers/AddingNewMembers";
import { ManageNewMembers } from "./AddingNewMembers/ManageNewMembers";
import { useListOfFriends } from "../../../hooks/useListOfFriends";
import { SidePanelState } from "../../../../types";
import { StepControlButton } from "./AddingNewMembers/StepControlButton";

export function NewGroup({
    setSecondSidePanel,
    chatName,
}: {
    setSecondSidePanel: React.Dispatch<React.SetStateAction<SidePanelState>>;
    chatName: string;
}) {
    const socket = useContext(SocketIOContext);
    const { friends } = useListOfFriends(socket);

    const { members, modify, next } = useAddNewMembers({ friends, chatName, handleStep: setSecondSidePanel });

    return (
        <div className="h-full w-full flex flex-col">
            <ManageNewMembers members={members} modify={modify} />
            <GradientDelimiter />
            <AddingNewMembers members={members} modify={modify} />
            <StepControlButton next={next} />
        </div>
    );
}
