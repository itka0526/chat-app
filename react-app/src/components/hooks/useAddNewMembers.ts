import { useEffect, useState } from "react";
import { NewGroupMember, SidePanelState, UseAddNewMembersSteps } from "../../types";
import { ServerUser } from "../../serverTypes";

export function useAddNewMembers({
    friends,
    chatName,
    handleStep,
}: {
    friends: ServerUser[];
    chatName: string;
    handleStep: React.Dispatch<React.SetStateAction<SidePanelState>>;
}) {
    const [members, setMembers] = useState<NewGroupMember[]>([]);
    const [step, setStep] = useState<UseAddNewMembersSteps>("chat_1");

    useEffect(() => {
        setMembers(
            friends.map(
                (friend) =>
                    ({
                        ...friend,
                        added: false,
                    } as NewGroupMember)
            )
        );
    }, [friends]);

    useEffect(() => {
        // I am a bad developer i dont want to refactor
        localStorage.setItem("members", JSON.stringify(members));
        window.dispatchEvent(new Event("members-updated-event"));
    }, [members]);

    useEffect(() => {
        handleStep({ open: step === "chat_2", type: step });
    }, [step]);

    const modify = (email: string, value: boolean) => {
        setMembers((members) => {
            return members.map((member) => {
                if (email === member.email) member.added = value;
                return member;
            });
        });
    };

    const send = () => {
        const addedMembers = members.filter((member) => {
            if (member.added === true) return member.email;
        });

        console.log(chatName, addedMembers);
    };

    const next = () => {
        switch (step) {
            case "chat_1":
                setStep("chat_2");
                break;
            case "chat_2":
                setStep("chat_1");
                break;
        }
    };

    return { members, modify, send, next, step };
}
