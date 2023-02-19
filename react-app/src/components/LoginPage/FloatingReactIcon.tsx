import { Physics } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";

export default function FloatingReactIcon() {
    // this component is throwing this error 'react_devtools_backend.js:4012 TypeError: Cannot set properties of undefined (setting 'hook')'
    // i think its trying to link itself to the dom but react unmounts on condition
    return (
        <Canvas>
            <ambientLight intensity={0.7} />
            <Physics gravity={[0, 0, 0]}>
                <Model />
            </Physics>
        </Canvas>
    );
}
