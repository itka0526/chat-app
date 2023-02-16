import { Icon, UserPlus, Users } from "react-feather";
import { SidePanelState, SidePanelStateTypes } from "../../../../types";

export const MenuOptions = ({
    open,
    setOpenSidePanel,
}: {
    open: boolean;
    setOpenSidePanel: React.Dispatch<React.SetStateAction<SidePanelState>>;
}) => {
    return (
        <div
            className={`
             ${open ? "scale-100 -translate-y-8" : "scale-0 translate-x-24 translate-y-1"} transition-transform
             absolute top-[-50px] left-[-155px]
             w-52 p-2 bg-white rounded-md
             shadow-md select-none`}
        >
            <ul className="text-sm font-medium">
                <MenuOption CustomIcon={UserPlus} type="new_friend" text="Add Friend" setOpenSidePanel={setOpenSidePanel} />
                <MenuOption CustomIcon={Users} type="new_group" text="New Group" setOpenSidePanel={setOpenSidePanel} />
            </ul>
        </div>
    );
};

const MenuOption = ({
    CustomIcon,
    type,
    text,
    setOpenSidePanel,
}: {
    CustomIcon: Icon;
    type: SidePanelStateTypes;
    text: string;
    setOpenSidePanel: React.Dispatch<React.SetStateAction<SidePanelState>>;
}) => {
    return (
        <li
            className="hover:brightness-75 transition-[filter] bg-white rounded-md py-1 flex items-center cursor-pointer"
            onClick={() => {
                setOpenSidePanel({ open: true, type: type });
            }}
        >
            <CustomIcon width={20} height={20} className="mx-4" />
            <span className="grow-1">{text}</span>
        </li>
    );
};
