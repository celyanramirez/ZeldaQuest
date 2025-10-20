# Overview

This is a hybrid project containing both a classic 2D Zelda-style adventure game built with Python/Pygame and a 3D web-based game built with React, Three.js, and TypeScript. The Python game features top-down dungeon exploration with sword combat, enemy AI, and health management. The web version provides a 3D interpretation with similar gameplay mechanics rendered in the browser.

The project includes a full-stack web application architecture with Express backend, PostgreSQL database support via Drizzle ORM, and a modern React frontend using shadcn/ui components and React Three Fiber for 3D rendering.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Python/Pygame Game (Legacy/Desktop)**
- Classic sprite-based 2D rendering using Pygame
- Game loop architecture with separate modules for player, enemies, and items
- Entity-Component pattern with sprite groups for collision detection
- Settings-based configuration for game constants

**React/Three.js Web Game (Primary)**
- React Three Fiber for declarative 3D scene management
- Component-based architecture separating game entities (Player, Enemy, Terrain)
- Zustand for state management across game stores (player, enemy, audio, game phase)
- Top-down orthographic camera view mimicking 2D Zelda perspective
- KeyboardControls from @react-three/drei for input handling
- Radix UI components (shadcn/ui) for game UI overlays

**Design Pattern**
- Separation of concerns: game logic in stores, rendering in components
- Reactive state management allowing UI to respond to game state changes
- Hook-based composition for game utilities and state access

## Backend Architecture

**Express Server**
- TypeScript-based Express application
- Modular route registration system
- Development mode includes Vite middleware for HMR
- Production mode serves static built assets
- Request/response logging middleware for API debugging

**Storage Layer**
- Abstract storage interface (IStorage) for CRUD operations
- In-memory storage implementation (MemStorage) for development
- Designed to be swappable with PostgreSQL implementation
- User entity schema defined with Drizzle ORM

**Build System**
- Vite for frontend bundling with React plugin
- esbuild for server-side TypeScript compilation
- Separate build outputs: client to dist/public, server to dist
- Path aliases (@/, @shared/) for clean imports

## Data Storage

**Database**
- PostgreSQL configured via Drizzle ORM
- Schema definition in shared/schema.ts using Drizzle's table builders
- Zod integration for runtime validation (insertUserSchema)
- Migration support through drizzle-kit
- Connection via @neondatabase/serverless for serverless PostgreSQL

**Schema Design**
- Users table with serial ID, unique username, and password fields
- Extensible schema pattern allowing additional tables
- Type-safe queries through Drizzle's TypeScript integration

**Note**: The application currently uses in-memory storage but includes full Drizzle/PostgreSQL setup for future database integration.

## External Dependencies

**Core Game Libraries**
- Pygame 2.6.1+ for Python 2D game rendering
- React Three Fiber (@react-three/fiber) for WebGL 3D rendering
- @react-three/drei for Three.js helpers (KeyboardControls, useTexture)
- @react-three/postprocessing for visual effects
- Three.js as the underlying 3D engine

**UI Framework**
- Radix UI primitives for accessible component foundations
- Tailwind CSS for styling with custom design tokens
- shadcn/ui component library built on Radix
- class-variance-authority for component variants
- Inter font via @fontsource/inter

**State Management**
- Zustand for lightweight React state management
- @tanstack/react-query for server state and caching
- Separate stores for player, enemies, audio, and game phase

**Backend Services**
- Express.js web framework
- Drizzle ORM with PostgreSQL dialect
- @neondatabase/serverless for database connectivity
- Vite for development server and build tooling

**Development Tools**
- TypeScript for type safety across client and server
- tsx for running TypeScript Node.js code
- esbuild for fast bundler-based builds
- drizzle-kit for database migrations
- vite-plugin-glsl for shader support

**Asset Management**
- Texture loading via @react-three/drei
- Audio file support (.mp3, .ogg, .wav)
- 3D model support (.gltf, .glb) configured in Vite