import { useState } from "react";
import { useMultiStepReturn } from "../../types";

export function useMultiStep() {
    const multiStepState = useState(0);
    const [count, setCount] = useState(0);

    const next = () => multiStepState[1]((prev) => (prev + 1 <= count ? prev + 1 : prev));
    const previous = () => multiStepState[1]((prev) => (prev >= 1 ? prev - 1 : prev));

    return { multiStepState, previous, next, setCount } as useMultiStepReturn;
}
