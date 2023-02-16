import { useEffect, useState } from "react";
import { Notification, SocketIOInstance } from "../../serverTypes";

export function Notification({ socket }: { socket: SocketIOInstance }) {
    const [notifications, setNotifications] = useState([]);
    useEffect((): any => {
        if (!socket) return;

        const handleNotification = (notification: Notification) => {};

        socket?.on("notify", handleNotification);

        return () => socket?.on("notify", handleNotification);
    }, [socket]);
    return <div></div>;
}
