import { Login } from "./components/LoginPage/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAppAuth } from "./firebase";
import { Chats } from "./components/ChatPage/Chat";

function App() {
    const [user] = useAuthState(firebaseAppAuth);

    return user ? <Chats user={user} /> : <Login />;
}

export default App;
