# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server at http://localhost:5173
npm run build    # Build for production (runs TypeScript check first)
npm run preview  # Preview production build
```

## Project Overview

IdleCrafter Singularity is a browser-based automation and exploration game built with Solid.js, TypeScript, and Tailwind CSS. Players control a character to gather resources and build automated factories.

## High-Level Architecture

### Core State Management
- **gameStore.ts** (src/stores/gameStore.ts:1) - Central game state using Solid.js stores
  - Manages inventory (hotbar + main), factory grid, world chunks, and player position
  - Provides actions for all game mutations including player movement
  - Handles procedural world generation with biome-based resource distribution
  - Tracks player position both globally (chunks) and locally (within chunk)

### Game Systems
- **gameLoop.ts** (src/systems/gameLoop.ts:1) - Processes machine operations and enemy movement every second
  - Handles furnace smelting with internal fuel buffer system
  - Manages coke oven processing for advanced materials
  - Automatically transfers items between machines via configurable input/output sides
  - Pulls fuel from adjacent chests when buffer is low
  - Processes enemy movement towards player in explore mode
  - Checks for player-enemy collision to trigger combat

- **gridHandlers.ts** (src/systems/gridHandlers.ts:1) - Handles all grid interactions
  - Factory placement and machine interactions
  - World resource harvesting (requires adjacent player position)
  - Tool durability management
  - Blocks all interactions during active combat

### Component Structure
- **App.tsx** (src/App.tsx:1) - Main layout with three-column design
  - Left: Minecraft-style inventory, machine details, and minimap (in explore mode)
  - Center: Main game view with mode toggle (Factory/Explore)
  - Right: Recipe book with crafting interface

- **MinecraftInventory.tsx** - Minecraft-style inventory system
  - 9 hotbar slots + 27 main inventory slots
  - Drag and drop with cursor item tracking
  - Shift-click for quick transfer
  - Right-click to split stacks

- **MainGrid.tsx** - Dual-mode game view
  - Factory mode: 10x10 grid for placing machines
  - Explore mode: 10x10 world view with player avatar and enemies
  - Keyboard controls (WASD/arrows) for player movement (blocked during combat)
  - Visual indicators for reachable tiles (fixed to prevent wrapping)
  - Renders enemy sprites on the world grid

- **Minimap.tsx** - World navigation aid (explore mode only)
  - 7x7 chunk overview with biome colors
  - Shows explored vs unexplored areas
  - Player position indicator and coordinates
  - Compass directions

- **CombatModal.tsx** - Turn-based combat interface
  - Full-screen modal that blocks all other interactions
  - Final Fantasy-style turn-based combat
  - Heart-based health display (each heart = 10 HP)
  - Attack and Run actions with success/failure mechanics
  - Combat log at bottom of screen
  - Handles player defeat (respawn at origin) and enemy defeat

### Data Architecture
- **types/index.ts** - TypeScript definitions for all game entities
  - Inventory system with item/count structure
  - Machine types: Furnace (with fuel buffer), Coke Oven, Chest
  - World chunks with biome data, resource tiles, and enemy arrays
  - Enemy type with position, HP, damage, and movement cooldown
  - CombatState for managing turn-based combat

- **data/** directory contains game content:
  - items.ts - Item definitions with fuel values and properties
  - recipes.ts - Crafting (3x3 grid), smelting, and coke oven recipes
  - biomes.ts - 5 biomes with unique resource distributions and smaller biome sizes (0.3 frequency)
  - icons.tsx - SVG components for all items, player avatar, enemies (slime, goblin, wolf), and world resources

### Key Game Mechanics
1. **Player-Centric Exploration**: Control a character avatar to explore and gather resources
2. **Dual View System**: Switch between factory automation and world exploration
3. **Proximity-Based Interaction**: Must be adjacent to resources/machines to interact
4. **Fuel Buffer System**: Furnaces consume fuel items immediately into internal buffer
5. **Machine Automation**: Configurable I/O sides for complex automation setups
6. **Tool Durability**: Tools degrade with use and break when depleted
7. **Procedural World**: Infinite chunk-based world with biome variation
8. **Visual Feedback**: Selected machines highlighted, reachable tiles indicated
9. **Enemy System**: 
   - Enemies spawn 1-3 per chunk (slime, goblin, wolf with different stats)
   - Enemies move towards player every 2 seconds
   - Combat triggers when enemy reaches player
10. **Combat System**:
   - Turn-based combat in full-screen modal
   - Player has 100 HP, enemies vary (slime: 20, goblin: 30, wolf: 40)
   - Attack deals 10-20 damage, enemies deal base damage + 0-5
   - Run action has 50% success rate
   - Death respawns player at origin (0,0)

## Development Guidelines

When implementing new features:
1. Follow the existing state management pattern in gameStore
2. Add new machine types to the Machine union type
3. Process new machines in the game loop
4. Use the existing icon system for visual consistency
5. Maintain the chunk-based world generation approach

### Important: Avoiding Store Mutations in Solid.js

When updating stores in Solid.js, NEVER mutate nested objects or arrays directly. This will cause "Cannot mutate a Store directly" errors.

**Wrong way:**
```typescript
gameActions.updateMachine(index, (m) => {
  m.inventory.slot.count++; // DIRECT MUTATION - BAD!
  return m;
});
```

**Correct way:**
```typescript
gameActions.updateMachine(index, (m) => {
  return {
    ...m,
    inventory: {
      ...m.inventory,
      slot: { ...m.inventory.slot, count: m.inventory.slot.count + 1 }
    }
  };
});
```

For arrays, always create new arrays:
```typescript
const newInventory = [...m.inventory];
newInventory[i] = { ...newInventory[i], count: newCount };
```