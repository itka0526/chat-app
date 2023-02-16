import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { useListOfFriends } from "../../../hooks/useListOfFriends";
import { UserListItem } from "../../Shared/UserListItem";

export function NewGroup() {
    const socket = useContext(SocketIOContext);
    const { friends } = useListOfFriends(socket);

    return (
        <div className="">
            <ul>
                {friends.map((friend) => (
                    <UserListItem user={friend} />
                ))}
            </ul>
        </div>
    );
}
