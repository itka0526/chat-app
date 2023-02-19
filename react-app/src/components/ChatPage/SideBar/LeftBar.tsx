import { useState } from "react";
import { FocusableOptions, NewGroupMember, PossibleArgs, SidePanelController, SidePanelStateTypes } from "../../../types";
import { MainPanel } from "./MainPanel";
import { SidePanel } from "../Shared/SidePanel/SidePanel";
import { NewGroup } from "./SidePanelComponents/NewGroup";
import { NewFriend } from "./SidePanelComponents/NewFriend";
import { AddingChatName } from "./SidePanelComponents/AddingNewMembers/AddingChatName";
import { MultiStep } from "../Shared/MultiStep/MultiStep";
import { useMultiStep } from "../../hooks/useMultiStep";
import { TopBar } from "../Shared/TopBar";
import { SidePanelTopTitle } from "../Shared/SidePanel/SidePanelTopTitle";
import { GoBack } from "../Shared/GoBack";
import { useHandleNewGroupStates } from "../../hooks/useHandleNewGroupStates";

export function LeftBar({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    const { newGroup, newGroupName, setNewGroup, setNewGroupName } = useHandleNewGroupStates();

    const { multiStepState, next, previous, setCount } = useMultiStep();

    const [windowType, setWindowType] = useState<SidePanelStateTypes>("");

    return (
        <section
            className="
                    transition-transform w-1/4 max-md:min-w-[100vw] bg-yellow-500
                    relative overflow-hidden
                    "
        >
            <MainPanel changeFocus={changeFocus} nextWindow={next} previousWindow={previous} setWindowType={setWindowType} />
            <MultiStep multiStepState={multiStepState} next={next} previous={previous} setCount={setCount}>
                <FirstWindow
                    args={{ newGroup, setNewGroup }}
                    windowType={windowType}
                    setWindowType={setWindowType}
                    nextWindow={next}
                    previousWindow={previous}
                />
                <SecondWindow
                    args={{ newGroup, newGroupName, setNewGroupName }}
                    windowType={windowType}
                    setWindowType={setWindowType}
                    nextWindow={next}
                    previousWindow={previous}
                />
            </MultiStep>
        </section>
    );
}

const FirstWindow = ({
    args,
    windowType,
    setWindowType,
    nextWindow,
    previousWindow,
}: SidePanelController & {
    args?: PossibleArgs;
    windowType: SidePanelStateTypes;
}) => {
    const reset = () => {
        previousWindow();
        setTimeout(() => setWindowType(""), 150);
    };

    return (
        <>
            <TopBar>
                <SidePanelTopTitle titleType={windowType}>
                    <GoBack onArrowClick={reset} />
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

const SecondWindow = ({
    args,
    windowType,
    setWindowType,
    previousWindow,
}: SidePanelController & { args?: PossibleArgs; windowType: SidePanelStateTypes }) => {
    const reset = () => {
        previousWindow();
        if (windowType === "new_group_2") {
            setWindowType("new_group");
        }
    };

    const nextStep = () => {
        // go back by two windows
        previousWindow();
        previousWindow();
        // it should fix the flickerign when transitioning to the initial state assuming each transition takes about 150ms

        setTimeout(() => setWindowType(""), 400);
    };

    return (
        <>
            <TopBar>
                <SidePanelTopTitle titleType={windowType}>
                    <GoBack onArrowClick={reset} />
                </SidePanelTopTitle>
            </TopBar>
            {windowType.startsWith("new_group") ? (
                <AddingChatName
                    newGroup={args?.newGroup}
                    newGroupName={args?.newGroupName}
                    setNewGroupName={args?.setNewGroupName}
                    nextStep={nextStep}
                />
            ) : (
                <div />
            )}
        </>
    );
};
