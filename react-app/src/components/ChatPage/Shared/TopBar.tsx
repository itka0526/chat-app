//add this class to parent element `grid grid-rows-[3.5rem,1fr]`

export function TopBar({ children }: React.PropsWithChildren) {
    return <div className="bg-white">{children}</div>;
}
