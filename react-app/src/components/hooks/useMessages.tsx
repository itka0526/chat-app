import { useEffect, useState } from "react";
import { Chat, MessageLoadingOptions, SocketIOInstance, UIMessage } from "../../serverTypes";
import { User } from "firebase/auth";
import { UseChatListType } from "../../types";

type useMessagesProps = { socket: SocketIOInstance; currentChat: Chat | null; user: User; updatePreviewMessages: UseChatListType["setChatList"] };

export function useMessages({ socket, currentChat, user, updatePreviewMessages }: useMessagesProps) {
    const [messages, setMessages] = useState<UIMessage[]>([]);

    const [keepState, setKeepState] = useState({ skip: 0, take: 25 });

    const [limitReached, setLimitReached] = useState(false);

    /**
     *  Request 50 more messages
     */

    const loadMore = () => {
        if (!currentChat?.id || !currentChat) return;

        socket?.emit("get_chat", currentChat?.id, { skip: keepState.take, take: keepState.take + 50 }, "more");
        setKeepState({ skip: keepState.take, take: keepState.take + 50 });
    };

    /**
     *  Request initial 25 messages
     *  Handle cleanup
     */

    useEffect(() => {
        if (!currentChat?.id || !currentChat) return;

        const initial = { skip: 0, take: 25 };

        setKeepState(initial);
        setLimitReached(false);
        setMessages([]);

        socket?.emit("get_chat", currentChat.id, initial, "initial");
    }, [currentChat]);

    /**
     *  Handle server responses
     */

    useEffect(() => {
        const listenerFull = (messages: UIMessage[], type: MessageLoadingOptions) => {
            if (type === "initial") {
                if (messages.length < 25) {
                    /**
                     *  If server responded with less 25 messages that means the chat is new
                     *  and does not require 'loadMore' functionality
                     */
                    setLimitReached(true);
                }
                setMessages(messages);
            }
            if (type === "more") {
                /**
                 *  If server responds with empty array then that means there is no more old chat,
                 *  therefore, I should block user from clicking 'loadMore'
                 */

                if (messages.length === 0) {
                    return setLimitReached(true);
                }

                setMessages((previousMessages) => [...previousMessages, ...messages]);
            }
        };

        const listenerLive = (message: UIMessage) => {
            /**
             *  Could update chat list's quick preview message
             */

            updatePreviewMessages((prev) => {
                const chatListWithUpdatedPreview = prev.map((chat) => {
                    if (chat.id === message.chatId) {
                        chat.messages[0] = { createdAt: message.createdAt, messenger: { displayName: message.displayName }, text: message.text };
                    }
                    return chat;
                });
                return chatListWithUpdatedPreview;
            });

            /**
             *  if the incoming real-time message chat id does not match with active chat's id just return
             *  because this will cause an UI issue
             */

            if (message.chatId !== currentChat?.id) return;
            setMessages((prevMessages) => [message, ...prevMessages]);
        };

        socket?.on("respond_get_chat", listenerFull);
        socket?.on("respond_live_chat", listenerLive);

        return () => {
            socket?.off("respond_get_chat", listenerFull);
            socket?.off("respond_live_chat", listenerLive);
        };
    }, [currentChat]);

    return { messages, loadMore, limitReached };
}
