import { Icon, UserPlus, Users } from "react-feather";
import { SidePanelController, SidePanelStateTypes } from "../../../../types";

export const MenuOptions = ({
    open,
    setWindowType,
    nextWindow,
}: Partial<SidePanelController> & {
    open: boolean;
}) => {
    return (
        <div
            className={`
             ${open ? "scale-100 -translate-y-8" : "scale-0 translate-x-24 translate-y-1"} transition-transform
             absolute top-[-50px] left-[-155px]
             w-52 p-2 bg-white rounded-md
              select-none custom-shadow`}
        >
            <ul className="text-sm font-medium">
                <MenuOption CustomIcon={UserPlus} type="new_friend" text="Add Friend" setWindowType={setWindowType} nextWindow={nextWindow} />
                <MenuOption CustomIcon={Users} type="new_group" text="New Group" setWindowType={setWindowType} nextWindow={nextWindow} />
            </ul>
        </div>
    );
};

const MenuOption = ({
    CustomIcon,
    type,
    text,
    setWindowType,
    nextWindow,
}: Partial<SidePanelController> & {
    CustomIcon: Icon;
    type: SidePanelStateTypes;
    text: string;
}) => {
    return (
        <li
            className="hover:brightness-75 transition-[filter] bg-white rounded-md py-1 flex items-center cursor-pointer"
            onClick={() => {
                setWindowType && setWindowType(type);
                nextWindow && nextWindow();
            }}
        >
            <CustomIcon width={20} height={20} className="mx-4" />
            <span className="grow-1">{text}</span>
        </li>
    );
};
