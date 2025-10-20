import { useRef } from "react";
import { Group } from "three";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Terrain } from "./Terrain";
import { usePlayerStore } from "../../lib/stores/usePlayerStore";
import { useEnemyStore } from "../../lib/stores/useEnemyStore";

export function GameScene() {
  const sceneRef = useRef<Group>(null);
  const { enemies } = useEnemyStore();

  return (
    <group ref={sceneRef}>
      {/* Terrain tiles */}
      <Terrain />
      
      {/* Player */}
      <Player />
      
      {/* Enemies */}
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          id={enemy.id}
          position={enemy.position}
          health={enemy.health}
          type={enemy.type}
        />
      ))}
    </group>
  );
}
