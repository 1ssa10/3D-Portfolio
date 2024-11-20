import React, { useEffect, useRef } from "react";
import Player from "./Player";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls, useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import useMouseMovement from "./hooks/useMouseMovement";

const CharacterControl = () => {
  const container = useRef();
  const cameraPosition = useRef();
  const camTarget = useRef();
  const character = useRef();
  const rb = useRef();
  const cameraWorldPosition = useRef(new THREE.Vector3());
  const camWorldlookAtPosition = useRef(new THREE.Vector3());
  const camLookAt = useRef(new THREE.Vector3());
  const rbContainer = useRef();

  const { WALK_SPEED, RUN_SPEED, SENS } = useControls("characterControls", {
    WALK_SPEED: { value: 1, min: 0.1, max: 2, step: 0.1 },
    RUN_SPEED: { value: 3, min: 2, max: 5, step: 0.1 },
    SENS: { value: 0.5, min: 0.01, max: 1, step: 0.1 },
  });

  const [, getkeys] = useKeyboardControls();

  let mouse = useMouseMovement();

  useFrame(({ camera }) => {
    //RigidBody movement
    if (rb.current) {
      const vel = rb.current.linvel();
      let movement = {
        x: 0,
        z: 0,
      };
      let speed = getkeys().run ? RUN_SPEED : WALK_SPEED;
      if (getkeys().forward) {
        movement.z = 1;
      }
      if (getkeys().backward) {
        movement.z = -1;
      }
      if (getkeys().rightward) {
        movement.x = -1;
      }
      if (getkeys().leftward) {
        movement.x = 1;
      }

      if (movement.z !== 0 || movement.x !== 0) {
        vel.z = movement.z * speed;
        vel.x = movement.x * speed;
      }
      rb.current.setLinvel(vel, true);
    }
    //Rotation
    console.log(mouse);

    //CAM
    if (cameraPosition.current) {
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.copy(cameraWorldPosition.current);
    }

    if (camTarget.current) {
      camTarget.current.getWorldPosition(camWorldlookAtPosition.current);
      camLookAt.current.copy(camWorldlookAtPosition.current);
      camera.lookAt(camLookAt.current);
    }
  });
  return (
    <>
      <PointerLockControls />
      <group ref={rbContainer}>
        <RigidBody
          colliders={false}
          ref={rb}
          lockRotations
          position={[0, 2, 0]}
        >
          <group ref={container} position={[0, 0, 0]}>
            <group ref={cameraPosition} position={[-0.5, 1.75, -2]} />
            <group ref={camTarget} position={[-0.5, 1, 10]} />
            <group ref={character} position={[0, 1, 0]}>
              <Player />
              <CapsuleCollider args={[0.7, 0.2]} />
            </group>
          </group>
        </RigidBody>
      </group>
    </>
  );
};

export default CharacterControl;
