import { ArrowLeft } from "react-feather";
import { FocusableOptions } from "../../../types";

export function GoBack({
    extraClasses = "",
    onArrowClick,
    onArrowClickArgs,
}: {
    extraClasses?: string;
    onArrowClickArgs?: FocusableOptions | any;
    onArrowClick: (focusTo: FocusableOptions) => void | any;
}) {
    return (
        <div onClick={() => onArrowClick(onArrowClickArgs)} className={`hover:cursor-pointer ${extraClasses}`}>
            <ArrowLeft />
        </div>
    );
}
