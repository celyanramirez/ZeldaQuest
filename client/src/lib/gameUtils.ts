// Simple collision detection utilities

export function checkCollision(
  pos1: [number, number, number],
  size1: number,
  pos2: [number, number, number],
  size2: number
): boolean {
  const dx = Math.abs(pos1[0] - pos2[0]);
  const dz = Math.abs(pos1[2] - pos2[2]);
  
  return dx < (size1 + size2) / 2 && dz < (size1 + size2) / 2;
}

export function isValidPosition(position: [number, number, number]): boolean {
  const [x, y, z] = position;
  const mapSize = 36; // Slightly less than terrain map size for borders
  const tileSize = 2;
  
  // Check if position is within bounds
  if (Math.abs(x) >= mapSize || Math.abs(z) >= mapSize) {
    return false;
  }
  
  // Check for wall collisions (simplified)
  // In a real game, you'd check against actual wall positions
  const tileX = Math.floor(x / tileSize);
  const tileZ = Math.floor(z / tileSize);
  
  // Simple wall detection - borders are walls
  const isNearBorder = Math.abs(tileX) >= 18 || Math.abs(tileZ) >= 18;
  
  return !isNearBorder;
}

export function getDistance(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function normalizeVector(vector: [number, number, number]): [number, number, number] {
  const [x, y, z] = vector;
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  
  if (magnitude === 0) return [0, 0, 0];
  
  return [x / magnitude, y / magnitude, z / magnitude];
}
