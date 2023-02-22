import { useEffect, useState } from "react";
import { Chat, SocketIOInstance } from "../../serverTypes";

export const useChatList = (socket: SocketIOInstance) => {
    const [chatList, setChatList] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!socket) return;

        const listener = (list: Chat[]) => {
            setLoading(false);
            setChatList(list);
        };

        socket.emit("chat_list");

        socket.on("respond_chat_list", listener);

        return () => {
            socket.off("respond_chat_list", listener);
        };
    }, [socket]);

    return { chatList, loading };
};
