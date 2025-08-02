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
  - Manages inventory (hotbar + main), factory grid, world chunks, and player positions
  - Provides actions for all game mutations including player movement in both modes
  - Handles procedural world generation with biome-based resource distribution
  - Tracks player position both globally (chunks) and locally (within chunk)
  - Manages experience/leveling system with XP calculations and level-up benefits
  - Separate factory player position (factoryPlayerX, factoryPlayerY) with bounds checking

### Game Systems
- **gameLoop.ts** (src/systems/gameLoop.ts:1) - Runs at 20 TPS (ticks per second) for smooth gameplay
  - Handles furnace smelting with internal fuel buffer system (consumes 1 fuel per second)
  - Manages coke oven processing for advanced materials
  - Automatically transfers items between machines via configurable input/output sides
  - Pulls fuel from adjacent chests when buffer is low
  - Processes enemy movement towards player in explore mode (40 tick cooldown = 2 seconds)
  - Checks for player-enemy collision to trigger combat
  - Uses tick counter for precise timing of operations

- **gridHandlers.ts** (src/systems/gridHandlers.ts:1) - Handles all grid interactions
  - Factory placement and machine interactions with 5-tile distance checking
  - World resource harvesting (requires adjacent player position)
  - Tool durability management
  - Blocks all interactions during active combat

### Component Structure
- **App.tsx** (src/App.tsx:1) - Main layout with three-column design
  - Left: Minecraft-style inventory, machine details, and minimap (in explore mode)
  - Center: Main game view with mode toggle (Factory/Explore)
  - Right: Recipe book with crafting interface

- **styles/combat.css** - Combat animation definitions
  - Attack swing animations with rotation and scale
  - Critical hit effects with color shifts
  - Damage flash filters for sprites
  - Screen shake effect
  - Health pulse animations
  - Floating damage numbers and miss indicators
  - Sound wave visual effects
  - Turn indicator glows

- **MinecraftInventory.tsx** - Minecraft-style inventory system
  - 9 hotbar slots + 27 main inventory slots + 4-slot 2x2 crafting grid
  - Advanced drag-to-distribute system:
    - Left-click drag: Distributes entire stack evenly across slots
    - Right-click drag: Places one item per slot
    - Single clicks: Places entire stack in one slot
    - Visual previews during drag operations (semi-transparent items)
  - Shift-click for quick transfer between inventory sections
  - Right-click to split stacks
  - Automatic recipe detection for 2x2 crafting with real-time output updates

- **MainGrid.tsx** - Dual-mode game view
  - Factory mode: 10x10 grid for placing machines with player-controlled movement
    - Player avatar renders on factory grid at current position
    - WASD/arrow key movement within factory bounds (0-9)
    - 5-tile interaction radius using Manhattan distance (≤5 tiles)
    - Visual highlighting for tiles within reach
    - Distance checking prevents interactions outside radius
  - Explore mode: 10x10 world view with player avatar and enemies
  - Keyboard controls (WASD/arrows) for player movement (blocked during combat)
  - Visual indicators for reachable tiles (fixed to prevent wrapping)
  - Renders enemy sprites on the world grid

- **Minimap.tsx** - World navigation aid (explore mode only)
  - 7x7 chunk overview with biome colors
  - Shows explored vs unexplored areas
  - Player position indicator and coordinates
  - Compass directions

- **RecipeBook.tsx** - Interactive recipe browser and grid-filling system
  - Displays all available recipes with material requirements
  - Smart recipe filtering based on available materials and crafting context
  - "Fill" button places recipe pattern directly into appropriate crafting grid
  - Automatically detects 2x2 vs 3x3 crafting bench context
  - Real-time material availability checking with color-coded tooltips

- **CraftingBenchUI.tsx** - 3x3 crafting bench interface
  - Full 3x3 crafting grid for complex recipes
  - Same advanced drag-to-distribute system as inventory
  - Visual previews during drag operations
  - Smart output slot interactions:
    - Left-click: Pick up crafted items (stackable with cursor)
    - Shift-click: Auto-craft maximum possible quantity until materials run out or recipe changes
  - Integrated recipe book for pattern filling

- **CombatModal.tsx** - Turn-based combat interface
  - Full-screen modal that blocks all other interactions
  - Final Fantasy-style turn-based combat with animations
  - Heart-based health display (each heart = 10 HP) with smooth transitions
  - Player level and XP progress bar displayed prominently
  - Three action buttons: Attack, Defend, and Run Away
  - Attack: 10-20 damage with 10% miss chance and 20% critical hit chance (1.5x damage)
  - Defend: Reduces incoming damage by 5-10 points for one turn
  - Run Away: 50% success rate, enemy gets free attack if failed
  - Visual effects: damage numbers, miss indicators, sound wave animations
  - Screen shake on player damage, sprite animations for attacks
  - Turn indicators with glowing borders (green for player, red for enemy)
  - Combat log at bottom of screen shows XP gains and level ups
  - Experience/Leveling System:
    - Enemy defeats grant XP: slime (10), goblin (20), wolf (30)
    - Level progression: each level requires level * 100 XP
    - Level up increases max HP by 10 and fully heals player
    - Player death resets XP progress towards current level and returns to factory mode
  - Enemy miss chance: 15%

### Data Architecture
- **types/index.ts** - TypeScript definitions for all game entities
  - Inventory system with item/count structure
  - Machine types: Furnace (with fuel buffer), Coke Oven, Chest
  - World chunks with biome data, resource tiles, and enemy arrays
  - Enemy type with position, HP, damage, and movement cooldown
  - CombatState for managing turn-based combat
  - Player progression: level, experience, experienceToNext, experienceProgress
  - Factory player position: factoryPlayerX, factoryPlayerY (separate from world position)

- **data/** directory contains game content:
  - items.ts - Item definitions with fuel values and properties
  - recipes.ts - Crafting (3x3 grid), smelting, and coke oven recipes
    - Smelting times: iron_ore (100 ticks/5s), brick_mixture (60 ticks/3s)
    - Coke oven times: wood to coal_coke (200 ticks/10s)
  - biomes.ts - 5 biomes with unique resource distributions and smaller biome sizes (0.3 frequency)
  - icons.tsx - SVG components for all items, player avatar, enemies (slime, goblin, wolf), and world resources

### Key Game Mechanics
1. **Game Loop**: Runs at 20 TPS (50ms per tick) for smooth gameplay
2. **Player-Centric Exploration**: Control a character avatar to explore and gather resources
3. **Dual View System**: Switch between factory automation and world exploration
4. **Proximity-Based Interaction**: Must be adjacent to resources/machines to interact
5. **Fuel Buffer System**: Furnaces consume fuel items immediately into internal buffer (1 fuel per second while smelting)
6. **Machine Automation**: Configurable I/O sides for complex automation setups
7. **Tool Durability**: Tools degrade with use and break when depleted
8. **Procedural World**: Infinite chunk-based world with biome variation
9. **Visual Feedback**: Selected machines highlighted, reachable tiles indicated
10. **Enemy System**: 
    - Enemies spawn 1-3 per chunk (slime, goblin, wolf with different stats)
    - Enemies move towards player every 2 seconds (40 tick cooldown)
    - Combat triggers immediately when player and enemy collide
11. **Combat System**:
   - Turn-based combat in full-screen modal with extensive animations
   - Player has 100 HP (base), enemies vary (slime: 20 HP/5 damage, goblin: 30 HP/8 damage, wolf: 40 HP/12 damage)
   - Player actions:
     - Attack: 10-20 damage, 10% miss chance, 20% critical hit chance (1.5x damage)
     - Defend: Block 5-10 damage on next enemy attack
     - Run: 50% success rate, enemy attacks if failed
   - Enemy attacks: Base damage + 0-5, 15% miss chance
   - Visual effects: Damage numbers, sprite animations, screen shake, turn indicators
12. **Experience/Leveling System**:
   - Enemy defeats grant XP: slime (10), goblin (20), wolf (30)
   - Level progression: each level requires level * 100 XP (100, 200, 300, etc.)
   - Level up benefits: +10 max HP, full heal
   - Death penalty: lose XP progress toward current level, return to factory mode
   - Combat UI shows level and XP progress bar
13. **Factory Player Movement**:
   - Player avatar renders on factory grid with WASD/arrow movement
   - 5-tile interaction radius using Manhattan distance
   - Visual highlighting for reachable tiles
   - Movement bounded within 10x10 factory grid (0-9 coordinates)
   - Separate position state from exploration mode

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