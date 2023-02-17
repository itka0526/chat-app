import { useEffect, useRef, useState } from "react";
import { NewGroupMember } from "../../../../../types";
import { UserListItem } from "../../../Shared/UserListItem";
import { StepControlButton } from "./StepControlButton";

export function AddingChatName({
    setChatName,
    closeSecondSidePanel,
}: {
    setChatName: React.Dispatch<React.SetStateAction<string>>;
    closeSecondSidePanel: () => void;
}) {
    const [members, setMembers] = useState<NewGroupMember[]>([]);

    useEffect(() => {
        // i am a bad developer

        const handleUpdate = () => {
            const stringJson = localStorage.getItem("members") || "[]";
            localStorage.removeItem("members");
            const parsedJson: NewGroupMember[] = JSON.parse(stringJson);
            setMembers(parsedJson);
        };

        window.addEventListener("members-updated-event", handleUpdate);

        return () => {
            window.removeEventListener("members-updated-event", handleUpdate);
        };
    }, []);

    return (
        <div className="bg-white min-h-full w-full flex flex-col p-2">
            <div className="mt-2 w-full h-14 border rounded-md overflow-hidden bg-[var(--custom-grey)]">
                <input
                    placeholder="Group Name"
                    className="focus:outline-none w-full h-full px-2 text-lg"
                    onChange={(e) => setChatName(e.target.value)}
                />
            </div>
            <div className="bg-white grow">
                <div className="mt-2 mb-1 px-1 select-none">
                    <span className="text-blue-600">{members.length} member</span>
                </div>
                <ul className="w-full h-full pb-2">
                    {members.map((member, idx) => (
                        <UserListItem key={`listed-member-${member.email}-${idx}`} user={member} />
                    ))}
                </ul>
            </div>
            <StepControlButton next={closeSecondSidePanel} />
        </div>
    );
}
