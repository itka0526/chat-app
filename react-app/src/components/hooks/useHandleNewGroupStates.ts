import { useState } from "react";
import { NewGroupMember } from "../../types";

export function useHandleNewGroupStates() {
    const [newGroup, setNewGroup] = useState<NewGroupMember[]>([]);
    const [newGroupName, setNewGroupName] = useState("");

    return { newGroup, setNewGroup, newGroupName, setNewGroupName };
}
