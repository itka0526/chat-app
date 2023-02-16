import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { ServerUser } from "../../../../serverTypes";
import { GradientDelimiter } from "../../Shared/GradientDelimiter";
import { useAddNewMembers } from "../../../hooks/useAddNewMembers";
import { AddingNewMembers } from "./AddingNewMembers/AddingNewMembers";
import { ManageNewMembers } from "./AddingNewMembers/ManageNewMembers";
import { ArrowRight } from "react-feather";
import { useListOfFriends } from "../../../hooks/useListOfFriends";

export function NewGroup() {
    const socket = useContext(SocketIOContext);
    const { friends } = useListOfFriends(socket);

    const { members, modify, send } = useAddNewMembers({ friends });

    return (
        <div className="h-full w-full flex flex-col relative">
            <ManageNewMembers members={members} modify={modify} />
            <GradientDelimiter />
            <AddingNewMembers members={members} modify={modify} />
            <button
                onClick={send}
                title="send"
                className="
                            absolute bottom-5 right-5
                            bg-blue-600 hover:brightness-110 transition-[filter]
                            h-12 w-12 rounded-full
                            flex justify-center items-center
                            "
            >
                <ArrowRight width={25} height={25} color="white" />
            </button>
        </div>
    );
}
