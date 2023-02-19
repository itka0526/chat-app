import { NewGroupMember } from "../../../../../types";
import { AddingNewMember } from "./AddingNewMember";

export function AddingNewMembers({ members, modify }: { members: NewGroupMember[]; modify: (email: string, value: boolean) => void }) {
    return (
        <div className="bg-white overflow-y-auto h-full">
            <ul className="w-full h-full p-2  ">
                {members.map((member, idx) => (
                    <AddingNewMember member={member} key={`new-member-${member.email}-${idx}`} modify={modify} />
                ))}
            </ul>
        </div>
    );
}
