import { NewGroupMember } from "../../../../../types";
import { AddingNewMember } from "./AddingNewMember";

export function AddingNewMembers({ members, modify }: { members: NewGroupMember[]; modify: (email: string, value: boolean) => void }) {
    return (
        <div className="bg-white grow">
            <ul className="w-full h-full p-2">
                {members.map((member) => (
                    <AddingNewMember member={member} key={`new-member-${member.email}`} modify={modify} />
                ))}
            </ul>
        </div>
    );
}
