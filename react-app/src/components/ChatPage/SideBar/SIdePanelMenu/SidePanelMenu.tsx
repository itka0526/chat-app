import { useState } from "react";
import { Edit3, X, Users } from "react-feather";
import { SidePanelController, SidePanelStateTypes } from "../../../../types";
import { MenuOptions } from "./MenuOptions";

export function SidePanelMenu({ setWindowType, nextWindow }: Partial<SidePanelController>) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((prev) => !prev);

    return (
        <div className="absolute bottom-5 right-5" onClick={handleOpen}>
            <div
                className="
                bg-blue-600 w-14
                  hover:brightness-110 transition-[filter]
                  aspect-square rounded-full
                  cursor-pointer
                  "
            >
                <Edit3
                    color="white"
                    width={28}
                    height={28}
                    className={`translate-x-[-1px] absolute m-auto inset-0 transition-transform ${open && "scale-0"}`}
                />
                <X color="white" width={32} height={32} className={`absolute m-auto inset-0 transition-transform ${!open && "scale-0"}`} />
            </div>
            <MenuOptions open={open} setWindowType={setWindowType} nextWindow={nextWindow} />
        </div>
    );
}
