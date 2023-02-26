import { ArrowUp } from "react-feather";

export function LoadMore(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="h-0 translate-y-8 w-full sticky bottom-0 flex justify-center items-center transition-all">
            <div
                className="absolute overflow-hidden bg-white custom-shadow rounded-full p-2 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                {...props}
            >
                <ArrowUp width={28} height={28} />
            </div>
        </div>
    );
}
