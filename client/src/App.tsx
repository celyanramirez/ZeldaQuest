import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { GameScene } from "./components/game/GameScene";
import { GameUI } from "./components/game/GameUI";
import { SoundManager } from "./components/game/SoundManager";
import { useGame } from "./lib/stores/useGame";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "attack", keys: ["Space"] },
];

// Main App component
function App() {
  const { phase, start } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
    // Auto-start the game
    if (phase === "ready") {
      start();
    }
  }, [phase, start]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{
              position: [0, 10, 0],
              rotation: [-Math.PI / 2, 0, 0], // Top-down view
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#2a4d3a"]} />
            
            {/* Basic lighting for 2D sprites */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[0, 5, 0]} intensity={0.5} />

            <Suspense fallback={null}>
              <GameScene />
            </Suspense>
          </Canvas>
          
          <GameUI />
          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
