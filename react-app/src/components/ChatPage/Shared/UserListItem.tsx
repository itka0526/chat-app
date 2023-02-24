import { PropsWithChildren } from "react";
import { DatabaseUser } from "../../../serverTypes";

export function UserListItem({
    children,
    user: { email, displayName, profileImageURL },
    hoverEffect = true,
}: PropsWithChildren & { user: DatabaseUser; hoverEffect?: boolean }) {
    return (
        <li
            className={`flex items-center h-14 w-full rounded-md ${
                hoverEffect ? "hover:bg-slate-100" : ""
            } cursor-pointer select-none transition-colors`}
        >
            <img draggable={false} src={profileImageURL} className="rounded-full h-11 w-11 ml-2 mr-3" />
            <div className="flex flex-col whitespace-nowrap text-ellipsis overflow-hidden">
                <span className="font-medium">{displayName}</span>
                <span className="opacity-95 text-sm pl-2">{email}</span>
            </div>
            <div className="grow flex justify-end pr-2 ">{children}</div>
        </li>
    );
}
