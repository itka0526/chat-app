import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LeftBar } from "./SideBar/LeftBar";
import { ChatBar } from "./ChatBar/ChatBar";
import { useChangeFocus } from "../hooks/useChangeFocus";
import { User } from "firebase/auth";
import { SocketIOInstance } from "../../serverTypes";
import { useSocketIO } from "../hooks/useSocketIO";
import { Notification } from "./Notification";

export const SocketIOContext = createContext<SocketIOInstance>(null);

export function Chats({ user }: { user: User }) {
    const mainRef = useRef<HTMLElement>(null);
    const { changeFocus, currentChat } = useChangeFocus(mainRef);

    const socketIOInstance = useSocketIO(user);

    return (
        <>
            <Notification socket={socketIOInstance} />
            <SocketIOContext.Provider value={socketIOInstance}>
                <main
                    ref={mainRef}
                    className={`
                    h-screen w-screen touch-none overflow-hidden
                    flex flex-row  
                    `}
                >
                    <LeftBar changeFocus={changeFocus} user={user} />
                    <ChatBar changeFocus={changeFocus} currentChat={currentChat} />
                </main>
            </SocketIOContext.Provider>
        </>
    );
}
