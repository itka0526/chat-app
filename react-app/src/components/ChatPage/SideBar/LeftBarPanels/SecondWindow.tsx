import { useContext } from "react";
import { PossibleArgs, SidePanelController, SidePanelStateTypes } from "../../../../types";
import { SocketIOContext } from "../../Chat";
import { GoBack } from "../../Shared/GoBack";
import { SidePanelTopTitle } from "../../Shared/SidePanel/SidePanelTopTitle";
import { TopBar } from "../../Shared/TopBar";
import { AddingChatName } from "../SidePanelComponents/AddingNewMembers/AddingChatName";

export const SecondWindow = ({
    args,
    windowType,
    setWindowType,
    previousWindow,
}: SidePanelController & { args?: PossibleArgs; windowType: SidePanelStateTypes }) => {
    const goBack = () => {
        previousWindow();
        if (windowType === "new_group_2") {
            setWindowType("new_group");
        }
    };

    const socket = useContext(SocketIOContext);

    const nextStep = () => {
        const admin = args?.user?.email,
            chatName = args?.newGroupName,
            members = args?.newGroup?.filter((member) => member.added).map((member) => member.email);

        if (!admin || !chatName || !members || members?.length === 0) return;
        // go back by two windows
        previousWindow();
        previousWindow();
        // it should fix the flickering when transitioning to the initial state assuming each transition takes about 150ms

        setTimeout(() => setWindowType(""), 400);

        socket?.emit("create_group", { admin, chatName, members });
    };

    return (
        <>
            <TopBar>
                <SidePanelTopTitle titleType={windowType}>
                    <GoBack onArrowClick={goBack} />
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
