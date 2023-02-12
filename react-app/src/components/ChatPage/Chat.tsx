import { useRef } from "react";
import { ArrowLeft } from "react-feather";

type ChatTo = string;

type ChatList = ChatTo[];

type FocusableOptions = "sidebar" | "chatbar";

function useChangeFocus(parentElement: React.RefObject<HTMLElement>) {
    const changeFocus = (focusTo: FocusableOptions) => {
        const sideBar = parentElement.current?.children[0],
            chatBar = parentElement.current?.children[1];
        if (focusTo === "sidebar") {
            if (chatBar?.id && sideBar?.id) {
                chatBar.id = "chatbar-invisible";
                sideBar.id = "sidebar-visible";
            }
        } else if (focusTo === "chatbar") {
            if (chatBar?.id && sideBar?.id) {
                chatBar.id = "chatbar-visible";
                sideBar.id = "sidebar-invisible";
            }
        }
    };

    return { changeFocus };
}

export function Chats() {
    const mainRef = useRef<HTMLElement>(null);

    const { changeFocus } = useChangeFocus(mainRef);

    return (
        <main
            ref={mainRef}
            className={`
                h-screen w-screen touch-none overflow-hidden
                flex flex-row  
                `}
        >
            <SideBar list={Array(100).fill("hello")} changeFocus={changeFocus} />
            <ChatBar changeFocus={changeFocus} />
        </main>
    );
}

function SideBar({ list, changeFocus }: { list: ChatList; changeFocus: (focusTo: FocusableOptions) => void }) {
    return (
        <section
            id="nothing"
            className="
                    transition-transform
                    w-1/4
                    max-md:min-w-[100vw]
                    bg-red-500
                    grid grid-rows-[3.5rem,1fr]
                    "
        >
            <TopBar />
            <ul className="flex flex-col overflow-y-auto select-none">
                {list.map((chat, idx) => (
                    <Chat peekInfo={chat} changeFocus={changeFocus} key={`chat-${idx}`} />
                ))}
            </ul>
        </section>
    );
}

function TopBar({ children }: React.PropsWithChildren) {
    return <div className="bg-green-500">{children}</div>;
}

function Chat({ peekInfo, changeFocus }: { peekInfo: ChatTo; changeFocus: (focusTo: FocusableOptions) => void }) {
    return (
        <li
            onClick={() => changeFocus("chatbar")}
            className=" 
                        hover:cursor-pointer
                        flex flex-col justify-center
                        min-h-[4.5rem]
                        "
        >
            {peekInfo}
        </li>
    );
}

function ChatBar({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    return (
        <section
            id="nothing"
            className="
                    transition-transform
                    w-3/4
                    max-md:min-w-[100vw]
                    bg-blue-500
                    grid grid-rows-[3.5rem,1fr]
                    "
        >
            <TopBar>
                <ChatBarTopSection changeFocus={changeFocus} />
            </TopBar>
            <div className="flex justify-center items-center">
                <span>hlleo</span>
            </div>
        </section>
    );
}

function ChatBarTopSection({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    return (
        <div className="w-full h-full flex items-center px-4">
            <div onClick={() => changeFocus("sidebar")} className="hover:cursor-pointer hidden max-md:block">
                <ArrowLeft />
            </div>
        </div>
    );
}
