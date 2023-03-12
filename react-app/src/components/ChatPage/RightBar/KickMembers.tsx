import { useContext } from "react";
import { SocketIOContext } from "../Chat";
import { Chat, DatabaseUser } from "../../../serverTypes";

export function KickMembers({ members, currentChat }: { members: DatabaseUser[]; currentChat: Chat }) {
    const socket = useContext(SocketIOContext);

    const handleKickMember = function (email: string) {
        socket?.emit("kick_member", email, currentChat.id);
    };

    return (
        <div className="w-full pt-2">
            <span className="font-medium pl-2 ">Members</span>
            <ul className="pt-2">
                {members.map((member) => (
                    <KickMember
                        isAdmin={member.email === currentChat.admin}
                        user={member}
                        handleKickMember={handleKickMember}
                        key={`kick-user-${member.email}`}
                    />
                ))}
            </ul>
        </div>
    );
}

function KickMember({
    isAdmin,
    user: { displayName, email, profileImageURL },
    handleKickMember,
}: {
    isAdmin: boolean;
    user: DatabaseUser;
    handleKickMember: (email: string) => void;
}) {
    return (
        <li className="w-full h-14 grid grid-cols-[75%,25%] md:grid-cols-[100%,25%] cursor-pointer show-kick-member-button overflow-hidden">
            <div className="h-full w-full flex items-center transition-transform duration-300">
                <img draggable={false} src={profileImageURL} className="rounded-full h-11 w-11 ml-2 mr-3" />
                <div className="flex flex-col whitespace-nowrap text-ellipsis overflow-hidden">
                    <span className="font-medium">{`${displayName} ${isAdmin ? " (Admin)" : ""}`}</span>
                    <span className="opacity-95 text-sm pl-2">{email}</span>
                </div>
            </div>
            <div className="flex justify-center items-center h-full w-full transition-transform duration-300">
                <div
                    onClick={() => handleKickMember(email)}
                    className="bg-red-400 px-4 max-md:py-1 md:py-2 max-md:rounded-md md:h-full md:w-full flex justify-center items-center hover:brightness-95 transition-[filter]"
                >
                    <span className="text-white">Kick</span>
                </div>
            </div>
        </li>
    );
}
