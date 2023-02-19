import { PropsWithChildren, useState, Children, useEffect } from "react";
import { useMultiStepReturn } from "../../../../types";

export function MultiStep({ children, multiStepState: [visibleStep], previous, next, setCount }: PropsWithChildren & useMultiStepReturn) {
    useEffect(() => {
        setCount(Children.count(children));
    }, [Children.count(children)]);

    return (
        <>
            {Children.map(children, (child, index) => (
                <Step visibleStep={visibleStep} index={index}>
                    {child}
                </Step>
            ))}
        </>
    );
}

function Step({ index, children, visibleStep }: PropsWithChildren & { index: number; visibleStep: number }) {
    return (
        <aside
            style={{
                transform: `translateX(${(index + 1 - visibleStep) * 100}%)`,
            }}
            className={`
                  absolute h-full w-full
                  bg-purple-700 transition-transform
                  grid grid-rows-[3.5rem,1fr]
                  `}
        >
            {children}
        </aside>
    );
}
