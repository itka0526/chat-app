import { PossibleArgs } from "../../../../../types";
import { UserListItem } from "../../../Shared/UserListItem";
import { StepControlButton } from "./StepControlButton";

export function AddingChatName({
    newGroup,
    newGroupName,
    setNewGroupName,
    nextStep,
}: {
    newGroup: PossibleArgs["newGroup"] | undefined;
    newGroupName: PossibleArgs["newGroupName"] | undefined;
    setNewGroupName: PossibleArgs["setNewGroupName"] | undefined;
    nextStep: () => void;
}) {
    const canGoNext = () => newGroupName?.length !== 0 && nextStep();

    return (
        <div className="bg-white min-h-full w-full flex flex-col p-2">
            <div className="mt-2 w-full h-14 border rounded-md overflow-hidden bg-[var(--custom-grey)]">
                <input
                    placeholder="Group Name"
                    className="focus:outline-none w-full h-full px-2 text-lg"
                    onChange={(e) => setNewGroupName && setNewGroupName(e.target.value)}
                />
            </div>
            <div className="mt-2 mb-1 px-1 select-none">
                <span className="text-blue-600">{newGroup?.filter((member) => member.added).length} member</span>
            </div>
            <div className="bg-white overflow-y-auto max-h-full">
                <ul className="w-full h-full pb-2">
                    {newGroup?.map((member, idx) => member.added && <UserListItem key={`listed-member-${member.email}-${idx}`} user={member} />)}
                </ul>
            </div>
            <StepControlButton next={canGoNext} />
        </div>
    );
}
