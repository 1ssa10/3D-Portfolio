import { useGLTF } from "@react-three/drei";

const Player = (props) => {
  // eslint-disable-next-line react/prop-types
  const Model = useGLTF("./Man.glb");

  return (
    <>
      <primitive object={Model.scene} scale={1} position-y={-0.9} />
    </>
  );
};

export default Player;
