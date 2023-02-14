import { useEffect, useRef, useState } from "react";
import { SideBar } from "./SideBar/Sidebar";
import { ChatBar } from "./ChatBar/ChatBar";
import { useChangeFocus } from "../hooks/useChangeFocus";
import { Socket, io } from "socket.io-client";
import { User } from "firebase/auth";
import { ClientToServerEvents, ServerToClientEvents } from "../../serverTypes";
import { useSocketIO } from "../hooks/useSocketIO";

export function Chats({ user }: { user: User }) {
    const mainRef = useRef<HTMLElement>(null);
    const { changeFocus } = useChangeFocus(mainRef);

    const { socket } = useSocketIO(user);
    useEffect(() => {}, []);

    return (
        <main
            ref={mainRef}
            className={`
                h-screen w-screen touch-none overflow-hidden
                flex flex-row  
                `}
        >
            <SideBar changeFocus={changeFocus} />
            <ChatBar changeFocus={changeFocus} />
        </main>
    );
}
