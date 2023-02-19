import { useEffect, useState } from "react";
import { Notification, SocketIOInstance } from "../../serverTypes";

// should notifications include only 'errors'
export function Notification({ socket }: { socket: SocketIOInstance }) {
    const [notifications, setNotifications] = useState([]);
    useEffect((): any => {
        if (!socket) return;

        const handleNotification = (notification: Notification) => {};

        socket?.on("notify", handleNotification);

        return () => {
            socket?.off("notify", handleNotification);
        };
    }, [socket]);
    return <div></div>;
}
