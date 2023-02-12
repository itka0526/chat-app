import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export const Model = () => {
    const model = useLoader(GLTFLoader, "/final.glb");
    const ref = useRef(null);

    useEffect(() => {
        const gr = ref.current as unknown as THREE.Group;
        gr.position.set(0, 1.35, 0);
    }, [ref]);

    const { camera } = useThree();

    camera.position.set(-1.4, 2.35, -5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    let mixer: THREE.AnimationMixer;
    if (model.animations.length) {
        mixer = new THREE.AnimationMixer(model.scene);
        model.animations.map((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
        });
    }

    useFrame((_, delta) => {
        const gr = ref.current as unknown as THREE.Group;
        gr.rotation.x -= 0.000025;
        gr.rotation.y -= 0.0005125;
        gr.rotation.z += 0.000125;
        mixer?.update(delta);
    });

    model.scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.side = THREE.FrontSide;
        }
    });

    return (
        <Suspense fallback={null}>
            <primitive ref={ref} object={model.scene} />
        </Suspense>
    );
};
