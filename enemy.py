import pygame
import math
import random
from settings import *

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y, enemy_type='goblin'):
        super().__init__()
        
        self.enemy_type = enemy_type
        
        if enemy_type == 'goblin':
            self.image = pygame.Surface((TILE_SIZE - 8, TILE_SIZE - 8))
            self.image.fill(RED)
            self.health = 2
            self.speed = 1.5
            self.damage = 1
        elif enemy_type == 'orc':
            self.image = pygame.Surface((TILE_SIZE - 4, TILE_SIZE - 4))
            self.image.fill((139, 0, 0))
            self.health = 4
            self.speed = 1.2
            self.damage = 2
        else:
            self.image = pygame.Surface((TILE_SIZE - 6, TILE_SIZE - 6))
            self.image.fill((128, 0, 128))
            self.health = 3
            self.speed = 2
            self.damage = 1
        
        self.max_health = self.health
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        
        self.pos_x = float(x)
        self.pos_y = float(y)
        
        self.vel_x = 0
        self.vel_y = 0
        
        self.state = 'idle'
        self.patrol_timer = 0
        self.patrol_direction = random.choice(['left', 'right', 'up', 'down'])
        
        self.last_attack_time = 0
        self.detection_range = 200
        self.attack_range = 40
        
    def update(self, player, walls):
        distance_to_player = math.sqrt(
            (self.rect.centerx - player.rect.centerx) ** 2 +
            (self.rect.centery - player.rect.centery) ** 2
        )
        
        if distance_to_player < self.detection_range:
            self.state = 'chase'
            self.chase_player(player, walls)
        else:
            self.state = 'patrol'
            self.patrol(walls)
        
        if distance_to_player < self.attack_range:
            self.attack_player(player)
    
    def chase_player(self, player, walls):
        dx = player.rect.centerx - self.rect.centerx
        dy = player.rect.centery - self.rect.centery
        distance = math.sqrt(dx ** 2 + dy ** 2)
        
        if distance > 0:
            dx /= distance
            dy /= distance
            
            self.vel_x = dx * self.speed
            self.vel_y = dy * self.speed
            
            self.move(walls)
    
    def patrol(self, walls):
        self.patrol_timer += 1
        
        if self.patrol_timer > 120:
            self.patrol_timer = 0
            self.patrol_direction = random.choice(['left', 'right', 'up', 'down'])
        
        patrol_speed = max(1.0, self.speed * 0.6)
        
        if self.patrol_direction == 'left':
            self.vel_x = -patrol_speed
            self.vel_y = 0
        elif self.patrol_direction == 'right':
            self.vel_x = patrol_speed
            self.vel_y = 0
        elif self.patrol_direction == 'up':
            self.vel_x = 0
            self.vel_y = -patrol_speed
        elif self.patrol_direction == 'down':
            self.vel_x = 0
            self.vel_y = patrol_speed
        
        self.move(walls)
    
    def move(self, walls):
        old_x = self.pos_x
        self.pos_x += self.vel_x
        self.rect.x = int(self.pos_x)
        
        for wall in walls:
            if self.rect.colliderect(wall):
                self.pos_x = old_x
                self.rect.x = int(old_x)
                if self.state == 'patrol':
                    self.patrol_direction = random.choice(['left', 'right', 'up', 'down'])
                break
        
        old_y = self.pos_y
        self.pos_y += self.vel_y
        self.rect.y = int(self.pos_y)
        
        for wall in walls:
            if self.rect.colliderect(wall):
                self.pos_y = old_y
                self.rect.y = int(old_y)
                if self.state == 'patrol':
                    self.patrol_direction = random.choice(['left', 'right', 'up', 'down'])
                break
    
    def attack_player(self, player):
        current_time = pygame.time.get_ticks()
        if current_time - self.last_attack_time > ENEMY_ATTACK_COOLDOWN:
            player.take_damage(self.damage)
            self.last_attack_time = current_time
    
    def take_damage(self, damage):
        self.health -= damage
        if self.health <= 0:
            self.kill()
    
    def draw(self, screen):
        screen.blit(self.image, self.rect)
        
        health_bar_width = 40
        health_bar_height = 5
        health_percentage = self.health / self.max_health
        
        pygame.draw.rect(screen, RED, 
                        (self.rect.centerx - health_bar_width // 2, 
                         self.rect.top - 10, 
                         health_bar_width, 
                         health_bar_height))
        
        pygame.draw.rect(screen, GREEN, 
                        (self.rect.centerx - health_bar_width // 2, 
                         self.rect.top - 10, 
                         health_bar_width * health_percentage, 
                         health_bar_height))
