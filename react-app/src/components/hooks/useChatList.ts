import { useEffect, useState } from "react";
import { Chat, SocketIOInstance } from "../../serverTypes";

export const useChatList = (socket: SocketIOInstance) => {
    const [chatList, setChatList] = useState<Chat[]>([]);

    useEffect(() => {
        if (!socket) return;

        const listener = (list: Chat[]) => {
            console.log();
            setChatList(list || []);
        };

        socket.on("respond_updated_chat_list", listener);

        return () => {
            socket.off("respond_updated_chat_list", listener);
        };
    }, [socket]);

    return chatList;
};
