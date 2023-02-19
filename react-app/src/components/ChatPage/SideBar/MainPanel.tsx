import { useContext } from "react";
import { ChatInfo, FocusableOptions, SidePanelController, SidePanelState, SidePanelStateTypes } from "../../../types";
import { ChatListContext } from "../../../App";
import { SidePanelMenu } from "./SIdePanelMenu/SidePanelMenu";
import { TopBar } from "../Shared/TopBar";

export function MainPanel({
    nextWindow,
    previousWindow,
    setWindowType,
    changeFocus,
}: SidePanelController & {
    changeFocus: (focusTo: FocusableOptions) => void;
}) {
    const chatList = useContext(ChatListContext);

    return (
        <div
            id="main-panel"
            className={`
              bg-pink-400
                absolute w-full h-full grid grid-rows-[3.5rem,1fr]
            `}
        >
            <TopBar />
            <ul className="flex flex-col overflow-y-auto select-none">
                {chatList.map((chat, idx) => (
                    <ChatInfoComponent chatInfo={chat} changeFocus={changeFocus} key={`chat-${idx}`} />
                ))}
            </ul>
            <SidePanelMenu setWindowType={setWindowType} nextWindow={nextWindow} />
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
