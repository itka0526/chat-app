import { ArrowRight } from "react-feather";

// next function is from useAddNewMembers hook
export function StepControlButton({ next }: { next: () => void }) {
    return (
        <button
            onClick={next}
            title="send"
            className="
                            absolute bottom-5 right-5
                            bg-blue-600 hover:brightness-110 transition-[filter]
                            h-12 w-12 rounded-full
                            flex justify-center items-center
                            "
        >
            <ArrowRight width={25} height={25} color="white" />
        </button>
    );
}
