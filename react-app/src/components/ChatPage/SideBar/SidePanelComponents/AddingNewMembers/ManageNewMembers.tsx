import { X } from "react-feather";
import { NewGroupMember } from "../../../../../types";

export function ManageNewMembers({ members, modify }: { members: NewGroupMember[]; modify: (email: string, value: boolean) => void }) {
    return (
        <div className="flex flex-wrap px-4 bg-white gap-1 my-[-1px] ">
            {members.map(
                (member) => member.added === true && <ManageNewMember modify={modify} member={member} key={`manage-member-item-${member.email}`} />
            )}
            <div className="min-w-[200px] grow pt-1 pb-2 h-11">
                <input placeholder="Add friends..." className=" focus:outline-none w-full h-full px-2"></input>
            </div>
        </div>
    );
}

const ManageNewMember = ({ member, modify }: { member: NewGroupMember; modify: (email: string, value: boolean) => void }) => {
    const handleClick = () => modify(member.email, false);
    return (
        <div
            className="custom-reddening-effect select-none h-8 flex bg-[var(--custom-grey)] rounded-full items-center cursor-pointer"
            onClick={handleClick}
        >
            <div
                className="
                    w-8 h-8 overflow-hidden
                    flex justify-center items-center rounded-full
                    relative
                    "
            >
                <div
                    className="
                    show-x-button absolute bg-red-400 h-full w-full
                    flex opacity-0
                    transition-opacity justify-center items-center
                    "
                >
                    <X color="white" />
                </div>
                <img className="shrink-0 min-w-full min-h-full" src={member.profileImageURL} />
            </div>
            <span className="ml-2 mr-4 font-medium">{member.displayName}</span>
        </div>
    );
};
