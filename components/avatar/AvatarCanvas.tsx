"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useAvatarStore } from "@/store/avatarStore";

const MODEL_URL = "/model/eva00/eva00.vrm";

type RigBoneName =
  | "chest"
  | "head"
  | "hips"
  | "leftArm"
  | "leftShoulder"
  | "neck"
  | "rightArm"
  | "rightShoulder"
  | "spine";

type RigBones = Partial<Record<RigBoneName, THREE.Bone>>;

type RigBasePose = Partial<Record<RigBoneName, THREE.Euler>>;

function EvaModel() {
  const groupRef = useRef<THREE.Group>(null);
  const basePoseRef = useRef<RigBasePose>({});
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [morphMeshes, setMorphMeshes] = useState<THREE.Mesh[]>([]);
  const [bones, setBones] = useState<RigBones>({});
  const emotion = useAvatarStore((state) => state.emotion);
  const isSpeaking = useAvatarStore((state) => state.isSpeaking);
  const setLoadState = useAvatarStore((state) => state.setLoadState);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();

    setLoadState("loading");
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cancelled) {
          return;
        }

        const loadedScene = gltf.scene;
        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = size.y > 0 ? 3.05 / size.y : 1;

        loadedScene.scale.setScalar(scale);
        loadedScene.position.set(-center.x * scale, -box.min.y * scale - 2.12, -center.z * scale);

        const meshes: THREE.Mesh[] = [];
        const rigBones: RigBones = {};

        loadedScene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          const bone = object as THREE.Bone;

          if (mesh.isMesh) {
            mesh.frustumCulled = false;
            if (mesh.morphTargetInfluences?.length) {
              meshes.push(mesh);
            }
          }

          if (bone.isBone) {
            const name = bone.name.toLowerCase();
            const isLeft = name.includes("left") || name.includes("_l_") || name.includes(".l") || name.endsWith("_l");
            const isRight = name.includes("right") || name.includes("_r_") || name.includes(".r") || name.endsWith("_r");

            if (!rigBones.head && name.includes("head")) {
              rigBones.head = bone;
            } else if (!rigBones.neck && name.includes("neck")) {
              rigBones.neck = bone;
            } else if (!rigBones.hips && name.includes("hips")) {
              rigBones.hips = bone;
            } else if (!rigBones.chest && (name.includes("chest") || name.includes("upperchest"))) {
              rigBones.chest = bone;
            } else if (!rigBones.spine && name.includes("spine")) {
              rigBones.spine = bone;
            } else if (!rigBones.leftShoulder && isLeft && name.includes("shoulder")) {
              rigBones.leftShoulder = bone;
            } else if (!rigBones.rightShoulder && isRight && name.includes("shoulder")) {
              rigBones.rightShoulder = bone;
            } else if (!rigBones.leftArm && isLeft && (name.includes("upperarm") || name.includes("arm"))) {
              rigBones.leftArm = bone;
            } else if (!rigBones.rightArm && isRight && (name.includes("upperarm") || name.includes("arm"))) {
              rigBones.rightArm = bone;
            }
          }
        });

        const basePose: RigBasePose = {};
        Object.entries(rigBones).forEach(([name, bone]) => {
          if (bone) {
            basePose[name as RigBoneName] = bone.rotation.clone();
          }
        });
        basePoseRef.current = basePose;
        setMorphMeshes(meshes);
        setBones(rigBones);
        setScene(loadedScene);
        setLoadState("ready");
      },
      undefined,
      () => {
        if (!cancelled) {
          setLoadState("error");
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [setLoadState]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const group = groupRef.current;
    const basePose = basePoseRef.current;
    const breathing = Math.sin(time * 1.55);
    const slowSway = Math.sin(time * 0.55);
    const secondarySway = Math.sin(time * 0.9 + 1.2);
    const talking = isSpeaking || emotion === "talking";
    const happy = emotion === "happy";
    const thinking = emotion === "thinking";
    const alert = emotion === "alert";

    if (group) {
      const emotionLift = happy ? 0.075 : alert ? 0.03 : 0;
      const talkBounce = talking ? Math.sin(time * 8) * 0.035 : 0;
      const thinkingLean = thinking ? 0.075 : 0;

      group.position.y = breathing * 0.06 + emotionLift + talkBounce;
      group.position.x = slowSway * 0.035;
      group.rotation.y = slowSway * 0.11 + (alert ? Math.sin(time * 5) * 0.03 : 0);
      group.rotation.z = thinkingLean + secondarySway * 0.026;
      group.scale.setScalar(1 + breathing * 0.011);
    }

    if (bones.hips && basePose.hips) {
      bones.hips.rotation.x = basePose.hips.x + breathing * 0.018;
      bones.hips.rotation.y = basePose.hips.y - slowSway * 0.03;
      bones.hips.rotation.z = basePose.hips.z + secondarySway * 0.018;
    }

    if (bones.spine && basePose.spine) {
      bones.spine.rotation.x = basePose.spine.x + breathing * 0.035 + (thinking ? 0.035 : 0);
      bones.spine.rotation.y = basePose.spine.y + slowSway * 0.052;
      bones.spine.rotation.z = basePose.spine.z + secondarySway * 0.032;
    }

    if (bones.chest && basePose.chest) {
      bones.chest.rotation.x = basePose.chest.x + breathing * 0.065 + (talking ? Math.sin(time * 6) * 0.028 : 0);
      bones.chest.rotation.y = basePose.chest.y + slowSway * 0.072;
      bones.chest.rotation.z = basePose.chest.z - secondarySway * 0.04 + (happy ? Math.sin(time * 2.4) * 0.024 : 0);
    }

    if (bones.neck && basePose.neck) {
      bones.neck.rotation.x = basePose.neck.x - breathing * 0.025;
      bones.neck.rotation.y = basePose.neck.y + slowSway * 0.07;
      bones.neck.rotation.z = basePose.neck.z + secondarySway * 0.03;
    }

    if (bones.head && basePose.head) {
      bones.head.rotation.x = basePose.head.x + Math.sin(time * 0.85) * 0.045 + (thinking ? 0.085 : 0);
      bones.head.rotation.y = basePose.head.y + slowSway * 0.095 + (alert ? Math.sin(time * 4) * 0.035 : 0);
      bones.head.rotation.z = basePose.head.z + (happy ? Math.sin(time * 2.2) * 0.045 : secondarySway * 0.028);
    }

    if (bones.leftShoulder && basePose.leftShoulder) {
      bones.leftShoulder.rotation.x = basePose.leftShoulder.x + breathing * 0.04;
      bones.leftShoulder.rotation.z = basePose.leftShoulder.z + slowSway * 0.035 - (talking ? Math.sin(time * 5.5) * 0.026 : 0);
    }

    if (bones.rightShoulder && basePose.rightShoulder) {
      bones.rightShoulder.rotation.x = basePose.rightShoulder.x + breathing * 0.04;
      bones.rightShoulder.rotation.z = basePose.rightShoulder.z - slowSway * 0.035 + (talking ? Math.sin(time * 5.5) * 0.026 : 0);
    }

    if (bones.leftArm && basePose.leftArm) {
      bones.leftArm.rotation.x = basePose.leftArm.x + breathing * 0.035 + (happy ? Math.sin(time * 2.6) * 0.035 : 0);
      bones.leftArm.rotation.y = basePose.leftArm.y + secondarySway * 0.04;
      bones.leftArm.rotation.z = basePose.leftArm.z + slowSway * 0.04;
    }

    if (bones.rightArm && basePose.rightArm) {
      bones.rightArm.rotation.x = basePose.rightArm.x + breathing * 0.035 + (happy ? Math.sin(time * 2.6 + 0.6) * 0.035 : 0);
      bones.rightArm.rotation.y = basePose.rightArm.y - secondarySway * 0.04;
      bones.rightArm.rotation.z = basePose.rightArm.z - slowSway * 0.04;
    }

    const mouthEnergy = isSpeaking || emotion === "talking" ? (Math.sin(time * 18) + 1) * 0.45 : 0;
    const blink = Math.sin(time * 2.8) > 0.985 ? 1 : 0;

    morphMeshes.forEach((mesh) => {
      mesh.morphTargetInfluences?.forEach((_, index) => {
        const names = mesh.morphTargetDictionary ?? {};
        const name = Object.keys(names).find((key) => names[key] === index)?.toLowerCase() ?? "";
        const isBlink = /blink|eye_close|close/.test(name);
        const isMouth = /mouth|jaw|(^|[_-])(a|i|u|e|o|aa|ih|ou|ee|oh)($|[_-])/.test(name);
        const isHappy = /happy|joy|smile|fun/.test(name);
        const isAlert = /angry|surprised|sorrow|trouble/.test(name);

        if (isBlink) {
          mesh.morphTargetInfluences![index] = blink;
        } else if (isMouth) {
          mesh.morphTargetInfluences![index] = mouthEnergy;
        } else if (isHappy) {
          mesh.morphTargetInfluences![index] = emotion === "happy" ? 0.8 : 0;
        } else if (isAlert) {
          mesh.morphTargetInfluences![index] = emotion === "alert" ? 0.65 : 0;
        }
      });
    });
  });

  if (!scene) {
    return <FallbackAvatar />;
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function FallbackAvatar() {
  const emotion = useAvatarStore((state) => state.emotion);
  const color = useMemo(() => {
    if (emotion === "happy") {
      return "#7dd3fc";
    }

    if (emotion === "alert") {
      return "#fb7185";
    }

    if (emotion === "thinking") {
      return "#c4b5fd";
    }

    return "#e5e7eb";
  }, [emotion]);

  return (
    <group position={[0, 0.1, 0]}>
      <mesh>
        <sphereGeometry args={[0.75, 48, 48]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <capsuleGeometry args={[0.48, 1.1, 8, 24]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function AvatarCanvas() {
  return (
    <div className="h-full min-h-[620px] overflow-hidden">
      <Canvas camera={{ position: [0, 0.58, 3.05], fov: 31 }}>
        <color attach="background" args={["#f7f2ed"]} />
        <ambientLight intensity={2.25} />
        <directionalLight position={[1.5, 4, 2.5]} intensity={2.45} />
        <spotLight position={[-2.5, 3, 3]} angle={0.5} intensity={1.25} />
        <Suspense fallback={<FallbackAvatar />}>
          <EvaModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
