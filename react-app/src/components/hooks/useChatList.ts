import { useEffect, useState } from "react";
import { ExtendedChat, SocketIOInstance } from "../../serverTypes";
import { UseChatListType } from "../../types";

export const useChatList = (socket: SocketIOInstance) => {
    const [chatList, setChatList] = useState<ExtendedChat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!socket) return;

        const listener = (list: ExtendedChat[]) => {
            /**
             *  Remove the loading skeleton set the incoming chat list
             */

            setLoading(false);
            setChatList(list);
        };

        socket.emit("chat_list");

        socket.on("respond_chat_list", listener);

        return () => {
            socket.off("respond_chat_list", listener);
        };
    }, [socket]);

    return { chatList, setChatList, loading } satisfies UseChatListType;
};
