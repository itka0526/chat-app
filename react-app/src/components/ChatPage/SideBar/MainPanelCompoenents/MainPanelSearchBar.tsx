import { Search } from "react-feather";

export function MainPanelSearchBar({ rawInput, handleChange }: { rawInput: string; handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="py-2 px-4 h-full w-full">
            <div className="border border-slate-300 rounded-full overflow-hidden w-full h-full relative main-panel-search-bar">
                <Search className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-blue-600`} />
                <input className="w-full h-full outline-none pl-12 " placeholder="Search" value={rawInput} onChange={handleChange}></input>
            </div>
        </div>
    );
}
