// parent class must be relative

import { PropsWithChildren } from "react";
import { SidePanelState } from "../../../../types";
import { SidePanelTopTitle } from "./SidePanelTopTitle";
import { GoBack } from "../GoBack";
import { TopBar } from "../TopBar";

export function SidePanel({
    zIndex,
    children,
    openSidePanel: { open, type },
    handleBack,
}: PropsWithChildren & {
    zIndex: "0" | "10" | "20" | "30" | "40" | "50";
    handleBack: () => void;
    openSidePanel: SidePanelState;
    setOpenSidePanel: React.Dispatch<React.SetStateAction<SidePanelState>>;
}) {
    return (
        <div
            className={`
            z-${zIndex}
            absolute h-full w-full bg-slate-500
            ${open === false ? "translate-x-full" : "translate-x-0"} transition-transform
            grid grid-rows-[3.5rem,1fr]
                `}
        >
            <TopBar>
                <SidePanelTopTitle titleType={type}>
                    <GoBack onArrowClick={handleBack} />
                </SidePanelTopTitle>
            </TopBar>
            <div>{children}</div>
        </div>
    );
}
