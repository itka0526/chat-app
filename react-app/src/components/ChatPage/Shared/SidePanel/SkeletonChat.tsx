export function SkeletonChat() {
    const Skeleton = () => (
        <li className={`flex items-center min-h-[3.5rem] w-full rounded-md cursor-pointer select-none px-2 my-2`}>
            <div className="flex w-full whitespace-nowrap text-ellipsis overflow-hidden gap-4 ">
                <div className="rounded-full h-12    aspect-square bg-gray-200 "></div>
                <div role="status" className=" w-full h-full animate-pulse">
                    <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full  w-5/6 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
                </div>
            </div>
        </li>
    );
    return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );
}
