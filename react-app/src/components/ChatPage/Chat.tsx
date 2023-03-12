import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import { LeftBar } from "./SideBar/LeftBar";
import { ChatBar } from "./ChatBar/ChatBar";
import { useChangeFocus } from "../hooks/useChangeFocus";
import { User } from "firebase/auth";
import { SocketIOInstance } from "../../serverTypes";
import { useSocketIO } from "../hooks/useSocketIO";
import { Notification } from "./Notification";
import { RightBar } from "./RightBar/RightBar";

export const SocketIOContext = createContext<SocketIOInstance>(null);

export function Chats({ user }: { user: User }) {
    const { panelStates, changeFocus, currentChat, setCurrentChat } = useChangeFocus();

    const socketIOInstance = useSocketIO(user);

    return (
        <>
            <Notification socket={socketIOInstance} useChat={[currentChat, setCurrentChat]} changeFocus={changeFocus} />
            <SocketIOContext.Provider value={socketIOInstance}>
                <main
                    id="main-element"
                    className={`
                        w-screen touch-none overflow-hidden
                        grid grid-cols-[100vw,100vw,100vw] md:grid-cols-[var(--left-bar),var(--center-bar),var(--right-bar)] transition-transform
                        relative
                    `}
                >
                    <LeftBar panelStates={panelStates} changeFocus={changeFocus} useChat={[currentChat, setCurrentChat]} user={user} />
                    <ChatBar panelStates={panelStates} changeFocus={changeFocus} currentChat={currentChat} user={user} />
                    <RightBar panelStates={panelStates} changeFocus={changeFocus} currentChat={currentChat} user={user} />
                </main>
            </SocketIOContext.Provider>
        </>
    );
}
