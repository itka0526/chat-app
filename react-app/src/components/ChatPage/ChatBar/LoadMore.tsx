import { ArrowUp } from "react-feather";

export function LoadMore(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="h-0 translate-y-8 w-full sticky bottom-0 flex justify-center items-center transition-all">
            <div
                className="absolute overflow-hidden bg-white custom-shadow rounded-full p-1 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                {...props}
            >
                <ArrowUp className="w-8 h-8" />
            </div>
        </div>
    );
}
