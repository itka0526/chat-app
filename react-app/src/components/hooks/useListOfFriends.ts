import { DatabaseUser, SocketIOInstance } from "../../serverTypes";
import { useEffect, useState } from "react";

export const useListOfFriends = (socket: SocketIOInstance) => {
    const [friends, setFriends] = useState<DatabaseUser[]>([]);

    // request friends list
    function requestFriendList(email?: string) {
        socket?.emit("request_list_of_friends", email);
    }

    // update friends list
    useEffect(() => {
        if (!socket) return;

        requestFriendList();

        const UpdateFriendsList = (friends: DatabaseUser[]) => {
            setFriends(friends);
        };

        socket.on("respond_list_of_friends", UpdateFriendsList);
        return () => {
            socket.off("respond_list_of_friends", UpdateFriendsList);
        };
    }, [socket]);

    return { requestFriendList, friends };
};
