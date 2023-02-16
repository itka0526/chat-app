import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { useListOfFriends } from "../../../hooks/useListOfFriends";

export function NewGroup() {
    const socket = useContext(SocketIOContext);
    const { friends, requestFriendList } = useListOfFriends(socket);

    return (
        <div className="">
            <ul>
                {friends.map((friend) => {
                    return <li>{friend.displayName}</li>;
                })}
            </ul>
        </div>
    );
}
