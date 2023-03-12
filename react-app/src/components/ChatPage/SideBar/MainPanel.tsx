import { useContext, useEffect } from "react";
import { FocusableOptions, NecessaryMainPanelProps, SidePanelController, useChat } from "../../../types";
import { SidePanelMenu } from "./SIdePanelMenu/SidePanelMenu";
import { TopBar } from "../Shared/TopBar";
import { SocketIOContext } from "../Chat";
import { useChatList } from "../../hooks/useChatList";
import { Chat, ExtendedChat } from "../../../serverTypes";
import { MainPanelSearchBar } from "./MainPanelCompoenents/MainPanelSearchBar";
import { SkeletonChat } from "../Shared/SidePanel/SkeletonChat";
import { useSortMainPanel } from "../../hooks/useSort";

type MainPanelProps = SidePanelController & {
    necessaryMainPanelProps: NecessaryMainPanelProps;
    changeFocus: ({ focusTo }: FocusableOptions) => void;
    useChat: useChat;
};

export function MainPanel({ necessaryMainPanelProps: { chatList, loading }, nextWindow, setWindowType, changeFocus, useChat }: MainPanelProps) {
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
    chatInfo: ExtendedChat;
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
            } cursor-pointer select-none px-2 transition-colors py-2`}
        >
            <div className="flex w-full whitespace-nowrap text-ellipsis overflow-hidden gap-4 ">
                <div className="rounded-full h-12 aspect-square bg-gray-200 "></div>
                <div role="status" className=" w-full h-full flex flex-col relative">
                    <span className="font-medium">{chatInfo.chatName}</span>
                    <div className="absolute right-1 top-0">
                        <span className="text-xs">
                            {chatInfo.messages[0] &&
                                chatInfo.messages[0].createdAt &&
                                new Date(chatInfo.messages[0].createdAt).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                        </span>
                    </div>
                    <div className="grid grid-cols-[auto,1fr] items-center w-full gap-2 ">
                        <span className={`${chatInfo.messages[0] ? "after:content-[':']" : ""} relative`}>
                            {chatInfo.messages[0] && chatInfo.messages[0].messenger.displayName}
                        </span>
                        <div className="grow-0 shrink-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                            <span className="text-gray-600">{chatInfo.messages[0] && chatInfo.messages[0].text}</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
