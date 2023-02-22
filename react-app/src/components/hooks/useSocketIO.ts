import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketIOInstance } from "../../serverTypes";
import { User, signOut } from "firebase/auth";
import { firebaseAppAuth } from "../../firebase";

export function useSocketIO(userInfo: User) {
    const [socket, setSocket] = useState<SocketIOInstance>(null);

    const auth = {
        email: userInfo?.email,
        displayName: userInfo?.displayName,
        profileImageURL: userInfo?.photoURL,
    };

    const checkUser = async () => {
        const pending_response = await fetch("/api/userChecker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(auth),
        });

        return pending_response.status === 200;
    };

    async function connectSocket() {
        const userExists = await checkUser();
        return userExists ? setSocket(io("/", { path: "/api/socket", auth })) : signOut(firebaseAppAuth);
    }

    useEffect(() => {
        connectSocket();

        return () => {
            socket?.disconnect();
        };
    }, []);

    return socket as SocketIOInstance;
}
