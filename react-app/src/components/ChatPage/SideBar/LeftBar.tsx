import { useState } from "react";
import { FocusableOptions, SidePanelState } from "../../../types";
import { MainPanel } from "./MainPanel";
import { SidePanel } from "../Shared/SidePanel/SidePanel";
import { NewGroup } from "./SidePanelComponents/NewGroup";
import { NewFriend } from "./SidePanelComponents/NewFriend";

export function LeftBar({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    const [openSidePanel, setOpenSidePanel] = useState<SidePanelState>({
        open: false,
        type: "",
    });

    const closeSidePanel = () => setOpenSidePanel({ open: false, type: "" });

    return (
        <section
            id="nothing"
            className="
                    transition-transform
                    w-1/4
                    max-md:min-w-[100vw]
                    bg-yellow-500
                    relative overflow-x-hidden
                    "
        >
            <MainPanel changeFocus={changeFocus} openSidePanel={openSidePanel} setOpenSidePanel={setOpenSidePanel} />
            <SidePanel handleBack={closeSidePanel} zIndex="0" openSidePanel={openSidePanel} setOpenSidePanel={setOpenSidePanel}>
                {openSidePanel.type === "new_group" ? <NewGroup /> : openSidePanel.type === "new_friend" ? <NewFriend /> : <div />}
            </SidePanel>
        </section>
    );
}
