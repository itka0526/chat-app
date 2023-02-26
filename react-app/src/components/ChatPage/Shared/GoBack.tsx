import { ArrowLeft } from "react-feather";

export function GoBack({
    extraClasses = "",
    onArrowClick,
    onArrowClickArgs,
}: {
    extraClasses?: string;
    onArrowClickArgs?: any;
    onArrowClick: (args: any) => void | any;
}) {
    return (
        <div onClick={() => onArrowClick(onArrowClickArgs)} className={`hover:cursor-pointer ${extraClasses}`}>
            <ArrowLeft height={28} width={28} />
        </div>
    );
}
