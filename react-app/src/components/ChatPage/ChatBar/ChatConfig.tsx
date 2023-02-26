import { useEffect, useState } from "react";
import { MoreVertical } from "react-feather";
import { createPortal } from "react-dom";
import { FocusableOptions, PossiblePanelStates } from "../../../types";

type ChatConfigProps = {
    panelStates: PossiblePanelStates;
    changeFocus: ({ focusTo }: FocusableOptions) => void;
};

export function ChatConfig({ panelStates, changeFocus }: ChatConfigProps) {
    const openWindow = () => changeFocus({ focusTo: "rightbar" });

    return (
        <div className="h-full grow flex flex-row-reverse px-2 items-center">
            <div
                className={`
                    transition-transform duration-300
                    ${panelStates.third === "-200%" ? "md:-translate-x-[var(--right-bar)]" : ""}
                `}
            >
                <div
                    className={`
                        cursor-pointer rounded-full overflow-hidden
                        p-1 hover:bg-gray-100 transition-colors
                    `}
                >
                    <MoreVertical width={28} height={28} onClick={openWindow} />
                </div>
            </div>
        </div>
    );
}
