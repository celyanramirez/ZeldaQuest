import pygame
import sys
from settings import *
from player import Player
from enemy import Enemy
from items import Item

class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Zelda-Style Adventure")
        self.clock = pygame.time.Clock()
        
        self.running = True
        self.game_state = 'playing'
        
        self.player = Player(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
        
        self.enemies = pygame.sprite.Group()
        self.items = pygame.sprite.Group()
        
        self.walls = []
        self.score = 0
        self.keys = 0
        
        self.create_dungeon()
        
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        
    def create_dungeon(self):
        wall_thickness = TILE_SIZE
        
        for i in range(0, SCREEN_WIDTH, TILE_SIZE):
            self.walls.append(pygame.Rect(i, 0, TILE_SIZE, wall_thickness))
            self.walls.append(pygame.Rect(i, SCREEN_HEIGHT - wall_thickness, TILE_SIZE, wall_thickness))
        
        for i in range(0, SCREEN_HEIGHT, TILE_SIZE):
            self.walls.append(pygame.Rect(0, i, wall_thickness, TILE_SIZE))
            self.walls.append(pygame.Rect(SCREEN_WIDTH - wall_thickness, i, wall_thickness, TILE_SIZE))
        
        self.walls.append(pygame.Rect(200, 200, TILE_SIZE * 3, TILE_SIZE))
        self.walls.append(pygame.Rect(500, 300, TILE_SIZE, TILE_SIZE * 3))
        self.walls.append(pygame.Rect(300, 400, TILE_SIZE * 4, TILE_SIZE))
        
        self.spawn_enemies()
        self.spawn_items()
    
    def spawn_enemies(self):
        enemy_positions = [
            (150, 150, 'goblin'),
            (600, 150, 'goblin'),
            (400, 300, 'orc'),
            (150, 450, 'goblin'),
            (650, 450, 'orc'),
        ]
        
        for x, y, enemy_type in enemy_positions:
            enemy = Enemy(x, y, enemy_type)
            self.enemies.add(enemy)
    
    def spawn_items(self):
        item_positions = [
            (100, 250, 'heart'),
            (700, 250, 'heart'),
            (400, 450, 'rupee'),
            (250, 350, 'rupee'),
            (550, 150, 'key'),
        ]
        
        for x, y, item_type in item_positions:
            item = Item(x, y, item_type)
            self.items.add(item)
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                
                if self.game_state in ['game_over', 'victory']:
                    if event.key == pygame.K_r:
                        self.restart_game()
    
    def restart_game(self):
        self.player = Player(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
        self.enemies.empty()
        self.items.empty()
        self.walls.clear()
        self.score = 0
        self.keys = 0
        self.create_dungeon()
        self.game_state = 'playing'
    
    def update(self):
        if self.game_state != 'playing':
            return
        
        self.player.update(self.walls)
        
        for enemy in self.enemies:
            enemy.update(self.player, self.walls)
        
        if self.player.is_attacking and self.player.sword_rect:
            for enemy in self.enemies:
                if self.player.sword_rect.colliderect(enemy.rect):
                    enemy.take_damage(PLAYER_ATTACK_DAMAGE)
        
        for item in self.items:
            if self.player.rect.colliderect(item.rect):
                if item.effect == 'heal':
                    if self.player.health < self.player.max_health:
                        self.player.health += item.value
                        item.kill()
                elif item.effect == 'score':
                    self.score += item.value
                    item.kill()
                elif item.effect == 'key':
                    self.keys += item.value
                    item.kill()
        
        if self.player.health <= 0:
            self.game_state = 'game_over'
        
        if len(self.enemies) == 0:
            self.game_state = 'victory'
    
    def draw(self):
        self.screen.fill(DARK_GRAY)
        
        for wall in self.walls:
            pygame.draw.rect(self.screen, BROWN, wall)
        
        self.player.draw(self.screen)
        
        for enemy in self.enemies:
            enemy.draw(self.screen)
        
        for item in self.items:
            item.draw(self.screen)
        
        self.draw_ui()
        
        if self.game_state == 'game_over':
            self.draw_game_over()
        elif self.game_state == 'victory':
            self.draw_victory()
        
        pygame.display.flip()
    
    def draw_ui(self):
        heart_spacing = HEART_SIZE + 5
        start_x = 10
        start_y = 10
        
        full_hearts = self.player.health
        
        for i in range(self.player.max_health):
            heart_x = start_x + i * heart_spacing
            heart_y = start_y
            
            if i < full_hearts:
                pygame.draw.rect(self.screen, RED, 
                               (heart_x, heart_y, HEART_SIZE, HEART_SIZE))
                pygame.draw.circle(self.screen, RED, 
                                 (heart_x + 10, heart_y), 10)
                pygame.draw.circle(self.screen, RED, 
                                 (heart_x + HEART_SIZE - 10, heart_y), 10)
            else:
                pygame.draw.rect(self.screen, DARK_GRAY, 
                               (heart_x, heart_y, HEART_SIZE, HEART_SIZE), 2)
        
        enemies_text = self.small_font.render(f'Enemies: {len(self.enemies)}', True, WHITE)
        self.screen.blit(enemies_text, (SCREEN_WIDTH - 150, 10))
        
        score_text = self.small_font.render(f'Rupees: {self.score}', True, WHITE)
        self.screen.blit(score_text, (SCREEN_WIDTH - 150, 40))
        
        keys_text = self.small_font.render(f'Keys: {self.keys}', True, WHITE)
        self.screen.blit(keys_text, (SCREEN_WIDTH - 150, 70))
    
    def draw_game_over(self):
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))
        
        game_over_text = self.font.render('GAME OVER', True, RED)
        restart_text = self.small_font.render('Press R to Restart', True, WHITE)
        
        text_rect = game_over_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 30))
        restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 30))
        
        self.screen.blit(game_over_text, text_rect)
        self.screen.blit(restart_text, restart_rect)
    
    def draw_victory(self):
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
        overlay.set_alpha(200)
        overlay.fill(BLACK)
        self.screen.blit(overlay, (0, 0))
        
        victory_text = self.font.render('VICTORY!', True, YELLOW)
        restart_text = self.small_font.render('Press R to Restart', True, WHITE)
        
        text_rect = victory_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 30))
        restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 30))
        
        self.screen.blit(victory_text, text_rect)
        self.screen.blit(restart_text, restart_rect)
    
    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()

if __name__ == '__main__':
    game = Game()
    game.run()
