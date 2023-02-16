import { useContext } from "react";
import { ChatInfo, FocusableOptions, SidePanelState } from "../../../types";
import { ChatListContext } from "../../../App";
import { SidePanelMenu } from "./SIdePanelMenu/SidePanelMenu";
import { TopBar } from "../Shared/TopBar";

export function MainPanel({
    openSidePanel: { open },
    setOpenSidePanel,
    changeFocus,
}: {
    openSidePanel: SidePanelState;
    setOpenSidePanel: React.Dispatch<React.SetStateAction<SidePanelState>>;
    changeFocus: (focusTo: FocusableOptions) => void;
}) {
    const chatList = useContext(ChatListContext);

    return (
        <div
            id="main-panel"
            className={`
                bg-pink-400
                ${open && "-translate-x-full"} transition-transform
                absolute w-full h-full grid grid-rows-[3.5rem,1fr]
            `}
        >
            <TopBar />
            <ul className="flex flex-col overflow-y-auto select-none">
                {chatList.map((chat, idx) => (
                    <ChatInfoComponent chatInfo={chat} changeFocus={changeFocus} key={`chat-${idx}`} />
                ))}
            </ul>
            <SidePanelMenu setOpenSidePanel={setOpenSidePanel} />
        </div>
    );
}

function ChatInfoComponent({ chatInfo, changeFocus }: { chatInfo: ChatInfo; changeFocus: (focusTo: FocusableOptions) => void }) {
    return (
        <li
            onClick={() => changeFocus("chatbar")}
            className=" 
                        hover:cursor-pointer
                        flex flex-col justify-center
                        min-h-[4.5rem]
                        "
        >
            {chatInfo.chatName}
        </li>
    );
}
