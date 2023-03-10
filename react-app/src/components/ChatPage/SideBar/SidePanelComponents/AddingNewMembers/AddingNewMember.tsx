import { NewGroupMember } from "../../../../../types";
import { CheckBox } from "../../../Shared/CheckBox";
import { UserListItem } from "../../../Shared/UserListItem";

export function AddingNewMember({ member, modify }: { member: NewGroupMember; modify: (email: string, value: boolean) => void }) {
    const handleClick = () => modify(member.email, !member.added);

    return (
        <div className="flex items-center hover:bg-gray-100 rounded-md px-2 cursor-pointer transition-colors" onClick={handleClick}>
            <CheckBox checked={member.added} />
            <UserListItem user={member} hoverEffect={false} />
        </div>
    );
}
