import { Box, useGLTF, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import * as THREE from "three";

const Map = () => {
  const { nodes } = useGLTF("./stairs.glb");
  const [PurpleTexture, DarkTexture] = useTexture([
    "./assets/textures/prototype/Purple-wall.png",
    "./assets/textures/prototype/Dark-wall.png",
  ]);

  DarkTexture.wrapS = THREE.RepeatWrapping;
  DarkTexture.wrapT = THREE.RepeatWrapping;
  DarkTexture.repeat.set(100, 100);

  return (
    <>
      <RigidBody colliders={"cuboid"} friction={0}>
        <Box args={[1, 1, 1]} position={[-10, 0, 0]}>
          <meshStandardMaterial map={PurpleTexture} />
        </Box>
      </RigidBody>
      <RigidBody colliders={"trimesh"} type="fixed">
        <mesh
          geometry={nodes.Cube.geometry}
          position={[10, 0, 0]}
          scale={nodes.Cube.scale}
        >
          <meshStandardMaterial map={PurpleTexture} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" friction={0.5}>
        <Box args={[100, 0.2, 100]} position={[0, -0.1, 0]}>
          <meshStandardMaterial map={DarkTexture} />
        </Box>
      </RigidBody>
    </>
  );
};

export default Map;
