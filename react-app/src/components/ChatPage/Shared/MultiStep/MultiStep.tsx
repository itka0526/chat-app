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
                  bg-purple-700 transition-transform duration-300
                  grid grid-rows-[3.5rem,1fr]
                        before:absolute before:inset-0 before:h-full
                        before:w-full before:bg-black before:transition-opacity
                        before:pointer-events-none before:z-10 
                    ${index + 1 === visibleStep ? "before:opacity-0" : "before:opacity-10"}
                  `}
        >
            {children}
        </aside>
    );
}
