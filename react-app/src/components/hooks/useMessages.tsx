import { useEffect, useState } from "react";
import { Chat, SocketIOInstance, UIMessage } from "../../serverTypes";
import { User } from "firebase/auth";

export function useMessages({ socket, currentChat, user }: { socket: SocketIOInstance; currentChat: Chat | null; user: User }) {
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if (!currentChat?.id) return;

        if (!user.email) {
            socket?.disconnect();
            return;
        }

        socket?.emit(
            "post_chat",
            currentChat?.id,
            { displayName: user.displayName || "anonymous", email: user.email, profileImageURL: user.photoURL || "" },
            input
        );

        setInput("");
    };

    // request chat
    useEffect(() => {
        if (!currentChat?.id || !currentChat) return;

        socket?.emit("get_chat", currentChat.id);
    }, [currentChat]);

    // get full chat
    useEffect(() => {
        const listenerFull = (messages: UIMessage[]) => {
            setMessages(messages);
        };

        const listenerLive = (message: UIMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket?.on("respond_get_chat", listenerFull);
        socket?.on("respond_live_chat", listenerLive);

        return () => {
            socket?.off("respond_get_chat", listenerFull);
            socket?.off("respond_live_chat", listenerLive);
        };
    }, [currentChat]);

    return { input, setInput, messages, handleSubmit };
}
