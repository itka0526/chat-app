import { ServerUser, SocketIOInstance } from "../../serverTypes";
import { useEffect, useState } from "react";

export const useFindUsers = (socket: SocketIOInstance, input: string) => {
    const [foundUsers, setFoundUsers] = useState<ServerUser[]>([]);

    // send a request once the 'email' changes
    function findUser() {
        socket?.emit("find_users", input);
    }

    // handle incoming response
    useEffect(() => {
        if (!socket) return;

        const handleFoundUsers = (listOfUser: ServerUser[]) => {
            setFoundUsers(listOfUser);
        };

        socket.on("respond_find_users", handleFoundUsers);
        return () => {
            socket.on("respond_find_users", handleFoundUsers);
        };
    }, [socket]);

    useEffect(() => {
        if (input.length >= 4) findUser();
    }, [input]);

    return foundUsers;
};
