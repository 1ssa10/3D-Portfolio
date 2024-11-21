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
    WALK_SPEED: { value: 1.5, min: 0.1, max: 2, step: 0.1 },
    RUN_SPEED: { value: 3, min: 2, max: 5, step: 0.1 },
    SENS: { value: 0.002, min: 0.001, max: 0.01, step: 0.001 },
  });

  const [, getkeys] = useKeyboardControls();

  let mouse = useMouseMovement();

  useFrame(({ camera }) => {
    //RigidBody movement
    if (rb.current) {
      const speed = getkeys().run ? RUN_SPEED : WALK_SPEED;
      const movementInput = {
        forward: getkeys().forward ? 1 : 0,
        backward: getkeys().backward ? -1 : 0,
        rightward: getkeys().rightward ? 1 : 0,
        leftward: getkeys().leftward ? -1 : 0,
        jump: getkeys().jump ? 2 : 0,
      };

      // Calculate the container's forward and rightward directions
      const containerRotation = container.current.rotation.y;
      const forwardVector = new THREE.Vector3(
        Math.sin(containerRotation),
        0,
        Math.cos(containerRotation)
      );
      const rightVector = new THREE.Vector3(
        -Math.sin(containerRotation + Math.PI / 2),
        0,
        -Math.cos(containerRotation + Math.PI / 2)
      );

      // Calculate movement vector
      const movementVector = new THREE.Vector3()
        .add(
          forwardVector
            .clone()
            .multiplyScalar(movementInput.forward + movementInput.backward)
        )
        .add(
          rightVector
            .clone()
            .multiplyScalar(movementInput.rightward + movementInput.leftward)
        );

      // Normalize and scale by speed
      if (movementVector.length() > 0) {
        movementVector.normalize().multiplyScalar(speed);
      }

      // Apply linear velocity to the rigid body
      rb.current.setLinvel(
        {
          x: movementVector.x,
          y: rb.current.linvel().y,
          z: movementVector.z,
        },
        true
      );
    }

    //CAM
    container.current.rotation.y += -mouse.x * SENS;

    if (cameraPosition.current) {
      cameraPosition.current.position.y = THREE.MathUtils.lerp(
        cameraPosition.current.position.y,
        (cameraPosition.current.position.y += mouse.y * 5 * SENS),
        0.1
      );
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.copy(cameraWorldPosition.current);
    }

    if (camTarget.current) {
      camTarget.current.position.y = THREE.MathUtils.lerp(
        camTarget.current.position.y,
        (camTarget.current.position.y += -mouse.y * 20 * SENS),
        0.1
      );
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
