import React, { useEffect, useRef, useState } from "react";
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
  const canJump = useRef(false);

  const { WALK_SPEED, RUN_SPEED, SENS } = useControls("characterControls", {
    WALK_SPEED: { value: 1.5, min: 0.1, max: 2, step: 0.1 },
    RUN_SPEED: { value: 3, min: 2, max: 5, step: 0.1 },
    SENS: { value: 0.002, min: 0.001, max: 0.01, step: 0.001 },
  });

  const [, getkeys] = useKeyboardControls();

  const mouse = useMouseMovement();

  useFrame(({ camera }) => {
    //RigidBody movement
    if (rb.current) {
      const speed = getkeys().run ? RUN_SPEED : WALK_SPEED;
      const movementInput = {
        forward: getkeys().forward ? 1 : 0,
        backward: getkeys().backward ? -1 : 0,
        rightward: getkeys().rightward ? 1 : 0,
        leftward: getkeys().leftward ? -1 : 0,
      };

      // Calculate forward and rightward directions
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

      // Jump
      // console.log(canJump);
      if (getkeys().jump && canJump.current) {
        if (
          Math.round(rb.current.linvel().y) === 0 &&
          canJump.current === true
        ) {
          rb.current.applyImpulse({ x: 0, y: 1, z: 0 }, true);
          canJump.current = false;
        }
      }
    }

    //CAM

    if (!mouse.current) return;
    const { x, y } = mouse.current;
    container.current.rotation.y += -x * SENS;

    if (cameraPosition.current) {
      // cam position on y according to the movemovement  between 3 and 0.2
      if (cameraPosition.current.position.z === -2) {
        // console.log(cameraPosition.current.position.z);
        cameraPosition.current.position.y = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(
            cameraPosition.current.position.y,
            (cameraPosition.current.position.y += y * 5 * SENS),
            0.1
          ),
          0.2,
          3
        );
      }
      // cam movement on z when the cam is on the edges
      if (cameraPosition.current.position.y === 3) {
        cameraPosition.current.position.z = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(
            cameraPosition.current.position.z,
            (cameraPosition.current.position.z += y * 5 * SENS),
            0.1
          ),
          -2,
          0
        );
      }
      //  same thing but inverted since the mousemovement will be the opposite
      if (cameraPosition.current.position.y === 0.2) {
        cameraPosition.current.position.z = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(
            cameraPosition.current.position.z,
            (cameraPosition.current.position.z -= y * 5 * SENS),
            0.1
          ),
          -2,
          0
        );
      }

      // console.log(cameraPosition.current.position.y);
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.copy(cameraWorldPosition.current);
    }
    // repositioning the camera target according to the mouse
    if (camTarget.current) {
      camTarget.current.position.y = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(
          camTarget.current.position.y,
          (camTarget.current.position.y += -y * 20 * SENS),
          0.1
        ),
        -12,
        15
      );

      camTarget.current.getWorldPosition(camWorldlookAtPosition.current);
      camLookAt.current.copy(camWorldlookAtPosition.current);

      camera.lookAt(camLookAt.current);
    }
    mouse.current.x = 0;
    mouse.current.y = 0;
  });

  return (
    <>
      <RigidBody
        colliders={false}
        ref={rb}
        lockRotations
        friction={0}
        position={[0, 2, 0]}
        onCollisionEnter={() => {
          //allow to jump onCollision
          if (canJump.current === false) {
            canJump.current = true;
          }
        }}
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
    </>
  );
};

export default CharacterControl;
