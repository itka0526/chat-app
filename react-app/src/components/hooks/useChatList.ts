import { useEffect, useState } from "react";
import { ChatInfoList } from "../../types";
import { User } from "firebase/auth";

export const useChatList = (user: User | null | undefined) => {
    const [chatList, setChatList] = useState<ChatInfoList>([]);

    useEffect(() => {
        if (!user) return;

        const callServer = async () => {
            if (!user.email) return;

            const pending_response = await fetch("/api/chats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                    profileImageURL: user.photoURL,
                }),
            });

            const { chat_list }: { chat_list: [] } = await pending_response.json();
            setChatList(chat_list);
        };

        callServer();
    }, [user]);

    return chatList;
};
