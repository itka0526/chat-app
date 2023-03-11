import { useContext, useState } from "react";
import { SocketIOContext } from "../Chat";
import { createPortal } from "react-dom";
import { Chat } from "../../../serverTypes";
import { GradientDelimiter } from "../Shared/GradientDelimiter";
import { X } from "react-feather";

type DeleteGroup = {
    currentChat: Chat;
};

export function DeleteGroup({ currentChat }: DeleteGroup) {
    const socket = useContext(SocketIOContext);

    const [dialogState, setDialogState] = useState(false);
    const openDialog = () => setDialogState(true);
    const closeDialog = () => setDialogState(false);

    const handleRequest = () => {
        socket?.emit("delete_group", currentChat.id);
    };

    return (
        <>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 ">
                <button
                    className="text-red-400 hover:text-red-500 transition-colors font-semibold text-lg cursor-pointer select-none"
                    onClick={openDialog}
                >
                    Delete Group
                </button>
            </div>
            {dialogState &&
                createPortal(
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border max-md:w-4/5 w-2/5 rounded-md z-50 cover-bg-shadow bg-white ">
                        <div className="w-full flex flex-col items-center">
                            <div className="flex w-full justify-center items-center py-2 relative">
                                <span className="text-red-400 text-lg font-semibold">Delete "{currentChat.chatName}"</span>
                                <div
                                    className="absolute right-3 hover:bg-gray-100 transition-colors rounded-full p-1 cursor-pointer"
                                    onClick={closeDialog}
                                >
                                    <X />
                                </div>
                            </div>
                            <span className="border-t border-[#ccc] w-full h-0"></span>
                            <div className="flex flex-col px-4 pt-3 pb-2 w-full">
                                <h3>This action will do the following: </h3>
                                <div className="pl-12 my-1">
                                    <p className="before:content-['*'] before:text-red-400"> Delete all messages </p>
                                    <p className="before:content-['*'] before:text-red-400"> Kick all members </p>
                                </div>
                            </div>
                            <div className="grid gap-3 grid-cols-2 items-center justify-center text-base mb-2">
                                <button className=" px-4 py-1 rounded-md text-blue-600 hover:bg-gray-100 transition-colors " onClick={closeDialog}>
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-1 rounded-md text-white bg-red-400"
                                    onClick={() => {
                                        handleRequest();
                                        closeDialog();
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById("root") as HTMLElement
                )}
        </>
    );
}
