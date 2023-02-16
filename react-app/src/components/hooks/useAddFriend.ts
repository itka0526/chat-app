import { useEffect, useState } from "react";
import { RespondAddFriendTypes, SocketIOInstance } from "../../serverTypes";
import { useFindUsers } from "./useFindUsers";
import { ModifiedUser } from "../../types";

export const useAddFriend = (socket: SocketIOInstance, input: string) => {
    const users = useFindUsers(socket, input);

    const [modifiedUsers, setModifiedUsers] = useState<ModifiedUser[]>([]);

    /**
     *  just updating copying found users data to modified user data
     *  'ServerUser' -> 'ModifiedUser' had to add 'message' key
     * */

    useEffect(() => {
        const modifiedUsers = users.map((user) => {
            const possibleUser: any = user;
            if (possibleUser?.message) {
                return possibleUser as ModifiedUser;
            }
            return { ...possibleUser, message: "" } as ModifiedUser;
        });
        setModifiedUsers(modifiedUsers);
    }, [users]);

    const addFriend = function (email: string) {
        socket?.emit("add_friend", email);
    };

    // handle incoming response from the server
    const handleReponse = function ({ email, message }: RespondAddFriendTypes) {
        setModifiedUsers((list) => {
            return list.map((modifiedUser) => {
                if (modifiedUser.email === email) {
                    modifiedUser.message = message;
                }
                return modifiedUser;
            });
        });
    };

    // listener
    useEffect(() => {
        if (!socket) return;

        socket.on("respond_add_friend", handleReponse);
        return () => {
            socket.off("respond_add_friend", handleReponse);
        };
    }, [socket]);

    return { addFriend, modifiedUsers };
};
