# Zelda-Style 2D Adventure Game (Python/Pygame)

A classic 2D action-adventure game inspired by **The Legend of Zelda** series (A Link to the Past, The Minish Cap), built entirely in Python using Pygame.

## Features

### Core Gameplay
- **Top-down 2D perspective** - Classic Zelda-style camera view
- **Player movement** - Move in 4 directions using arrow keys or WASD
- **Sword combat** - Attack enemies with your sword using the spacebar
- **Enemy AI** - Enemies patrol and chase the player when detected
- **Health system** - Heart-based health display (6 hearts)
- **Dungeon exploration** - Navigate through a dungeon with walls and obstacles

### Game Elements
- **Multiple enemy types**:
  - **Goblins** (red) - Fast but weak (2 HP)
  - **Orcs** (dark red) - Slow but strong (4 HP, 2 damage)
  - **Other enemies** (purple) - Balanced stats (3 HP)

- **Combat mechanics**:
  - Directional sword attacks
  - Attack cooldown system
  - Enemy detection and chase behavior
  - Collision-based damage

- **Win/Loss conditions**:
  - **Victory**: Defeat all enemies
  - **Game Over**: Health reaches zero
  - Press 'R' to restart after game ends

## How to Run

### Requirements
- Python 3.11+
- Pygame 2.6.1+

### Running Locally
Since Pygame requires a display window, this game needs to be run on your local machine:

```bash
# Install pygame if not already installed
pip install pygame

# Run the game
python main.py
```

### Running in Replit (Desktop App)
If you're using the Replit desktop application with display support, you can run:
```bash
python main.py
```

## Controls

| Key | Action |
|-----|--------|
| **W** or **↑** | Move Up |
| **S** or **↓** | Move Down |
| **A** or **←** | Move Left |
| **D** or **→** | Move Right |
| **SPACE** | Attack with Sword |
| **R** | Restart (after game over/victory) |
| **ESC** | Quit Game |

## Game Files

- **main.py** - Main game loop and scene management
- **player.py** - Player character with movement and combat
- **enemy.py** - Enemy AI and behavior
- **settings.py** - Game configuration and constants

## Gameplay Tips

1. **Combat Strategy**: Enemies have detection ranges - you can approach carefully
2. **Positioning**: Use walls to funnel enemies and avoid being surrounded
3. **Attack Timing**: Watch for the attack cooldown to maximize damage
4. **Enemy Types**: Focus on defeating goblins first (they're faster but weaker)
5. **Health Management**: Each enemy deals damage on contact - keep your distance!

## Customization

You can modify game parameters in `settings.py`:
- Player speed and health
- Enemy stats and behavior
- Screen size and tile dimensions
- Attack damage and cooldown times

## Future Enhancements

Potential additions (not yet implemented):
- Items and power-ups (heart containers, keys)
- Multiple dungeon rooms
- Treasure chests and collectibles  
- Sound effects and music
- Sprite animations
- Boss battles
- Save system

## Technical Details

- **Framework**: Pygame 2.6.1
- **Resolution**: 800x600 (configurable)
- **FPS**: 60
- **Collision**: AABB (Axis-Aligned Bounding Box)
- **Rendering**: Simple colored rectangles (can be replaced with sprites)

---

Enjoy your adventure! 🗡️ 🛡️
