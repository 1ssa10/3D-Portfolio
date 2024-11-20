import { Canvas } from "@react-three/fiber";
import "./App.css";
import {
  Environment,
  FirstPersonControls,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
// import PlayerControl from "./components/PlayerControl";
import Map from "./components/Map";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import CharacterControl from "./components/CharacterControl";
import Player from "./components/Player";
function App() {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
          { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
        ]}
      >
        <Canvas
          className="canvas-container"
          // onMouseDown={(e) => e.target.requestPointerLock()}
        >
          <Perf position="top-left" minimal />
          <Environment background files={"./sky.hdr"} />
          <Suspense>
            <Physics debug>
              {/* <PlayerControl /> */}

              <CharacterControl />
              <Map />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
