import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { usePlayerStore } from "../../lib/stores/usePlayerStore";
import { useEnemyStore } from "../../lib/stores/useEnemyStore";
import { isValidPosition } from "../../lib/gameUtils";

interface EnemyProps {
  id: string;
  position: [number, number, number];
  health: number;
  type: 'goblin' | 'orc' | 'skeleton';
}

export function Enemy({ id, position, health, type }: EnemyProps) {
  const meshRef = useRef<Mesh>(null);
  const { position: playerPosition, takeDamage: playerTakeDamage } = usePlayerStore();
  const { removeEnemy } = useEnemyStore();
  
  const [currentPosition, setCurrentPosition] = useState(position);
  const [patrolDirection, setPatrolDirection] = useState<[number, number]>([1, 0]);
  const [lastDirectionChange, setLastDirectionChange] = useState(0);
  
  const moveSpeed = type === 'goblin' ? 0.02 : type === 'orc' ? 0.015 : 0.025;
  const attackRange = 1.2;
  const detectionRange = type === 'goblin' ? 4 : type === 'orc' ? 3 : 5;

  useFrame((state, delta) => {
    if (!meshRef.current || health <= 0) {
      if (health <= 0) {
        removeEnemy(id);
      }
      return;
    }

    const playerPos = new Vector3(...playerPosition);
    const enemyPos = new Vector3(...currentPosition);
    const distanceToPlayer = playerPos.distanceTo(enemyPos);

    let newPosition = [...currentPosition] as [number, number, number];

    // AI behavior
    if (distanceToPlayer <= detectionRange) {
      // Chase player
      const direction = new Vector3().subVectors(playerPos, enemyPos).normalize();
      newPosition[0] += direction.x * moveSpeed;
      newPosition[2] += direction.z * moveSpeed;
      
      // Attack player if in range
      if (distanceToPlayer <= attackRange) {
        playerTakeDamage(1);
      }
    } else {
      // Patrol behavior
      const time = state.clock.elapsedTime;
      
      // Change direction every 3 seconds or if hitting a wall
      if (time - lastDirectionChange > 3 || !isValidPosition(newPosition)) {
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const newDir = directions[Math.floor(Math.random() * directions.length)];
        setPatrolDirection(newDir);
        setLastDirectionChange(time);
      }
      
      newPosition[0] += patrolDirection[0] * moveSpeed;
      newPosition[2] += patrolDirection[1] * moveSpeed;
    }

    // Validate new position
    if (isValidPosition(newPosition)) {
      setCurrentPosition(newPosition);
      meshRef.current.position.set(...newPosition);
    }

    // Color based on health
    const healthRatio = health / (type === 'orc' ? 3 : 1);
    const color = `hsl(${healthRatio * 120}, 70%, 50%)`; // Green to red based on health
    
    if (meshRef.current.material) {
      (meshRef.current.material as any).color.setStyle(color);
    }
  });

  // Remove dead enemies
  if (health <= 0) {
    return null;
  }

  // Enemy colors and sizes based on type
  const getEnemyProps = () => {
    switch (type) {
      case 'goblin':
        return { color: '#8B4513', size: 0.6 }; // Brown, small
      case 'orc':
        return { color: '#556B2F', size: 1.0 }; // Dark olive, large
      case 'skeleton':
        return { color: '#F5F5DC', size: 0.8 }; // Beige, medium
      default:
        return { color: '#8B4513', size: 0.6 };
    }
  };

  const { color, size } = getEnemyProps();

  return (
    <mesh ref={meshRef} position={currentPosition} castShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
