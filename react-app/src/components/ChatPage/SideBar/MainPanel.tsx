import { useContext, useEffect } from "react";
import { FocusableOptions, SidePanelController, useChat } from "../../../types";
import { SidePanelMenu } from "./SIdePanelMenu/SidePanelMenu";
import { TopBar } from "../Shared/TopBar";
import { SocketIOContext } from "../Chat";
import { useChatList } from "../../hooks/useChatList";
import { Chat } from "../../../serverTypes";
import { MainPanelSearchBar } from "./MainPanelCompoenents/MainPanelSearchBar";
import { SkeletonChat } from "../Shared/SidePanel/SkeletonChat";
import { useSortMainPanel } from "../../hooks/useSort";

type MainPanelProps = SidePanelController & {
    changeFocus: ({ focusTo }: FocusableOptions) => void;
    useChat: useChat;
};

export function MainPanel({ nextWindow, setWindowType, changeFocus, useChat }: MainPanelProps) {
    const socket = useContext(SocketIOContext);

    const { chatList, loading } = useChatList(socket);

    const [currentChat, setCurrentChat] = useChat;

    useEffect(() => {
        /**
         *  If chat list does not contain the active chat we should reset active/currentChat to null
         */

        if (currentChat?.id && !chatList.map((c) => c.id).includes(currentChat.id)) {
            setCurrentChat(null);
            changeFocus({ focusTo: "leftbar" });
        }
    }, [chatList, currentChat]);

    const { filteredData, rawInput, handleChange } = useSortMainPanel(500, chatList);

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
                        <ChatInfoComponent useChat={useChat} chatInfo={chat} changeFocus={changeFocus} key={`chat-${idx}-${chat.id}`} />
                    ))
                )}
            </ul>
            <SidePanelMenu setWindowType={setWindowType} nextWindow={nextWindow} />
        </div>
    );
}

type ChatInfoComponentProps = {
    chatInfo: Chat;
    changeFocus: ({ focusTo }: FocusableOptions) => void;
    useChat: useChat;
};

function ChatInfoComponent({ chatInfo, changeFocus, useChat: [currentChat, setCurrentChat] }: ChatInfoComponentProps) {
    const handleClick = () => {
        changeFocus({ focusTo: "chatbar" });
        setCurrentChat(chatInfo);
    };
    return (
        <li
            onClick={handleClick}
            className={`flex items-center min-h-[3.5rem] w-full rounded-md ${
                currentChat?.id === chatInfo.id ? "bg-gray-100" : "hover:bg-gray-100"
            } cursor-pointer select-none px-2 transition-colors`}
        >
            <div className="flex flex-col w-full whitespace-nowrap text-ellipsis overflow-hidden">
                <span className="font-medium">{chatInfo.chatName}</span>
            </div>
        </li>
    );
}
