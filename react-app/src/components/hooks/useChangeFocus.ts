import { useState } from "react";

import { Chat, ExtendedChat } from "../../serverTypes";
import { FocusableOptions, PossiblePanelStates } from "../../types";

export function useChangeFocus() {
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);

    const [panelStates, setPanelStates] = useState<PossiblePanelStates>({
        first: "0%",
        second: "0%",
        third: "0%",
    });

    const changeFocus = ({ focusTo }: FocusableOptions) => {
        if (focusTo === "leftbar") {
            setPanelStates({
                first: "0%",
                second: "0%",
                third: "0%",
            });
        }

        if (focusTo === "chatbar") {
            setPanelStates({
                first: "-100%",
                second: "-100%",
                third: "0%",
            });
        }

        if (focusTo === "rightbar") {
            setPanelStates({
                first: "-200%",
                second: "-200%",
                third: "-200%",
            });
        }
    };

    return { changeFocus, currentChat, setCurrentChat, panelStates };
}
