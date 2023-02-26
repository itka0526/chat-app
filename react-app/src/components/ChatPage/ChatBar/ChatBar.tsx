import { useContext } from "react";
import { FocusableOptions, PossiblePanelStates } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";
import { Chat } from "../../../serverTypes";
import { SocketIOContext } from "../Chat";
import { User } from "firebase/auth";
import { useMessages } from "../../hooks/useMessages";
import { ChatBarInput } from "./ChatBarInput";
import { MessageItem } from "./MessageItem";
import { LoadMore } from "./LoadMore";
import { ChatConfig } from "./ChatConfig";

type ChatBarProps = {
    panelStates: PossiblePanelStates;
    changeFocus: ({ focusTo }: FocusableOptions) => void;
    currentChat: Chat | null;
    user: User;
};

export function ChatBar({ panelStates, changeFocus, currentChat, user }: ChatBarProps) {
    const socket = useContext(SocketIOContext);
    const { messages, loadMore, limitReached } = useMessages({ socket, currentChat, user });

    return (
        <section
            className={`
                        ${
                            panelStates.second === "0%"
                                ? "max-md:translate-x-0"
                                : panelStates.second === "-100%"
                                ? "max-md:-translate-x-full"
                                : panelStates.second === "-200%"
                                ? "max-md:-translate-x-[200%]"
                                : ""
                        }
                        grid grid-rows-[3.5rem,calc(100vh-3.5rem)] 
                        chat-parent shadow-md 
                    `}
            style={{ backgroundSize: panelStates.third === "-200%" ? "19%" : "20%" }}
        >
            <TopBar>
                <div className="shadow-sm h-full w-full flex items-center px-4 ">
                    <GoBack extraClasses="hidden max-md:block" onArrowClick={() => changeFocus({ focusTo: "leftbar" })} />
                    <div className="px-2 flex">
                        <span className="text-lg font-semibold text-ellipsis ">{currentChat?.chatName}</span>
                    </div>

                    {currentChat?.id && <ChatConfig panelStates={panelStates} changeFocus={changeFocus} />}
                </div>
            </TopBar>

            <div className="relative h-full w-full">
                <div className="chat-section h-full w-full pb-20 md:pb-24 overflow-x-hidden overflow-y-auto flex flex-col-reverse relative ">
                    {messages.map((message, index) => {
                        const show = !(index - 1 >= 0 && messages[index - 1].displayName === message.displayName);
                        return <MessageItem message={message} show={show} key={`message-${message.messageId}-${index}`} />;
                    })}
                    {currentChat?.id && !limitReached && <LoadMore onClick={loadMore} />}
                </div>
                <ChatBarInput shrink={panelStates.third === "-200%"} user={user} socket={socket} currentChat={currentChat} />
            </div>
        </section>
    );
}
