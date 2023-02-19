import { ArrowRight } from "react-feather";

// next function is from useAddNewMembers hook
export function StepControlButton({ next }: { next: () => void }) {
    return (
        <button
            onClick={next}
            title="send"
            className="
                            absolute bottom-5 right-5 cursor-pointer
                            bg-blue-600 hover:brightness-110 transition-[filter]
                            w-14 aspect-square rounded-full
                            flex justify-center items-center
                            "
        >
            <ArrowRight width={28} height={28} color="white" />
        </button>
    );
}
