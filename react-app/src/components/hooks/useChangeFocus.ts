import { FocusableOptions } from "../../types";

export function useChangeFocus(parentElement: React.RefObject<HTMLElement>) {
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
