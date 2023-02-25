import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { Chat } from "../../serverTypes";
import { NewGroupMember } from "../../types";

export function useSortMainPanel(delay: number, array: Chat[]) {
    const [rawInput, setRawInput] = useState("");
    const [filteredData, setFilteredData] = useState<Chat[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setRawInput(e.target.value.toLowerCase());

    const delayedInput = useDebounce(rawInput, delay);

    useEffect(() => {
        if (!delayedInput || delayedInput.length <= 1) return setFilteredData(array);

        const result = array.filter((data) => data.chatName.search(delayedInput) != -1);

        setFilteredData(result);
    }, [delayedInput, array]);

    return { rawInput, handleChange, delayedInput, filteredData };
}

export function useSortNewGroup(delay: number, array: NewGroupMember[]) {
    const [rawInput, setRawInput] = useState("");
    const [filteredData, setFilteredData] = useState<NewGroupMember[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setRawInput(e.target.value.toLowerCase());

    const delayedInput = useDebounce(rawInput, delay);

    useEffect(() => {
        if (!delayedInput || delayedInput.length <= 1) return setFilteredData(array);

        const result = array.filter((data) => data.email.search(delayedInput) != -1 || data.displayName.search(delayedInput) != -1);

        setFilteredData(result);
    }, [delayedInput, array]);

    return { rawInput, handleChange, delayedInput, filteredData };
}
