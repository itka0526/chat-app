import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import { LeftBar } from "./SideBar/LeftBar";
import { ChatBar } from "./ChatBar/ChatBar";
import { useChangeFocus } from "../hooks/useChangeFocus";
import { User } from "firebase/auth";
import { SocketIOInstance } from "../../serverTypes";
import { useSocketIO } from "../hooks/useSocketIO";
import { Notification } from "./Notification";
import { RightBar } from "./RightBar/RightBar";
import { useChatList } from "../hooks/useChatList";

export const SocketIOContext = createContext<SocketIOInstance>(null);

export function Chats({ user }: { user: User }) {
    const socketIOInstance = useSocketIO(user);

    const { panelStates, changeFocus, currentChat, setCurrentChat } = useChangeFocus();
    const useChatListHookInstance = useChatList(socketIOInstance);

    return (
        <>
            <Notification socket={socketIOInstance} useChat={[currentChat, setCurrentChat]} changeFocus={changeFocus} />
            <SocketIOContext.Provider value={socketIOInstance}>
                <main
                    id="main-element"
                    className={`
                        grid grid-cols-[100vw,100vw,100vw] md:grid-cols-[var(--left-bar),var(--center-bar),var(--right-bar)] transition-transform
                        relative
                    `}
                >
                    <LeftBar
                        necessaryMainPanelProps={useChatListHookInstance}
                        panelStates={panelStates}
                        changeFocus={changeFocus}
                        useChat={[currentChat, setCurrentChat]}
                        user={user}
                    />
                    <ChatBar
                        panelStates={panelStates}
                        changeFocus={changeFocus}
                        currentChat={currentChat}
                        user={user}
                        updatePreviewMessages={useChatListHookInstance.setChatList}
                    />
                    <RightBar panelStates={panelStates} changeFocus={changeFocus} currentChat={currentChat} user={user} />
                </main>
            </SocketIOContext.Provider>
        </>
    );
}
