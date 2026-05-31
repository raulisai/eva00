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
  | "leftEye"
  | "leftHand"
  | "leftLowerArm"
  | "leftShoulder"
  | "neck"
  | "rightArm"
  | "rightEye"
  | "rightHand"
  | "rightLowerArm"
  | "rightShoulder"
  | "spine";

type RigBones = Partial<Record<RigBoneName, THREE.Bone>>;

type RigBasePose = Partial<Record<RigBoneName, THREE.Euler>>;

type EmotionPose = {
  leftArmX: number;
  leftArmZ: number;
  leftHandZ: number;
  leftLowerArmY: number;
  rightArmX: number;
  rightArmZ: number;
  rightHandZ: number;
  rightLowerArmY: number;
  shoulderLift: number;
};

const EMOTION_POSES: Record<string, EmotionPose> = {
  idle: {
    shoulderLift: 0,
    leftArmZ: -1.12,
    rightArmZ: 1.12,
    leftArmX: 0,
    rightArmX: 0,
    leftLowerArmY: 0.04,
    rightLowerArmY: -0.04,
    leftHandZ: 0,
    rightHandZ: 0,
  },
  thinking: {
    shoulderLift: -0.03,
    leftArmZ: -1.2,
    rightArmZ: 0.68,
    leftArmX: 0,
    rightArmX: -0.2,
    leftLowerArmY: 0.04,
    rightLowerArmY: -0.48,
    leftHandZ: 0,
    rightHandZ: -0.32,
  },
  talking: {
    shoulderLift: 0.02,
    leftArmZ: -0.9,
    rightArmZ: 0.9,
    leftArmX: 0,
    rightArmX: 0,
    leftLowerArmY: 0,
    rightLowerArmY: 0,
    leftHandZ: 0,
    rightHandZ: 0,
  },
  happy: {
    shoulderLift: 0.04,
    leftArmZ: -0.72,
    rightArmZ: 0.72,
    leftArmX: 0.08,
    rightArmX: 0.1,
    leftLowerArmY: 0.22,
    rightLowerArmY: -0.22,
    leftHandZ: -0.18,
    rightHandZ: 0.18,
  },
  alert: {
    shoulderLift: -0.08,
    leftArmZ: -1.32,
    rightArmZ: 1.32,
    leftArmX: -0.03,
    rightArmX: -0.06,
    leftLowerArmY: -0.12,
    rightLowerArmY: 0.12,
    leftHandZ: 0.08,
    rightHandZ: -0.08,
  },
};

function easeBoneRotation(bone: THREE.Bone, x: number, y: number, z: number, speed = 0.12) {
  bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, x, speed);
  bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, y, speed);
  bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, z, speed);
}

function EvaModel() {
  const groupRef = useRef<THREE.Group>(null);
  const basePoseRef = useRef<RigBasePose>({});
  const blinkRef = useRef({ nextAt: 3 + Math.random() * 5, until: 0 });
  const pointerRef = useRef({ active: false, x: 0, y: 0 });
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [morphMeshes, setMorphMeshes] = useState<THREE.Mesh[]>([]);
  const [bones, setBones] = useState<RigBones>({});
  const emotion = useAvatarStore((state) => state.emotion);
  const isSpeaking = useAvatarStore((state) => state.isSpeaking);
  const activateIdle = useAvatarStore((state) => state.activateIdle);
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
            } else if (!rigBones.leftEye && isLeft && name.includes("eye")) {
              rigBones.leftEye = bone;
            } else if (!rigBones.rightEye && isRight && name.includes("eye")) {
              rigBones.rightEye = bone;
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
            } else if (!rigBones.leftLowerArm && isLeft && name.includes("lowerarm")) {
              rigBones.leftLowerArm = bone;
            } else if (!rigBones.rightLowerArm && isRight && name.includes("lowerarm")) {
              rigBones.rightLowerArm = bone;
            } else if (!rigBones.leftArm && isLeft && (name.includes("upperarm") || name.includes("arm"))) {
              rigBones.leftArm = bone;
            } else if (!rigBones.rightArm && isRight && (name.includes("upperarm") || name.includes("arm"))) {
              rigBones.rightArm = bone;
            } else if (!rigBones.leftHand && isLeft && name.includes("hand")) {
              rigBones.leftHand = bone;
            } else if (!rigBones.rightHand && isRight && name.includes("hand")) {
              rigBones.rightHand = bone;
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

  useEffect(() => {
    if (emotion === "idle" || isSpeaking) {
      return;
    }

    const delay = emotion === "thinking" ? 4200 : emotion === "talking" ? 3600 : 3200;
    const timeoutId = window.setTimeout(() => {
      activateIdle();
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [activateIdle, emotion, isSpeaking]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      pointerRef.current.active = true;
      pointerRef.current.x = THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerRef.current.y = THREE.MathUtils.clamp(-((event.clientY / window.innerHeight) * 2 - 1), -1, 1);
    }

    function handlePointerLeave() {
      pointerRef.current.active = false;
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const group = groupRef.current;
    const basePose = basePoseRef.current;
    const breathing = Math.sin(time * 1.55);
    const slowSway = Math.sin(time * 0.55);
    const secondarySway = Math.sin(time * 0.9 + 1.2);
    const talking = isSpeaking || emotion === "talking";
    const idle = emotion === "idle";
    const happy = emotion === "happy";
    const thinking = emotion === "thinking";
    const alert = emotion === "alert";
    const bodySwayAmount = idle ? 0.018 : 0.11;
    const bodyDriftAmount = idle ? 0.008 : 0.035;
    const torsoTurnAmount = idle ? 0.012 : 0.052;
    const chestTurnAmount = idle ? 0.016 : 0.072;
    const headTurnAmount = idle ? 0.03 : 0.095;
    const headTiltAmount = idle ? 0.012 : 0.028;
    const gesture = Math.sin(time * 5.2);
    const softGesture = Math.sin(time * 2.4);
    const pointer = pointerRef.current;
    const pointerX = pointer.active ? pointer.x : 0;
    const pointerY = pointer.active ? pointer.y : 0;
    const baseEmotionPose = EMOTION_POSES[emotion] ?? EMOTION_POSES.idle;
    const pose = {
      ...baseEmotionPose,
      leftArmX: baseEmotionPose.leftArmX + (talking ? gesture * 0.08 : breathing * 0.018),
      rightArmX: baseEmotionPose.rightArmX + (talking ? Math.sin(time * 5.2 + 0.8) * 0.1 : breathing * 0.018),
      leftLowerArmY: baseEmotionPose.leftLowerArmY + (talking ? softGesture * 0.18 : 0),
      rightLowerArmY: baseEmotionPose.rightLowerArmY + (talking ? -softGesture * 0.22 : 0),
      leftHandZ: baseEmotionPose.leftHandZ + (talking ? gesture * 0.08 : 0),
      rightHandZ: baseEmotionPose.rightHandZ + (talking ? Math.sin(time * 5.2 + 0.8) * 0.08 : 0),
    };

    if (time >= blinkRef.current.nextAt) {
      blinkRef.current.until = time + 0.16;
      blinkRef.current.nextAt = time + 3 + Math.random() * 5;
    }

    const blinkProgress =
      blinkRef.current.until > time ? 1 - Math.abs((blinkRef.current.until - time) / 0.08 - 1) : 0;
    const blink = THREE.MathUtils.clamp(blinkProgress, 0, 1);

    if (group) {
      const emotionLift = happy ? 0.075 : alert ? 0.03 : 0;
      const talkBounce = talking ? Math.sin(time * 8) * 0.035 : 0;
      const thinkingLean = thinking ? 0.075 : 0;

      group.position.y = breathing * 0.04 + emotionLift + talkBounce;
      group.position.x = slowSway * bodyDriftAmount;
      group.rotation.y = slowSway * bodySwayAmount + (alert ? Math.sin(time * 5) * 0.03 : 0);
      group.rotation.z = thinkingLean + secondarySway * (idle ? 0.006 : 0.026);
      group.scale.setScalar(1 + breathing * (idle ? 0.006 : 0.011));
    }

    if (bones.hips && basePose.hips) {
      bones.hips.rotation.x = basePose.hips.x + breathing * (idle ? 0.01 : 0.018);
      bones.hips.rotation.y = basePose.hips.y - slowSway * (idle ? 0.006 : 0.03);
      bones.hips.rotation.z = basePose.hips.z + secondarySway * (idle ? 0.004 : 0.018);
    }

    if (bones.spine && basePose.spine) {
      bones.spine.rotation.x = basePose.spine.x + breathing * (idle ? 0.02 : 0.035) + (thinking ? 0.035 : 0);
      bones.spine.rotation.y = basePose.spine.y + slowSway * torsoTurnAmount;
      bones.spine.rotation.z = basePose.spine.z + secondarySway * (idle ? 0.008 : 0.032);
    }

    if (bones.chest && basePose.chest) {
      bones.chest.rotation.x = basePose.chest.x + breathing * 0.065 + (talking ? Math.sin(time * 6) * 0.028 : 0);
      bones.chest.rotation.y = basePose.chest.y + slowSway * chestTurnAmount;
      bones.chest.rotation.z = basePose.chest.z - secondarySway * (idle ? 0.01 : 0.04) + (happy ? Math.sin(time * 2.4) * 0.024 : 0);
    }

    if (bones.neck && basePose.neck) {
      bones.neck.rotation.x = basePose.neck.x - breathing * 0.025;
      bones.neck.rotation.y = basePose.neck.y + slowSway * (idle ? 0.018 : 0.07) + pointerX * 0.035;
      bones.neck.rotation.z = basePose.neck.z + secondarySway * (idle ? 0.01 : 0.03);
    }

    if (bones.head && basePose.head) {
      bones.head.rotation.x =
        basePose.head.x + Math.sin(time * 0.85) * (idle ? 0.022 : 0.045) + (thinking ? 0.085 : 0) - pointerY * 0.055;
      bones.head.rotation.y =
        basePose.head.y + slowSway * headTurnAmount + (alert ? Math.sin(time * 4) * 0.035 : 0) + pointerX * 0.075;
      bones.head.rotation.z = basePose.head.z + (happy ? Math.sin(time * 2.2) * 0.045 : secondarySway * headTiltAmount);
    }

    if (bones.leftEye && basePose.leftEye) {
      easeBoneRotation(
        bones.leftEye,
        basePose.leftEye.x + Math.sin(time * 0.62) * 0.018 - pointerY * 0.045,
        basePose.leftEye.y + Math.sin(time * 0.48) * 0.035 + pointerX * 0.085,
        basePose.leftEye.z,
        0.08,
      );
    }

    if (bones.rightEye && basePose.rightEye) {
      easeBoneRotation(
        bones.rightEye,
        basePose.rightEye.x + Math.sin(time * 0.62) * 0.018 - pointerY * 0.045,
        basePose.rightEye.y + Math.sin(time * 0.48) * 0.035 + pointerX * 0.085,
        basePose.rightEye.z,
        0.08,
      );
    }

    if (bones.leftShoulder && basePose.leftShoulder) {
      easeBoneRotation(
        bones.leftShoulder,
        basePose.leftShoulder.x + breathing * 0.018 + pose.shoulderLift,
        basePose.leftShoulder.y + slowSway * 0.012,
        basePose.leftShoulder.z - 0.16 + slowSway * 0.012,
      );
    }

    if (bones.rightShoulder && basePose.rightShoulder) {
      easeBoneRotation(
        bones.rightShoulder,
        basePose.rightShoulder.x + breathing * 0.018 + pose.shoulderLift,
        basePose.rightShoulder.y - slowSway * 0.012,
        basePose.rightShoulder.z + 0.16 - slowSway * 0.012,
      );
    }

    if (bones.leftArm && basePose.leftArm) {
      easeBoneRotation(
        bones.leftArm,
        basePose.leftArm.x + pose.leftArmX,
        basePose.leftArm.y + secondarySway * 0.014,
        basePose.leftArm.z + pose.leftArmZ + slowSway * 0.016,
      );
    }

    if (bones.rightArm && basePose.rightArm) {
      easeBoneRotation(
        bones.rightArm,
        basePose.rightArm.x + pose.rightArmX,
        basePose.rightArm.y - secondarySway * 0.014,
        basePose.rightArm.z + pose.rightArmZ - slowSway * 0.016,
      );
    }

    if (bones.leftLowerArm && basePose.leftLowerArm) {
      easeBoneRotation(
        bones.leftLowerArm,
        basePose.leftLowerArm.x + (happy ? 0.08 : alert ? -0.08 : talking ? gesture * 0.05 : 0),
        basePose.leftLowerArm.y + pose.leftLowerArmY,
        basePose.leftLowerArm.z + (talking ? gesture * 0.06 : 0),
      );
    }

    if (bones.rightLowerArm && basePose.rightLowerArm) {
      easeBoneRotation(
        bones.rightLowerArm,
        basePose.rightLowerArm.x + (thinking ? -0.28 : happy ? 0.08 : alert ? -0.08 : talking ? Math.sin(time * 5.2 + 0.8) * 0.05 : 0),
        basePose.rightLowerArm.y + pose.rightLowerArmY,
        basePose.rightLowerArm.z + (thinking ? -0.18 : talking ? Math.sin(time * 5.2 + 0.8) * 0.06 : 0),
      );
    }

    if (bones.leftHand && basePose.leftHand) {
      easeBoneRotation(
        bones.leftHand,
        basePose.leftHand.x + (happy ? 0.08 : alert ? -0.08 : 0),
        basePose.leftHand.y + (talking ? gesture * 0.06 : 0),
        basePose.leftHand.z + pose.leftHandZ,
      );
    }

    if (bones.rightHand && basePose.rightHand) {
      easeBoneRotation(
        bones.rightHand,
        basePose.rightHand.x + (thinking ? -0.18 : happy ? 0.08 : alert ? -0.08 : 0),
        basePose.rightHand.y + (talking ? Math.sin(time * 5.2 + 0.8) * 0.06 : 0),
        basePose.rightHand.z + pose.rightHandZ,
      );
    }

    const mouthEnergy = isSpeaking || emotion === "talking" ? (Math.sin(time * 18) + 1) * 0.45 : 0;

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
