export const CheckBox = ({ checked }: { checked: boolean }) => {
    return (
        <div className="w-5 h-5 border-2 border-slate-300 overflow-hidden grid content-center rounded-md">
            <input
                type="checkbox"
                defaultChecked={true}
                className={`${checked ? "" : "scale-0"} transition-transform w-4 h-4 rounded-md text-blue-600`}
            />
        </div>
    );
};
