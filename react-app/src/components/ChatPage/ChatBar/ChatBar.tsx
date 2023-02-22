import { useContext, useEffect, useState } from "react";
import { FocusableOptions, changeFocusArgs } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";
import { Send } from "react-feather";
import { Chat, Message, UIMessage } from "../../../serverTypes";
import { SocketIOContext } from "../Chat";
import { User } from "firebase/auth";
import { useMessages } from "../../hooks/useMessages";

export function ChatBar({ changeFocus, currentChat, user }: { changeFocus: (args: changeFocusArgs) => void; currentChat: Chat | null; user: User }) {
    const socket = useContext(SocketIOContext);
    const { input, setInput, messages, handleSubmit } = useMessages({ socket, currentChat, user });
    console.log(messages);

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
                </div>
            </TopBar>
            <div className="relative h-full w-full">
                <div className="chat-section h-full w-full pb-20 md:pb-24 overflow-x-hidden overflow-y-auto flex flex-col-reverse gap-2">
                    {messages
                        .sort((a, b) => b.messageId - a.messageId)
                        .map((message, index) => (
                            <div className=" w-full bg-red-200 grow-0 shrink-0 px-4 py-2" key={`message-${message.messageId}-${index}`}>
                                <div className="flex flex-col bg-white">
                                    {index - 1 >= 0 && messages[index - 1].displayName === message.displayName ? (
                                        <></>
                                    ) : (
                                        <span>{message.displayName}</span>
                                    )}
                                    <div>
                                        <span>{message.text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <form
                    className="chat-input-section h-12 w-4/5 md:w-1/2 absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="h-full rounded-md overflow-hidden border-2 border-[var(--custom-grey)] custom-shadow relative">
                        <input
                            className="h-full w-full outline-none pl-4"
                            placeholder="Message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        ></input>
                        <Send onClick={handleSubmit} className="absolute top-1/2 -translate-y-1/2 right-4 rotate-6 text-blue-600 cursor-pointer" />
                    </div>
                </form>
            </div>
        </section>
    );
}
