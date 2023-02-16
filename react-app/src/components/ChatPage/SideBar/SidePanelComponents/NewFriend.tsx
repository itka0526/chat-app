import { useState } from "react";
import { GradientDelimiter } from "../../Shared/GradientDelimiter";
import { useDebounce } from "../../../hooks/useDebounce";
import { AddingNewFriend } from "./AddingNewFriend";

export function NewFriend() {
    const [rawInput, setRawInput] = useState("");
    const input = useDebounce(rawInput, 1000);

    return (
        <div className=" h-full w-full flex flex-col">
            <div className="w-full bg-white pt-1 pb-2">
                <input
                    autoFocus={true}
                    placeholder="Search with email..."
                    className="h-10 focus:outline-none w-full px-4"
                    onChange={(e) => setRawInput(e.target.value)}
                ></input>
            </div>
            <GradientDelimiter />
            <div className="bg-white grow">{<AddingNewFriend input={input} />}</div>
        </div>
    );
}
