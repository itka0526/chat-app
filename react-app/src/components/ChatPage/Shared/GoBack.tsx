import { ArrowLeft } from "react-feather";
import { FocusableOptions, changeFocusArgs } from "../../../types";

export function GoBack({
    extraClasses = "",
    onArrowClick,
    onArrowClickArgs,
}: {
    extraClasses?: string;
    onArrowClickArgs?: changeFocusArgs | any;
    onArrowClick: (args: changeFocusArgs) => void | any;
}) {
    return (
        <div onClick={() => onArrowClick(onArrowClickArgs)} className={`hover:cursor-pointer ${extraClasses}`}>
            <ArrowLeft />
        </div>
    );
}
