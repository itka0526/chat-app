import { useState } from "react";
import { FocusableOptions, NecessaryMainPanelProps, PossiblePanelStates, SidePanelStateTypes, useChat } from "../../../types";
import { MainPanel } from "./MainPanel";
import { MultiStep } from "../Shared/MultiStep/MultiStep";
import { useMultiStep } from "../../hooks/useMultiStep";
import { useHandleNewGroupStates } from "../../hooks/useHandleNewGroupStates";
import { FirstWindow } from "./LeftBarPanels/FirstWindow";
import { SecondWindow } from "./LeftBarPanels/SecondWindow";
import { User } from "firebase/auth";

type LeftBarProps = {
    user: User;
    useChat: useChat;
    panelStates: PossiblePanelStates;
    changeFocus: ({ focusTo }: FocusableOptions) => void;
    necessaryMainPanelProps: NecessaryMainPanelProps;
};

export function LeftBar({ necessaryMainPanelProps, panelStates, changeFocus, user, useChat }: LeftBarProps) {
    const { newGroup, newGroupName, setNewGroup, setNewGroupName } = useHandleNewGroupStates();

    const { multiStepState, next, previous, setCount } = useMultiStep();

    const [windowType, setWindowType] = useState<SidePanelStateTypes>("");

    return (
        <section
            className={`
                    ${
                        panelStates.first === "0%"
                            ? "max-md:translate-x-0"
                            : panelStates.first === "-100%"
                            ? "max-md:-translate-x-full"
                            : panelStates.first === "-200%"
                            ? "max-md:-translate-x-[200%]"
                            : ""
                    }
                    transition-transform duration-300 bg-yellow-500
                    relative overflow-hidden
                    `}
        >
            <MainPanel
                necessaryMainPanelProps={necessaryMainPanelProps}
                changeFocus={changeFocus}
                useChat={useChat}
                nextWindow={next}
                previousWindow={previous}
                setWindowType={setWindowType}
            />
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
