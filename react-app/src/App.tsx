import { Login } from "./components/LoginPage/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAppAuth } from "./firebase";
import { Chats } from "./components/ChatPage/Chat";
import { useEffect } from "react";

function App() {
    const [user] = useAuthState(firebaseAppAuth);

    /**
     *  This block of code prevents the default behaviour of when scroll up reloading
     *  in mobile web browsers
     */

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY === 0) {
                document.body.classList.add("scroll-top");
            } else {
                document.body.classList.remove("scroll-top");
            }
        }

        function handleTouchStart(event: TouchEvent) {
            if (event.target === document.body && document.body.classList.contains("scroll-top")) {
                event.preventDefault();
            }
        }

        window.addEventListener("scroll", handleScroll);
        document.body.addEventListener("touchstart", handleTouchStart);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.body.removeEventListener("touchstart", handleTouchStart);
        };
    }, []);

    return user ? <Chats user={user} /> : <Login />;
}

export default App;
