import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { useAddFriend } from "../../../hooks/useAddFriend";
import { ModifiedUser } from "../../../../types";

export const AddingNewFriend = ({ input }: { input: string }) => {
    const socket = useContext(SocketIOContext);
    const { addFriend, modifiedUsers } = useAddFriend(socket, input);

    const FoundUserStatus = ({ email, message }: Partial<ModifiedUser>) => {
        const text =
            message === "invalid_email"
                ? "Invalid"
                : message === "cannot_friend_yourself"
                ? "You"
                : message === "user_does_not_exist"
                ? "Not found"
                : message === "already_friends"
                ? "Already friends"
                : message === "failed"
                ? "Failed"
                : message === "success"
                ? "Added"
                : "Add friend";

        return (
            <button
                disabled={message !== ""}
                onClick={() => email && addFriend(email)}
                className={`
                            px-3 py-1 ${message === "" ? "bg-blue-600" : message === "success" ? "bg-green-600" : "bg-red-400"}
                            ${message !== "" ? "brightness-90" : "hover:brightness-110"} transition-[filter]
                            rounded-md shadow-md
                            `}
            >
                <span className="text-white text-sm text-ellipsis whitespace-nowrap">{text}</span>
            </button>
        );
    };

    return (
        <ul className="w-full h-full p-2">
            {modifiedUsers.map(({ displayName, email, profileImageURL, message }) => (
                <li key={`list-item-${email}`} className="flex items-center h-14 w-full rounded-md hover:bg-slate-100 cursor-pointer select-none">
                    <img draggable={false} src={profileImageURL} className="rounded-full h-11 w-11 ml-2 mr-3" />
                    <div className="flex flex-col whitespace-nowrap text-ellipsis overflow-hidden">
                        <span className="font-medium">{displayName}</span>
                        <span className="opacity-95 text-sm pl-2">{email}</span>
                    </div>
                    <div className="grow flex justify-end pr-2 ">
                        <FoundUserStatus email={email} message={message} />
                    </div>
                </li>
            ))}
        </ul>
    );
};
