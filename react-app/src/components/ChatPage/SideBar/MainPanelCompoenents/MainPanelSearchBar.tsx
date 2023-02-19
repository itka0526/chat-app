import { useEffect, useState } from "react";
import { Search } from "react-feather";

export function MainPanelSearchBar() {
    const [focused, setFocused] = useState(false);
    const handleFocus = () => setFocused((prev) => !prev);

    useEffect(() => console.log(focused), [focused]);

    return (
        <div className="py-2 px-4 h-full w-full">
            <div className="border border-slate-200 hover:border-slate-300 rounded-full overflow-hidden w-full h-full relative main-panel-search-bar">
                <Search className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 ${focused ? "text-blue-600" : ""} `} />
                <input
                    className="w-full h-full outline-none pl-12 "
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search"
                ></input>
            </div>
        </div>
    );
}
