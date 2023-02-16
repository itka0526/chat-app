import { useState } from "react";
import { NewGroupMember } from "../../types";
import { ServerUser } from "../../serverTypes";

export function useAddNewMembers({ friends }: { friends: ServerUser[] }) {
    const [members, setMembers] = useState<NewGroupMember[]>(() =>
        friends.map(
            (friend) =>
                ({
                    ...friend,
                    added: false,
                } as NewGroupMember)
        )
    );

    const modify = (email: string, value: boolean) => {
        setMembers((members) => {
            return members.map((member) => {
                if (email === member.email) member.added = value;
                return member;
            });
        });
    };

    const send = () => {
        console.log(members.filter((member) => member.added === true));
    };

    return { members, modify, send };
}
