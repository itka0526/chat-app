import { Login } from "./components/LoginPage/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAppAuth } from "./firebase";
import { Chats } from "./components/ChatPage/Chat";
import { useChatList } from "./components/hooks/useChatList";
import { createContext } from "react";
import { ChatInfoList } from "./types";

export const ChatListContext = createContext<ChatInfoList>([]);

function App() {
    const [user] = useAuthState(firebaseAppAuth);

    const chatList = useChatList({ displayName: user?.displayName || "", email: user?.email, dependencies: [user] });

    return user ? (
        <ChatListContext.Provider value={chatList}>
            <Chats user={user} />
        </ChatListContext.Provider>
    ) : (
        <Login />
    );
}

export default App;
