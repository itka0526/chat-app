import { useContext } from "react";
import { changeFocusArgs } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";
import { Chat } from "../../../serverTypes";
import { SocketIOContext } from "../Chat";
import { User } from "firebase/auth";
import { useMessages } from "../../hooks/useMessages";
import { ChatBarInput } from "./ChatBarInput";
import { MessageItem } from "./MessageItem";
import { LoadMore } from "./LoadMore";

export function ChatBar({ changeFocus, currentChat, user }: { changeFocus: (args: changeFocusArgs) => void; currentChat: Chat | null; user: User }) {
    const socket = useContext(SocketIOContext);
    const { messages, loadMore, limitReached } = useMessages({ socket, currentChat, user });

    return (
        <section
            id="nothing"
            className="
                    transition-transform duration-300
                    w-3/4
                    max-md:min-w-[100vw]
                    grid grid-rows-[3.5rem,calc(100vh-3.5rem)] 
                    chat-parent shadow-md   
                    "
        >
            <TopBar>
                <div className="shadow-sm h-full w-full flex items-center px-4">
                    <GoBack extraClasses="hidden max-md:block" onArrowClick={() => changeFocus({ focusTo: "sidebar", chat: null })} />
                    <div className="px-2">
                        <span className="text-lg font-semibold">{currentChat?.chatName}</span>
                    </div>
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
                <ChatBarInput user={user} socket={socket} currentChat={currentChat} />
            </div>
        </section>
    );
}
