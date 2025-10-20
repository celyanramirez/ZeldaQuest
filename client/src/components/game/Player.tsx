import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Mesh, Vector3 } from "three";
import { usePlayerStore } from "../../lib/stores/usePlayerStore";
import { useEnemyStore } from "../../lib/stores/useEnemyStore";
import { useAudio } from "../../lib/stores/useAudio";
import { checkCollision, isValidPosition } from "../../lib/gameUtils";
import * as THREE from "three";

export function Player() {
  const meshRef = useRef<Mesh>(null);
  const { position, health, facing, isAttacking, move, attack, takeDamage } = usePlayerStore();
  const { enemies, damageEnemy } = useEnemyStore();
  const { playHit } = useAudio();
  
  const [, get] = useKeyboardControls();
  
  const moveSpeed = 0.1;
  const attackRange = 1.5;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const { forward, backward, leftward, rightward, attack: attackPressed } = get();
    
    // Handle movement
    let newPosition = [...position] as [number, number, number];
    let newFacing = facing;
    
    if (forward) {
      newPosition[2] -= moveSpeed;
      newFacing = 'up';
    }
    if (backward) {
      newPosition[2] += moveSpeed;
      newFacing = 'down';
    }
    if (leftward) {
      newPosition[0] -= moveSpeed;
      newFacing = 'left';
    }
    if (rightward) {
      newPosition[0] += moveSpeed;
      newFacing = 'right';
    }
    
    // Check if new position is valid (no collision with terrain/walls)
    if (isValidPosition(newPosition)) {
      move(newPosition, newFacing);
    }
    
    // Handle attack
    if (attackPressed && !isAttacking) {
      attack();
      playHit();
      
      // Check for enemies in attack range
      const playerPos = new Vector3(position[0], position[1], position[2]);
      enemies.forEach((enemy: any) => {
        const enemyPos = new Vector3(enemy.position[0], enemy.position[1], enemy.position[2]);
        const distance = playerPos.distanceTo(enemyPos);
        
        if (distance <= attackRange) {
          // Check if enemy is in the direction player is facing
          const direction = new Vector3().subVectors(enemyPos, playerPos).normalize();
          let inRange = false;
          
          switch (facing) {
            case 'up':
              inRange = direction.z < -0.5;
              break;
            case 'down':
              inRange = direction.z > 0.5;
              break;
            case 'left':
              inRange = direction.x < -0.5;
              break;
            case 'right':
              inRange = direction.x > 0.5;
              break;
          }
          
          if (inRange) {
            damageEnemy(enemy.id, 1);
          }
        }
      });
    }

    // Update mesh position
    meshRef.current.position.set(position[0], position[1], position[2]);
    
    // Simple rotation based on facing direction
    let rotation = 0;
    switch (facing) {
      case 'up': rotation = 0; break;
      case 'down': rotation = Math.PI; break;
      case 'left': rotation = Math.PI / 2; break;
      case 'right': rotation = -Math.PI / 2; break;
    }
    meshRef.current.rotation.y = rotation;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#4a90e2" />
      
      {/* Attack indicator */}
      {isAttacking && (
        <mesh position={[0, 0.1, facing === 'up' ? -1 : facing === 'down' ? 1 : 0]}>
          <boxGeometry args={[facing === 'left' || facing === 'right' ? 0.2 : 1.5, 0.1, facing === 'up' || facing === 'down' ? 0.2 : 1.5]} />
          <meshStandardMaterial color="#ffff00" transparent opacity={0.7} />
        </mesh>
      )}
    </mesh>
  );
}
