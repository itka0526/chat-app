import { useEffect } from "react";
import { NewGroupMember, PossibleArgs, SidePanelController, SidePanelState, SidePanelStateTypes } from "../../types";
import { DatabaseUser } from "../../serverTypes";

export function useAddNewMembers({
    friends,
    newGroup,
    setNewGroup,
    nextWindow,
    previousWindow,
    windowType,
    setWindowType,
}: SidePanelController & {
    friends: DatabaseUser[];
    newGroup: PossibleArgs["newGroup"];
    setNewGroup: PossibleArgs["setNewGroup"];
    windowType: SidePanelStateTypes;
}) {
    useEffect(() => {
        setNewGroup && setNewGroup(friends.map((friend) => ({ ...friend, added: false } as NewGroupMember)));
    }, [friends]);

    const modify = (email: string, value: boolean) => {
        setNewGroup &&
            setNewGroup((prev) =>
                prev.map((member) => {
                    if (email === member.email) member.added = value;
                    return member;
                })
            );
    };

    const next = () => {
        if (windowType === "new_group") {
            nextWindow();
            setWindowType("new_group_2");
        }
    };

    return { modify, next };
}
