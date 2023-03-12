import { useContext } from "react";
import { FocusableOptions, PossiblePanelStates, UseChatListType } from "../../../types";
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
    updatePreviewMessages: UseChatListType["setChatList"];
};

export function ChatBar({ panelStates, changeFocus, currentChat, user, updatePreviewMessages }: ChatBarProps) {
    const socket = useContext(SocketIOContext);
    const { messages, loadMore, limitReached } = useMessages({ socket, currentChat, user, updatePreviewMessages });

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
                        grid grid-rows-[3.5rem,calc(100%-3.5rem)] overflow-hidden
                        chat-parent shadow-md
                    `}
            style={{ backgroundSize: panelStates.third === "-200%" ? "19%" : "20%" }}
        >
            <TopBar>
                <div className="shadow-sm h-full w-full flex items-center px-4 ">
                    <GoBack extraClasses="hidden max-md:block px-3" onArrowClick={() => changeFocus({ focusTo: "leftbar" })} />
                    <div className="px-2 flex">
                        <span className="text-lg font-semibold text-ellipsis ">{currentChat && currentChat?.chatName}</span>
                    </div>

                    {currentChat?.id && <ChatConfig panelStates={panelStates} changeFocus={changeFocus} />}
                </div>
            </TopBar>

            <div className="relative h-full w-full overflow-hidden">
                <div className="chat-section h-full w-full pb-20 md:pb-24 overflow-x-hidden overflow-y-auto flex flex-col-reverse relative ">
                    {currentChat?.id &&
                        messages.map((message, index) => {
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
