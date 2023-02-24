import { UIMessage } from "../../../serverTypes";

export function MessageItem({ show, message }: { show: boolean; message: UIMessage }) {
    return (
        <div className={`w-full px-2 md:px-16 grow-0 shrink-0 ${show ? "pt-[2px] pb-2" : "p-[2px]"}`}>
            <div className="grid h-full w-full grid-cols-[2.75rem,auto] gap-x-2">
                {
                    <div className="flex items-end justify-center">
                        {show && <img draggable={false} src={message.profileImageURL} className="rounded-full h-11 w-11" />}
                    </div>
                }
                <div className="flex grow-0">
                    <div className="flex flex-col bg-white h-full p-1 px-2 rounded-lg border border-[var(--custom-grey)]">
                        {show && <span className="text-sm font-medium">{message.displayName}</span>}
                        <span>{message.text}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
