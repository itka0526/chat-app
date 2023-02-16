import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketIOInstance } from "../../serverTypes";
import { User } from "firebase/auth";

export function useSocketIO(userInfo: User) {
    const [socket, setSocket] = useState<SocketIOInstance>(null);

    useEffect(() => {
        (async function () {
            const ws = io("/", {
                path: "/api/socket",
                auth: {
                    email: userInfo?.email,
                    displayName: userInfo?.displayName,
                },
            });
            setSocket(ws);
        })();
    }, []);

    return socket as SocketIOInstance;
}
