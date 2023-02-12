import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAppAuth } from "../../firebase";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Model } from "./Model";

export function Login() {
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(firebaseAppAuth, provider);
    };

    return (
        <main className="h-screen w-screen overflow-hidden touch-none">
            <Canvas>
                <ambientLight intensity={0.7} />
                <Physics gravity={[0, 0, 0]}>
                    <Model />
                </Physics>
            </Canvas>
            <button
                title="Sign with google"
                className="
                            fixed z-10
                            bottom-[30%] left-1/2 -translate-x-1/2
                            border-2 px-10 py-2 lg:py-1 rounded-lg border-[#61DBFB]
                            text-lg text-[#61DBFB] font-semibold
                            custom-react-button transition-all
                            hover:translate-y-[-2px]
                            "
                onClick={signInWithGoogle}
            >
                Sign In
            </button>
        </main>
    );
}
