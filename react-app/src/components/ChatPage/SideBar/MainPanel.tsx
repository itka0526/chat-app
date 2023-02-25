import { useContext } from "react";
import { SidePanelController, changeFocusArgs } from "../../../types";
import { SidePanelMenu } from "./SIdePanelMenu/SidePanelMenu";
import { TopBar } from "../Shared/TopBar";
import { SocketIOContext } from "../Chat";
import { useChatList } from "../../hooks/useChatList";
import { Chat } from "../../../serverTypes";
import { MainPanelSearchBar } from "./MainPanelCompoenents/MainPanelSearchBar";
import { SkeletonChat } from "../Shared/SidePanel/SkeletonChat";
import { useSortMainPanel } from "../../hooks/useSort";

export function MainPanel({
    nextWindow,
    setWindowType,
    changeFocus,
    currentChat,
}: SidePanelController & {
    changeFocus: (args: changeFocusArgs) => void;
    currentChat: Chat | null;
}) {
    const socket = useContext(SocketIOContext);

    const { chatList, loading } = useChatList(socket);

    const { filteredData, rawInput, handleChange } = useSortMainPanel(500, chatList);

    filteredData;

    return (
        <div
            id="main-panel"
            className={`
              bg-white
                absolute w-full h-full grid grid-rows-[3.5rem,1fr]
            `}
        >
            <TopBar>
                <MainPanelSearchBar rawInput={rawInput} handleChange={handleChange} />
            </TopBar>
            <ul className="flex flex-col overflow-y-auto select-none p-2 pt-0 ">
                {loading ? (
                    <SkeletonChat />
                ) : (
                    filteredData.map((chat, idx) => (
                        <ChatInfoComponent currentChat={currentChat} chatInfo={chat} changeFocus={changeFocus} key={`chat-${idx}-${chat.id}`} />
                    ))
                )}
            </ul>
            <SidePanelMenu setWindowType={setWindowType} nextWindow={nextWindow} />
        </div>
    );
}

function ChatInfoComponent({
    chatInfo,
    currentChat,
    changeFocus,
}: {
    chatInfo: Chat;
    currentChat: Chat | null;
    changeFocus: (args: changeFocusArgs) => void;
}) {
    return (
        <li
            onClick={() => changeFocus({ focusTo: "chatbar", chat: chatInfo })}
            className={`flex items-center min-h-[3.5rem] w-full rounded-md ${
                currentChat?.id === chatInfo.id ? "bg-slate-100" : "hover:bg-slate-100"
            } cursor-pointer select-none px-2 transition-colors`}
        >
            <div className="flex flex-col w-full whitespace-nowrap text-ellipsis overflow-hidden">
                <span className="font-medium">{chatInfo.chatName}</span>
            </div>
        </li>
    );
}
