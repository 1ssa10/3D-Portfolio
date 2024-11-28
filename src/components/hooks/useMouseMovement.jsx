import { useEffect, useState, useRef } from "react";

const useMouseMovement = () => {
  // const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const resetTimeout = useRef(null); // Reference to the timeout ID

  const mouseMovement = (event) => {
    // Clear any existing timeout
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }

    // Update mouse movement
    mouse.current.x = event.movementX;
    mouse.current.y = event.movementY;

    // Set a timeout to reset mouse movement after 100ms (adjust as needed)
    resetTimeout.current = setTimeout(() => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    }, 100); // 10ms delay
  };

  useEffect(() => {
    document.addEventListener("mousemove", mouseMovement);

    return () => {
      document.removeEventListener("mousemove", mouseMovement);
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current); // Clean up the timeout
      }
    };
  }, []);

  return mouse;
};

export default useMouseMovement;
