import { SidePanelState } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";
import { NewGroup } from "./SidePanelComponents/NewGroup";
import { NewFriend } from "./SidePanelComponents/NewFriend";
import { SidePanelTopTitle } from "./SidePanelTopTitle";

export function SidePanel({
    openSidePanel: { open, type },
    setOpenSidePanel,
}: {
    openSidePanel: SidePanelState;
    setOpenSidePanel: React.Dispatch<React.SetStateAction<SidePanelState>>;
}) {
    const handleBack = () => setOpenSidePanel({ open: false, type: "" });

    return (
        <div
            id="side-panel"
            className={`
            absolute w-full h-full bg-slate-500
            ${!open && "translate-x-full"} transition-transform
            grid grid-rows-[3.5rem,1fr]
            `}
        >
            <TopBar>
                <SidePanelTopTitle titleType={type}>
                    <GoBack onArrowClick={handleBack} />
                </SidePanelTopTitle>
            </TopBar>
            <div>{type === "new_group" ? <NewGroup /> : type === "new_friend" ? <NewFriend /> : <div />}</div>
        </div>
    );
}
