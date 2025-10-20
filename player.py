import pygame
import math
from settings import *

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((TILE_SIZE - 4, TILE_SIZE - 4))
        self.image.fill(GREEN)
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        
        self.vel_x = 0
        self.vel_y = 0
        
        self.health = PLAYER_MAX_HEALTH
        self.max_health = PLAYER_MAX_HEALTH
        
        self.direction = 'down'
        
        self.is_attacking = False
        self.attack_time = 0
        self.last_attack_time = 0
        
        self.sword_rect = None
        
    def get_input(self):
        if self.is_attacking:
            return
            
        keys = pygame.key.get_pressed()
        
        self.vel_x = 0
        self.vel_y = 0
        
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.vel_x = -PLAYER_SPEED
            self.direction = 'left'
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.vel_x = PLAYER_SPEED
            self.direction = 'right'
            
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            self.vel_y = -PLAYER_SPEED
            self.direction = 'up'
        elif keys[pygame.K_DOWN] or keys[pygame.K_s]:
            self.vel_y = PLAYER_SPEED
            self.direction = 'down'
            
        if keys[pygame.K_SPACE]:
            self.attack()
    
    def attack(self):
        current_time = pygame.time.get_ticks()
        if current_time - self.last_attack_time < ATTACK_COOLDOWN:
            return
            
        self.is_attacking = True
        self.attack_time = current_time
        self.last_attack_time = current_time
        
        sword_width = 40
        sword_height = 40
        
        if self.direction == 'up':
            self.sword_rect = pygame.Rect(
                self.rect.centerx - sword_width // 2,
                self.rect.top - sword_height,
                sword_width,
                sword_height
            )
        elif self.direction == 'down':
            self.sword_rect = pygame.Rect(
                self.rect.centerx - sword_width // 2,
                self.rect.bottom,
                sword_width,
                sword_height
            )
        elif self.direction == 'left':
            self.sword_rect = pygame.Rect(
                self.rect.left - sword_width,
                self.rect.centery - sword_height // 2,
                sword_width,
                sword_height
            )
        elif self.direction == 'right':
            self.sword_rect = pygame.Rect(
                self.rect.right,
                self.rect.centery - sword_height // 2,
                sword_width,
                sword_height
            )
    
    def update_attack(self):
        if self.is_attacking:
            current_time = pygame.time.get_ticks()
            if current_time - self.attack_time > ATTACK_DURATION:
                self.is_attacking = False
                self.sword_rect = None
    
    def move(self, walls):
        if self.is_attacking:
            return
            
        old_x = self.rect.x
        self.rect.x += self.vel_x
        
        for wall in walls:
            if self.rect.colliderect(wall):
                self.rect.x = old_x
                break
        
        old_y = self.rect.y
        self.rect.y += self.vel_y
        
        for wall in walls:
            if self.rect.colliderect(wall):
                self.rect.y = old_y
                break
        
        self.rect.x = max(0, min(self.rect.x, SCREEN_WIDTH - self.rect.width))
        self.rect.y = max(0, min(self.rect.y, SCREEN_HEIGHT - self.rect.height))
    
    def take_damage(self, damage):
        self.health -= damage
        if self.health < 0:
            self.health = 0
    
    def update(self, walls):
        self.get_input()
        self.update_attack()
        self.move(walls)
    
    def draw(self, screen):
        screen.blit(self.image, self.rect)
        
        if self.is_attacking and self.sword_rect:
            pygame.draw.rect(screen, YELLOW, self.sword_rect)
