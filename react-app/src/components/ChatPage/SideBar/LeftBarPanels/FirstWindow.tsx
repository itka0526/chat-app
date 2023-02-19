import { PossibleArgs, SidePanelController, SidePanelStateTypes } from "../../../../types";
import { GoBack } from "../../Shared/GoBack";
import { SidePanelTopTitle } from "../../Shared/SidePanel/SidePanelTopTitle";
import { TopBar } from "../../Shared/TopBar";
import { NewFriend } from "../SidePanelComponents/NewFriend";
import { NewGroup } from "../SidePanelComponents/NewGroup";

export const FirstWindow = ({
    args,
    windowType,
    setWindowType,
    nextWindow,
    previousWindow,
}: SidePanelController & {
    args?: PossibleArgs;
    windowType: SidePanelStateTypes;
}) => {
    const goBack = () => {
        previousWindow();
        setTimeout(() => setWindowType(""), 150);
    };

    return (
        <>
            <TopBar>
                <SidePanelTopTitle titleType={windowType}>
                    <GoBack onArrowClick={goBack} />
                </SidePanelTopTitle>
            </TopBar>
            {windowType.startsWith("new_group") ? (
                <NewGroup
                    newGroup={args?.newGroup}
                    setNewGroup={args?.setNewGroup}
                    nextWindow={nextWindow}
                    previousWindow={previousWindow}
                    windowType={windowType}
                    setWindowType={setWindowType}
                />
            ) : windowType.startsWith("new_friend") ? (
                <NewFriend />
            ) : (
                <div />
            )}
        </>
    );
};
