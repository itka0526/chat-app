import { useState } from "react";
import { FocusableOptions, SidePanelStateTypes, changeFocusArgs } from "../../../types";
import { MainPanel } from "./MainPanel";
import { MultiStep } from "../Shared/MultiStep/MultiStep";
import { useMultiStep } from "../../hooks/useMultiStep";
import { useHandleNewGroupStates } from "../../hooks/useHandleNewGroupStates";
import { FirstWindow } from "./LeftBarPanels/FirstWindow";
import { SecondWindow } from "./LeftBarPanels/SecondWindow";
import { User } from "firebase/auth";

export function LeftBar({ changeFocus, user }: { changeFocus: (args: changeFocusArgs) => void; user: User }) {
    const { newGroup, newGroupName, setNewGroup, setNewGroupName } = useHandleNewGroupStates();

    const { multiStepState, next, previous, setCount } = useMultiStep();

    const [windowType, setWindowType] = useState<SidePanelStateTypes>("");

    return (
        <section
            id="nothing"
            className="
                    transition-transform duration-300 w-1/4 max-md:min-w-[100vw] bg-yellow-500
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
                    args={{ newGroup, newGroupName, setNewGroupName, user }}
                    windowType={windowType}
                    setWindowType={setWindowType}
                    nextWindow={next}
                    previousWindow={previous}
                />
            </MultiStep>
        </section>
    );
}
