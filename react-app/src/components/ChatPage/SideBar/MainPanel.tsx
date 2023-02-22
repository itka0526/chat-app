import { useContext } from "react";
import { SidePanelController, changeFocusArgs } from "../../../types";
import { SidePanelMenu } from "./SIdePanelMenu/SidePanelMenu";
import { TopBar } from "../Shared/TopBar";
import { SocketIOContext } from "../Chat";
import { useChatList } from "../../hooks/useChatList";
import { Chat } from "../../../serverTypes";
import { MainPanelSearchBar } from "./MainPanelCompoenents/MainPanelSearchBar";
import { SkeletonChat } from "../Shared/SidePanel/SkeletonChat";

export function MainPanel({
    nextWindow,
    setWindowType,
    changeFocus,
}: SidePanelController & {
    changeFocus: (args: changeFocusArgs) => void;
}) {
    const socket = useContext(SocketIOContext);
    const { chatList, loading } = useChatList(socket);

    return (
        <div
            id="main-panel"
            className={`
              bg-white
                absolute w-full h-full grid grid-rows-[3.5rem,1fr]
            `}
        >
            <TopBar>
                <MainPanelSearchBar />
            </TopBar>
            <ul className="flex flex-col overflow-y-auto select-none p-2 pt-0 ">
                {loading ? (
                    <SkeletonChat />
                ) : (
                    chatList.map((chat, idx) => <ChatInfoComponent chatInfo={chat} changeFocus={changeFocus} key={`chat-${idx}`} />)
                )}
            </ul>
            <SidePanelMenu setWindowType={setWindowType} nextWindow={nextWindow} />
        </div>
    );
}

function ChatInfoComponent({ chatInfo, changeFocus }: { chatInfo: Chat; changeFocus: (args: changeFocusArgs) => void }) {
    return (
        <li
            onClick={() => changeFocus({ focusTo: "chatbar", chat: chatInfo })}
            className={`flex items-center min-h-[3.5rem] w-full rounded-md hover:bg-slate-100 cursor-pointer select-none px-2`}
        >
            <div className="flex flex-col w-full whitespace-nowrap text-ellipsis overflow-hidden">
                <span className="font-medium">{chatInfo.chatName}</span>
            </div>
        </li>
    );
}
