import { useEffect, useRef, useState } from "react";
import { Chat, DefaultNotification, ExtendedChat, MessageNotification, Notification, SocketIOInstance } from "../../serverTypes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FocusableOptions, useChat } from "../../types";
import { Mail } from "react-feather";

type NotificationProps = { socket: SocketIOInstance; useChat: useChat; changeFocus: ({ focusTo }: FocusableOptions) => void };

export function Notification({ socket, useChat: [currentChat, setCurrentChat], changeFocus }: NotificationProps) {
    /**
     *  Using useRef to fetch the updated value for handleNotification
     */
    const currentChatRef = useRef<Chat | null>(null);

    currentChatRef.current = currentChat;

    const handleNotification = (notification: Notification<MessageNotification | DefaultNotification>) => {
        if (notification.type === "Unknown Error") {
            toast.error(notification.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } else if (notification.type === "Group Update" || notification.type === "New Friend") {
            toast.info(notification.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } else if (notification.type === "New Message") {
            const newCurrentChat: Chat = {
                id: notification.message.id,
                admin: notification.message.admin,
                chatName: notification.message.chatName,
                createdAt: notification.message.createdAt,
            };

            /**
             *  If the user away from the incoming message's chat then receive a notification
             *  if user is already watching the messages from that group then we dont send the notification
             */

            if ((currentChatRef.current && currentChatRef.current?.id !== notification.message.id) || !currentChatRef.current) {
                toast.info(
                    <div
                        onClick={() => {
                            setCurrentChat(newCurrentChat);
                            changeFocus({ focusTo: "chatbar" });
                        }}
                        className="flex flex-col text-sm"
                    >
                        <span className="font-semibold">{notification.message.chatName}</span>
                        <span className="font-semibold">{notification.message.displayName}</span>
                        <span className="">
                            {notification.message.text.length === 25 ? notification.message.text + "..." : notification.message.text}
                        </span>
                    </div>,
                    {
                        icon: <Mail />,
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    }
                );
            }
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket?.on("notify", handleNotification);

        return () => {
            socket?.off("notify", handleNotification);
        };
    }, [socket]);

    return (
        <ToastContainer
            limit={1}
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
}
