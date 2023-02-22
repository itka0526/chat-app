import { useContext, useEffect, useState } from "react";
import { FocusableOptions, changeFocusArgs } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";
import { Send } from "react-feather";
import { Chat } from "../../../serverTypes";
import { SocketIOContext } from "../Chat";

export function ChatBar({ changeFocus, currentChat }: { changeFocus: (args: changeFocusArgs) => void; currentChat: Chat | null }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const handleClick = () => {
        setInput("");
        console.log(input);
    };
    const socket = useContext(SocketIOContext);

    useEffect(() => {
        if (!currentChat) return;

        console.log(currentChat);
    }, [currentChat]);

    return (
        <section
            id="nothing"
            className="
                    transition-transform duration-300
                    w-3/4
                    max-md:min-w-[100vw]
                    grid grid-rows-[3.5rem,1fr] 
                    chat-parent shadow-md   
                    "
        >
            <TopBar>
                <div className="shadow-sm h-full w-full flex items-center px-4">
                    <GoBack extraClasses="hidden max-md:block" onArrowClick={() => changeFocus({ focusTo: "sidebar", chat: null })} />
                </div>
            </TopBar>
            <div className="relative">
                <div className="chat-section"></div>
                <form
                    className="chat-input-section h-12 w-4/5 md:w-1/2 absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}
                >
                    <div className="h-full rounded-md overflow-hidden border-2 border-[var(--custom-grey)] custom-shadow relative">
                        <input
                            className="h-full w-full outline-none pl-4"
                            placeholder="Message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        ></input>
                        <Send onClick={handleClick} className="absolute top-1/2 -translate-y-1/2 right-4 rotate-6 text-blue-600 cursor-pointer" />
                    </div>
                </form>
            </div>
        </section>
    );
}
