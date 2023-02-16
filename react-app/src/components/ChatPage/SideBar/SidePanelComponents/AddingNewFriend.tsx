import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { useAddFriend } from "../../../hooks/useAddFriend";
import { ModifiedUser } from "../../../../types";
import { UserListItem } from "../../Shared/UserListItem";

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
                <UserListItem user={{ displayName, email, profileImageURL }} key={`adding-new-friend-list-item-${email}`}>
                    <FoundUserStatus email={email} message={message} />
                </UserListItem>
            ))}
        </ul>
    );
};
