import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { GradientDelimiter } from "../../Shared/GradientDelimiter";
import { useAddNewMembers } from "../../../hooks/useAddNewMembers";
import { AddingNewMembers } from "./AddingNewMembers/AddingNewMembers";
import { ManageNewMembers } from "./AddingNewMembers/ManageNewMembers";
import { useListOfFriends } from "../../../hooks/useListOfFriends";
import { PossibleArgs, SidePanelController, SidePanelStateTypes } from "../../../../types";
import { StepControlButton } from "./AddingNewMembers/StepControlButton";
import { useSortNewGroup } from "../../../hooks/useSort";

export function NewGroup({
    newGroup,
    setNewGroup,
    nextWindow,
    previousWindow,
    windowType,
    setWindowType,
}: SidePanelController & {
    newGroup: PossibleArgs["newGroup"] | undefined;
    setNewGroup: PossibleArgs["setNewGroup"] | undefined;
    windowType: SidePanelStateTypes;
}) {
    const socket = useContext(SocketIOContext);
    const { friends } = useListOfFriends(socket);
    const { modify, next } = useAddNewMembers({
        friends,
        newGroup,
        setNewGroup,
        nextWindow,
        previousWindow,
        windowType,
        setWindowType,
    });
    const canGoNext = () => newGroup?.filter((member) => member.added).length !== 0 && next();

    const { filteredData, handleChange, rawInput } = useSortNewGroup(500, newGroup || []);

    return (
        <div className="h-full w-full flex flex-col">
            <ManageNewMembers rawInput={rawInput} handleChange={handleChange} members={filteredData || []} modify={modify} />
            <GradientDelimiter />
            <AddingNewMembers members={filteredData || []} modify={modify} />
            <StepControlButton next={canGoNext} />
        </div>
    );
}
