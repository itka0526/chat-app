import { useContext } from "react";
import { SocketIOContext } from "../../Chat";
import { ServerUser } from "../../../../serverTypes";
import { GradientDelimiter } from "../../Shared/GradientDelimiter";
import { useAddNewMembers } from "../../../hooks/useAddNewMembers";
import { AddingNewMembers } from "./AddingNewMembers/AddingNewMembers";
import { ManageNewMembers } from "./AddingNewMembers/ManageNewMembers";
import { ArrowRight } from "react-feather";

export function NewGroup() {
    const socket = useContext(SocketIOContext);
    // const { friends } = useListOfFriends(socket);

    const friends: ServerUser[] = Array(2);

    friends[0] = {
        // remove this shit
        email: "imback0526",
        displayName: "Im Back",
        profileImageURL: "https://lh3.googleusercontent.com/a/AEdFTp5_LUXPicx8mw8BEZVdqfy2dKrxbEmN24VnqijE=s96-c",
    };
    friends[1] = {
        // remove this shit
        email: "itka0526",
        displayName: "Itgelt Gankhulug",
        profileImageURL: "https://lh3.googleusercontent.com/a/AEdFTp6jEVJSm9w83ND8QRX1vLaUvemosxWLCN6CP4Ag=s96-c",
    };

    const { members, modify, send } = useAddNewMembers({ friends });

    return (
        <div className=" h-full w-full flex flex-col relative">
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
