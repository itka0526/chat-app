import { useState } from "react";
import { FocusableOptions, SidePanelState } from "../../../types";
import { SidePanel } from "./SidePanel";
import { MainPanel } from "./MainPanel";

export function SideBar({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    const [openSidePanel, setOpenSidePanel] = useState<SidePanelState>({
        open: false,
        type: "",
    });

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
            <SidePanel openSidePanel={openSidePanel} setOpenSidePanel={setOpenSidePanel} />
        </section>
    );
}
