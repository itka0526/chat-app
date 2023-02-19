import { useState } from "react";
import { GradientDelimiter } from "../../Shared/GradientDelimiter";
import { useDebounce } from "../../../hooks/useDebounce";
import { AddingNewFriend } from "./AddingNewFriend";

export function NewFriend() {
    const [rawInput, setRawInput] = useState("");
    const input = useDebounce(rawInput, 1000);

    return (
        <div className=" h-full w-full flex flex-col overflow-y-auto">
            <div className="w-full bg-white pt-1 pb-2 h-11">
                <input
                    placeholder="Search with email..."
                    className="focus:outline-none w-full h-full px-4"
                    onChange={(e) => setRawInput(e.target.value)}
                />
            </div>
            <GradientDelimiter />
            <AddingNewFriend input={input} />
        </div>
    );
}
