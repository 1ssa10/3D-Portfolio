import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

const Player = (props) => {
  // eslint-disable-next-line react/prop-types
  const Model = useGLTF("./Man.glb");

  const { actions } = useAnimations(Model.animations, Model.scene);
  console.log(actions);
  useEffect(() => {
    actions?.Idle.play();
  });
  return (
    <>
      <primitive object={Model.scene} scale={1} position-y={-0.9} />
    </>
  );
};

export default Player;
