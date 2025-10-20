import pygame
from settings import *

class Item(pygame.sprite.Sprite):
    def __init__(self, x, y, item_type='heart'):
        super().__init__()
        self.item_type = item_type
        
        if item_type == 'heart':
            self.image = pygame.Surface((20, 20))
            self.image.fill(RED)
            self.effect = 'heal'
            self.value = 1
        elif item_type == 'rupee':
            self.image = pygame.Surface((20, 20))
            self.image.fill(GREEN)
            self.effect = 'score'
            self.value = 10
        elif item_type == 'key':
            self.image = pygame.Surface((20, 20))
            self.image.fill(YELLOW)
            self.effect = 'key'
            self.value = 1
        
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
    
    def draw(self, screen):
        if self.item_type == 'heart':
            pygame.draw.circle(screen, RED, 
                             (self.rect.centerx - 5, self.rect.centery), 8)
            pygame.draw.circle(screen, RED, 
                             (self.rect.centerx + 5, self.rect.centery), 8)
            pygame.draw.polygon(screen, RED, [
                (self.rect.centerx - 12, self.rect.centery),
                (self.rect.centerx + 12, self.rect.centery),
                (self.rect.centerx, self.rect.centery + 15)
            ])
        elif self.item_type == 'rupee':
            points = [
                (self.rect.centerx, self.rect.centery - 10),
                (self.rect.centerx + 8, self.rect.centery - 3),
                (self.rect.centerx + 5, self.rect.centery + 8),
                (self.rect.centerx - 5, self.rect.centery + 8),
                (self.rect.centerx - 8, self.rect.centery - 3),
            ]
            pygame.draw.polygon(screen, GREEN, points)
        elif self.item_type == 'key':
            pygame.draw.circle(screen, YELLOW, 
                             (self.rect.centerx - 5, self.rect.centery - 3), 6)
            pygame.draw.rect(screen, YELLOW, 
                           (self.rect.centerx - 2, self.rect.centery + 3, 4, 10))
            pygame.draw.rect(screen, YELLOW, 
                           (self.rect.centerx + 2, self.rect.centery + 10, 6, 3))
