import { useTexture } from "@react-three/drei";
import { useMemo } from "react";

export function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");
  const woodTexture = useTexture("/textures/wood.jpg");

  // Create a simple tile-based map
  const mapSize = 20;
  const tileSize = 2;

  const tiles = useMemo(() => {
    const tileArray = [];
    
    for (let x = -mapSize; x < mapSize; x++) {
      for (let z = -mapSize; z < mapSize; z++) {
        // Create borders with wood (walls/obstacles)
        const isWall = Math.abs(x) === mapSize - 1 || Math.abs(z) === mapSize - 1;
        
        // Add some random obstacles
        const isObstacle = !isWall && Math.random() < 0.05;
        
        tileArray.push({
          position: [x * tileSize, 0, z * tileSize] as [number, number, number],
          type: isWall || isObstacle ? 'wall' : 'grass',
          key: `${x}-${z}`
        });
      }
    }
    
    return tileArray;
  }, []);

  return (
    <group>
      {tiles.map(tile => (
        <mesh
          key={tile.key}
          position={tile.position}
          receiveShadow
        >
          <boxGeometry args={[tileSize, tile.type === 'wall' ? 1 : 0.1, tileSize]} />
          <meshStandardMaterial 
            map={tile.type === 'wall' ? woodTexture : grassTexture}
            color={tile.type === 'wall' ? '#8B4513' : '#228B22'}
          />
        </mesh>
      ))}
    </group>
  );
}
