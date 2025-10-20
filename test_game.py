import sys

def verify_game_structure():
    print("Verifying Zelda-style game structure...")
    errors = []
    
    try:
        import pygame
        print("✓ Pygame imported successfully")
    except ImportError as e:
        errors.append(f"✗ Pygame import failed: {e}")
    
    try:
        import settings
        print("✓ Settings module loaded")
        print(f"  - Screen: {settings.SCREEN_WIDTH}x{settings.SCREEN_HEIGHT}")
        print(f"  - Player health: {settings.PLAYER_MAX_HEALTH}")
        print(f"  - Player speed: {settings.PLAYER_SPEED}")
    except Exception as e:
        errors.append(f"✗ Settings import failed: {e}")
    
    try:
        from player import Player
        print("✓ Player class imported")
    except Exception as e:
        errors.append(f"✗ Player import failed: {e}")
    
    try:
        from enemy import Enemy
        print("✓ Enemy class imported")
    except Exception as e:
        errors.append(f"✗ Enemy import failed: {e}")
    
    try:
        from items import Item
        print("✓ Item class imported")
    except Exception as e:
        errors.append(f"✗ Item import failed: {e}")
    
    try:
        from main import Game
        print("✓ Game class imported")
    except Exception as e:
        errors.append(f"✗ Game import failed: {e}")
    
    print("\n" + "="*50)
    if errors:
        print("VERIFICATION FAILED:")
        for error in errors:
            print(error)
        return False
    else:
        print("✓ ALL CHECKS PASSED!")
        print("\nGame Features:")
        print("  • Top-down 2D Zelda-style gameplay")
        print("  • Player movement (WASD/Arrow keys)")
        print("  • Sword combat system (Space)")
        print("  • Multiple enemy types with AI")
        print("  • Collectible items (hearts, rupees, keys)")
        print("  • Health system with heart display")
        print("  • Win/lose conditions")
        print("  • Game restart functionality")
        print("\nTo run the game locally:")
        print("  python main.py")
        return True

if __name__ == "__main__":
    success = verify_game_structure()
    sys.exit(0 if success else 1)
