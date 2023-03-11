import { useContext, useEffect, useState } from "react";
import { Chat, DatabaseUser } from "../../../serverTypes";
import { FocusableOptions, PossiblePanelStates } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";
import { SocketIOContext } from "../Chat";
import { KickMembers } from "./KickMembers";
import { DeleteGroup } from "./DeleteGroup";
import { User } from "firebase/auth";

type RightPanelProps = {
    panelStates: PossiblePanelStates;
    changeFocus: ({ focusTo }: FocusableOptions) => void;
    currentChat: Chat | null;
    user: User;
};

export function RightBar({ panelStates, changeFocus, currentChat, user }: RightPanelProps) {
    const goBack = () => changeFocus({ focusTo: "chatbar" });

    const [members, setMembers] = useState<DatabaseUser[]>([]);
    const socket = useContext(SocketIOContext);

    useEffect(() => {
        /**
         *  if the component is not visible to the user no need to fetch data
         */
        if (panelStates.third !== "-200%" || !currentChat?.id || !socket) return;

        socket?.emit("get_members", currentChat.id);

        const listener = (updatedMembers: DatabaseUser[]) => {
            setMembers(updatedMembers);
        };

        socket.on("respond_get_members", listener);
        return () => {
            socket.off("respond_get_members", listener);
        };
    }, [currentChat, panelStates.third]);

    return (
        <section
            className={`
                ${panelStates.third === "-200%" ? "md:translate-x-[-100%] max-md:translate-x-[-200%]" : ""}
                bg-white transition-transform duration-300
                grid grid-rows-[3.5rem,1fr]
            `}
        >
            <TopBar>
                <div className="shadow-sm border-l border-[var(--custom-grey)] h-full w-full flex items-center px-4 ">
                    <GoBack onArrowClick={goBack} />
                    <div className="flex pl-4 grow select-none">
                        <span className="text-lg font-semibold text-ellipsis">Settings</span>
                    </div>
                </div>
            </TopBar>
            <div className="h-full relative">
                {currentChat?.id && <KickMembers members={members} currentChat={currentChat} />}
                {currentChat?.admin === user.email && <DeleteGroup currentChat={currentChat} />}
            </div>
        </section>
    );
}
