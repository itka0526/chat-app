import { TopTitleProps } from "../../../../types";

export function SidePanelTopTitle({ children, titleType }: TopTitleProps) {
    const title =
        titleType === "new_group" ? "Add members" : titleType === "new_friend" ? "Add friend" : titleType === "new_group_2" ? "New Group" : "";

    return (
        <div className="go-back w-full h-full flex items-center px-4">
            {children}
            <div className="px-5 ">
                <span className="font-semibold text-xl">{title}</span>
            </div>
        </div>
    );
}
