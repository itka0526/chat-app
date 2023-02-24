import { User } from "firebase/auth";
import { useState } from "react";
import { Chat, SocketIOInstance } from "../../../serverTypes";
import { Send } from "react-feather";

export function ChatBarInput({ user, socket, currentChat }: { user: User; socket: SocketIOInstance; currentChat: Chat | null }) {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if (!currentChat?.id || !input) return;

        if (!user.email) {
            socket?.disconnect();
            return;
        }

        socket?.emit(
            "post_chat",
            currentChat?.id,
            { displayName: user.displayName || "anonymous", email: user.email, profileImageURL: user.photoURL || "" },
            input
        );

        setInput("");
    };
    return (
        <form
            className={`chat-input-section h-12 w-4/5 md:w-1/2 absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 transition-transform ${
                currentChat?.id ? "" : "translate-y-28"
            }`}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <div className="h-full rounded-md overflow-hidden  custom-shadow relative">
                <input
                    className="h-full w-full outline-none pl-4"
                    placeholder="Message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <Send onClick={handleSubmit} className="absolute top-1/2 -translate-y-1/2 right-4 rotate-6 text-blue-600 cursor-pointer" />
            </div>
        </form>
    );
}