import { create } from "zustand";

interface Enemy {
  id: string;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  type: 'goblin' | 'orc' | 'skeleton';
}

interface EnemyState {
  enemies: Enemy[];
  
  // Actions
  addEnemy: (enemy: Omit<Enemy, 'id'>) => void;
  removeEnemy: (id: string) => void;
  damageEnemy: (id: string, damage: number) => void;
  spawnEnemies: () => void;
}

export const useEnemyStore = create<EnemyState>((set, get) => ({
  enemies: [],
  
  addEnemy: (enemyData) => {
    const enemy: Enemy = {
      ...enemyData,
      id: Math.random().toString(36).substring(2, 9)
    };
    set(state => ({ enemies: [...state.enemies, enemy] }));
  },
  
  removeEnemy: (id) => {
    set(state => ({ enemies: state.enemies.filter(e => e.id !== id) }));
  },
  
  damageEnemy: (id, damage) => {
    set(state => ({
      enemies: state.enemies.map(enemy => 
        enemy.id === id 
          ? { ...enemy, health: Math.max(0, enemy.health - damage) }
          : enemy
      )
    }));
  },
  
  spawnEnemies: () => {
    const enemies = [
      // Goblins
      { position: [10, 0.5, 10] as [number, number, number], health: 1, maxHealth: 1, type: 'goblin' as const },
      { position: [-10, 0.5, 10] as [number, number, number], health: 1, maxHealth: 1, type: 'goblin' as const },
      { position: [10, 0.5, -10] as [number, number, number], health: 1, maxHealth: 1, type: 'goblin' as const },
      
      // Orcs
      { position: [-15, 0.5, -15] as [number, number, number], health: 3, maxHealth: 3, type: 'orc' as const },
      { position: [15, 0.5, 15] as [number, number, number], health: 3, maxHealth: 3, type: 'orc' as const },
      
      // Skeletons
      { position: [0, 0.5, 20] as [number, number, number], health: 1, maxHealth: 1, type: 'skeleton' as const },
      { position: [0, 0.5, -20] as [number, number, number], health: 1, maxHealth: 1, type: 'skeleton' as const },
      { position: [20, 0.5, 0] as [number, number, number], health: 1, maxHealth: 1, type: 'skeleton' as const },
    ];
    
    enemies.forEach(enemy => {
      get().addEnemy(enemy);
    });
  }
}));

// Initialize enemies when store is created
useEnemyStore.getState().spawnEnemies();
