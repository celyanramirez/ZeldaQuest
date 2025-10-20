import { create } from "zustand";

interface PlayerState {
  position: [number, number, number];
  health: number;
  maxHealth: number;
  facing: 'up' | 'down' | 'left' | 'right';
  isAttacking: boolean;
  attackCooldown: number;
  
  // Actions
  move: (position: [number, number, number], facing: 'up' | 'down' | 'left' | 'right') => void;
  attack: () => void;
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  position: [0, 0.5, 0],
  health: 5,
  maxHealth: 5,
  facing: 'down',
  isAttacking: false,
  attackCooldown: 0,
  
  move: (position, facing) => {
    set({ position, facing });
  },
  
  attack: () => {
    const { attackCooldown } = get();
    if (attackCooldown > 0) return;
    
    set({ isAttacking: true, attackCooldown: 500 }); // 500ms cooldown
    
    // Reset attack state after animation
    setTimeout(() => {
      set({ isAttacking: false });
    }, 200);
    
    // Reset cooldown
    setTimeout(() => {
      set({ attackCooldown: 0 });
    }, 500);
  },
  
  takeDamage: (damage) => {
    const { health } = get();
    const newHealth = Math.max(0, health - damage);
    set({ health: newHealth });
  },
  
  heal: (amount) => {
    const { health, maxHealth } = get();
    const newHealth = Math.min(maxHealth, health + amount);
    set({ health: newHealth });
  }
}));
