import { NewGroupMember } from "../../../../../types";
import { CheckBox } from "../../../Shared/CheckBox";
import { UserListItem } from "../../../Shared/UserListItem";

export function AddingNewMember({ member, modify }: { member: NewGroupMember; modify: (email: string, value: boolean) => void }) {
    const handleClick = () => modify(member.email, !member.added);

    return (
        <div className="flex items-center hover:bg-slate-100 rounded-md px-2 cursor-pointer" onClick={handleClick}>
            <CheckBox checked={member.added} />
            <UserListItem user={member} hoverEffect={false} />
        </div>
    );
}
