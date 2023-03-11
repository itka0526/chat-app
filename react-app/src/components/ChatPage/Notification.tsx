import { useEffect } from "react";
import { Notification, SocketIOInstance } from "../../serverTypes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Notification({ socket }: { socket: SocketIOInstance }) {
    const handleNotification = (notification: Notification) => {
        if (notification.type === "Unknown Error") {
            toast.error(notification.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } else if (notification.type === "Group Update" || notification.type === "New Friend") {
            toast.info(notification.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };

    useEffect((): any => {
        if (!socket) return;

        socket?.on("notify", handleNotification);

        return () => {
            socket?.off("notify", handleNotification);
        };
    }, [socket]);

    return (
        <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
}
