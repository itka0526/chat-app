import { useState } from "react";
import { FocusableOptions, SidePanelState } from "../../../types";
import { MainPanel } from "./MainPanel";
import { SidePanel } from "../Shared/SidePanel/SidePanel";
import { NewGroup } from "./SidePanelComponents/NewGroup";
import { NewFriend } from "./SidePanelComponents/NewFriend";
import { AddingChatName } from "./SidePanelComponents/AddingNewMembers/AddingChatName";

export function LeftBar({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    const [openSidePanel, setOpenSidePanel] = useState<SidePanelState>({
        open: false,
        type: "",
    });

    const closeSidePanel = () => setOpenSidePanel({ open: false, type: "" });

    const [secondSidePanel, setSecondSidePanel] = useState<SidePanelState>({
        open: false,
        type: "chat_1",
    });

    const closeSecondSidePanel = () => setSecondSidePanel({ open: false, type: "chat_1" });

    // for new second panel group
    const [chatName, setChatName] = useState("");

    return (
        <section
            id="nothing"
            className="
                    transition-transform
                    w-1/4
                    max-md:min-w-[100vw]
                    bg-yellow-500
                    relative overflow-x-hidden
                    isolate
                    "
        >
            <MainPanel changeFocus={changeFocus} openSidePanel={openSidePanel} setOpenSidePanel={setOpenSidePanel} />

            <SidePanel handleBack={closeSidePanel} zIndex="0" openSidePanel={openSidePanel} setOpenSidePanel={setOpenSidePanel}>
                {openSidePanel.type === "new_group" ? (
                    <NewGroup setSecondSidePanel={setSecondSidePanel} chatName={chatName} />
                ) : openSidePanel.type === "new_friend" ? (
                    <NewFriend />
                ) : (
                    <div />
                )}
            </SidePanel>
            <SidePanel handleBack={closeSecondSidePanel} openSidePanel={secondSidePanel} zIndex="10" setOpenSidePanel={setSecondSidePanel}>
                {openSidePanel.type === "new_group" ? (
                    <AddingChatName setChatName={setChatName} closeSecondSidePanel={closeSecondSidePanel} />
                ) : (
                    <div />
                )}
            </SidePanel>
        </section>
    );
}
