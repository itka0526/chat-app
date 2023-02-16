import { FocusableOptions } from "../../../types";
import { GoBack } from "../Shared/GoBack";
import { TopBar } from "../Shared/TopBar";

export function ChatBar({ changeFocus }: { changeFocus: (focusTo: FocusableOptions) => void }) {
    return (
        <section
            id="nothing"
            className="
                    transition-transform
                    w-3/4
                    max-md:min-w-[100vw]
                    bg-blue-500
                    grid grid-rows-[3.5rem,1fr] 
                    "
        >
            <TopBar>
                <GoBack extraClasses="hidden max-md:block" onArrowClick={changeFocus} onArrowClickArgs={"sidebar"} />
            </TopBar>
            <div className="flex justify-center items-center">
                <span>hlleo</span>
            </div>
        </section>
    );
}
